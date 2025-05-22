"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import { TireDTO } from "@/types/Tire";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";

interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    typeId: number;
    kilometrage: number;
    hours: number;
    model: {
        id: number;
        brand: string;
        model: string;
        wheelCount: number;
    };
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    };
}


// Extender con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface LocationDTO {
    id: number;
    description: string;
}

interface ReasonDTO {
    id: number;
    description: string;
}

interface ModalAsignarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    vehicle: VehicleDTO | null;
    onGuardar: () => void;
}

export default function ModalAsignarNeumatico({
    visible,
    onClose,
    vehicle,
    onGuardar,
}: ModalAsignarNeumaticoProps) {
    const [posicion, setPosition] = useState<number | null>(null);
    const [tireIdSelected, setTireIdSelected] = useState<number | null>(null);
    const [tireCode, setTireCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [otCode, setOtCode] = useState<string | null>(null);
    const [tires, setTires] = useState<TireDTO[]>([]);
    const [tireSelected, setTireSelected] = useState<TireDTO | null>(null);
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [locationId, setLocationId] = useState<number | null>(null);
    const [reasons, setReasons] = useState<ReasonDTO[]>([]);
    const [reasonId, setReasonId] = useState<number | null>(null);

    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [executeTime, setExecuteTime] = useState<number | null>(null);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/tires/available");
            const data = await response.json();
            setTires(data);
            console.log("Neumaticos", data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchReasons = async () => {
        try {
            const response = await axios.get("https://inventory-service-emva.onrender.com/maintenance-reason");
            const data = response.data;
            setReasons(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get("https://inventory-service-emva.onrender.com/location-maintenance/");
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }

    useEffect(() => {
        fetchLocations();
        fetchReasons();
        fetchData();
    }, []);


    if (!visible || !vehicle) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);


        if (!vehicle.code || !posicion === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        const vehicleId = vehicle.id;
        const position = Number(posicion);
        const { code, lastInspection } = tireSelected || {};
        const { externalTread, internalTread } = lastInspection || {};

        const date = new Date(actionDate.format('YYYY-MM-DDTHH:mm:ss'));
        const utcDate = date.toISOString();
        try {
            const response = await axios.post(
                `https://inventory-service-emva.onrender.com/maintenance/mount`,
                {

                    "tireCode": code,
                    "vehicleId": vehicleId,
                    "position": position,
                    "maintenanceReasonId": reasonId,
                    "executionDate": utcDate,
                    "executionTime": executeTime,
                    "internalTread": internalTread || tireSelected?.initialTread,
                    "externalTread": externalTread || tireSelected?.initialTread,
                    "locationId": locationId,
                }
            );
            setPosition(null);
            setTireIdSelected(null);
            handleReset();
            fetchData();
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPosition(null);
        setTireIdSelected(null);
        setError(null);
        setOtCode(null);
        setTireCode(null);
        setActionDate(dayjs().tz('America/Santiago'));
        setExecuteTime(null);
        setReasonId(null);
        setLocationId(null);
    }
    const handleClose = () => {
        handleReset();
        setError(null);
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <section className="relative bg-white dark:bg-[#212121] p-6 rounded-md flex shadow-lg h-[80dvh] overflow-y-scroll">

                <main className="w-[60dvh] border-r border-gray-300 pr-4">
                    <h2 className="text-xl font-bold mb-4">Instalar Neumatico</h2>
                    <p className="text-sm mb-4">
                        Seleccione el neumatico a instalar y la posicion en el equipo {vehicle.code}
                    </p>


                    <div className="grid grid-cols-2 gap-2">
                        {/* Lista de modelos */}
                        <Label title="Modelo" isNotEmpty={true} />
                        <input
                            name="Codigo Equipo"
                            value={vehicle.code}
                            disabled
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Lista de posiciones segun el nuemro de ruedas dado en el modelo */}
                        <Label title="Posicion" isNotEmpty={true} />
                        <select
                            value={posicion ?? ""}
                            onChange={(e) => setPosition(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="" disabled>
                                Seleccione una posicion
                            </option>
                            {Array.from({ length: vehicle.model.wheelCount }, (_, index) => (
                                <option key={index} value={index + 1}>
                                    {`Posicion ${index + 1}`}
                                </option>
                            ))}
                        </select>
                        <Label title="Fecja de Montaje" isNotEmpty={true} />
                        <input
                            type="datetime-local"
                            name="Fecha de Montaje"
                            value={actionDate ? actionDate.format('YYYY-MM-DDTHH:mm') : ''}
                            onChange={(e) => {
                                // Asumimos que lo que el usuario selecciona es en hora chilena
                                const newDate = dayjs.tz(e.target.value, 'America/Santiago');
                                setActionDate(newDate);
                            }}
                            placeholder="Fecha de Montaje"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Tiempo de montaje */}
                        <Label title="Tiempo de Montaje" isNotEmpty={true} />
                        <input
                            type="number"
                            name="Tiempo de Montaje"
                            min={0}
                            value={executeTime || ""}
                            onChange={
                                (e) => setExecuteTime(parseFloat(e.target.value))
                            }
                            placeholder="Tiempo de Montaje"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Kilometraje del vehiculo */}
                        <Label title="Kilometraje" isNotEmpty={true} />
                        <input
                            type="number"
                            disabled
                            name="Kilometraje"
                            value={vehicle.kilometrage}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Codigo de la OT */}
                        <Label title="Codigo de la OT" isNotEmpty={true} />
                        <input
                            type="text"
                            name="Codigo de la OT"
                            value={otCode ?? ""}
                            onChange={(e) => setOtCode(e.target.value)}
                            placeholder="Codigo de la OT"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Razon */}
                        <Label title="Razon" isNotEmpty={true} />
                        <select
                            value={reasonId ?? ""}
                            onChange={(e) => setReasonId(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="" disabled>
                                Seleccione una razon
                            </option>
                            {reasons.map((reason) => (
                                <option key={reason.id} value={reason.id}>
                                    {reason.description}
                                </option>
                            ))}
                        </select>
                        {/* Ubicacion */}
                        <Label title="Ubicacion" isNotEmpty={true} />
                        <select
                            value={locationId ?? ""}
                            onChange={(e) => setLocationId(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="" disabled>
                                Seleccione una ubicacion
                            </option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                        >
                            {loading ? "Procesando..." : "Guardar Cambios"}
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                        >
                            Cancelar
                        </button>
                    </div>
                </main>
                {/* Lista de neumaticos */}
                <aside className="w-[90dvh] pl-4">
                    <h2 className="text-xl font-bold mb-4">Neumáticos Disponibles</h2>
                    <div className="overflow-y-auto h-[50dvh]">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr>
                                    <th className="border-b p-2 text-left">Código</th>
                                    <th className="border-b p-2 text-left">Marca</th>
                                    <th className="border-b p-2 text-left">Dimensiones</th>
                                    <th className="border-b p-2 text-left">Patrón</th>
                                    <th className="border-b p-2 text-left">Estado</th>
                                    <th className="border-b p-2 text-left">Remanente</th>
                                    <th className="border-b p-2 text-left">Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tires.map((tire) => (
                                    tire.locationId !== 1 && (
                                        <tr key={tire.id} className={`border-b hover:bg-gray-100 ${tireIdSelected === tire.id ? "bg-gray-200" : ""}`}>
                                            <td className="p-2">{tire.code}</td>
                                            <td className="p-2">{tire.model.brand}</td>
                                            <td className="p-2">{tire.model.dimensions}</td>
                                            <td className="p-2">{tire.model.pattern}</td>
                                            <td className="p-2">
                                                {tire.lastInspection
                                                    ? `INT: ${tire.lastInspection.internalTread} | EXT: ${tire.lastInspection.externalTread}`
                                                    : 'Nuevo'}
                                            </td>
                                            <td className="p-2">
                                                {tire.lastInspection
                                                    ? `${tire.lastInspection.externalTread} - 
                                                    ${tire.lastInspection.internalTread}`
                                                    : `${tire.initialTread} - ${tire.initialTread}`}
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="checkbox"
                                                    checked={tireCode === tire.code}
                                                    onChange={() => {
                                                        setTireCode(tire.code);
                                                        setTireSelected(tire);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mostrar error si existe */}
                    {error && <div className="text-red-500 flex justify-between text-sm h-[10dvh] mt-2 overflow-y-scroll bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                        <button onClick={() => setError("")} className=" text-red-500 pr-2">
                            X
                        </button>
                    </div>}
                </aside>
                <LoadingSpinner isOpen={loading} />

            </section>
        </div>
    );
}
