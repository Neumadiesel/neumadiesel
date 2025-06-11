"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { installedTiresDTO } from "@/types/Tire";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";

// Extender con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface LocationMaintenanceDTO {
    id: number;
    description: string;
}

interface RazonDto {
    id: number;
    name: string;
    description: string;
}

interface ModalDesmontarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    tire: installedTiresDTO | null;
    onGuardar: () => void;
}

export default function ModalDesmontarNeumatico({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalDesmontarNeumaticoProps) {
    const [tireDesmonted, setTireDesmonted] = useState({
        code: "",
        tireId: null as number | null,
        externalTread: 0,
        internalTread: 0,
    });
    const [locations, setLocations] = useState<LocationMaintenanceDTO[]>([] as LocationMaintenanceDTO[]);
    const [razones, setRazones] = useState<RazonDto[]>([] as RazonDto[]);
    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [locationId, setLocationId] = useState<number | null>(null);
    const [executeTime, setExecuteTime] = useState<number | null>(null);
    const [reasonId, setReasonId] = useState<number | null>(null);
    const [otCode, setOtCode] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (tire) {
            if (tire.tire.lastInspection) {
                console.log("tireId", tire.tire.id);
                setTireDesmonted({
                    code: tire.tire.code,
                    tireId: tire.tire.id,
                    externalTread: tire.tire.lastInspection.externalTread,
                    internalTread: tire.tire?.lastInspection.internalTread,
                });
            } else {
                console.log("tireId", tire.tire.id);
                setTireDesmonted({
                    code: tire.tire.code,
                    tireId: tire.tire.id,
                    externalTread: tire.tire.initialTread,
                    internalTread: tire.tire?.initialTread,
                });
            }

        }
    }, [tire]);




    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/location-maintenance`);
            const data = await response.json();
            console.log("locations", data);
            setLoading(false);
            setLocations(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    const fetchRazones = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/retirement-reason`);
            const data = await response.json();
            console.log("razones", data);
            setLoading(false);
            setRazones(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };


    useEffect(() => {
        fetchLocations();
        fetchRazones();
    }, []);


    if (!visible || !tire) return null;

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { tireId, internalTread, externalTread } = tireDesmonted;
        if (!tireId || !internalTread || !externalTread || !actionDate || !executeTime || !otCode || !reasonId) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        console.log("Data a enviar", {
            tireId,
            internalTread,
            externalTread,
            vehicleId: tire.vehicleId,
            actionDate: actionDate.toISOString(),
            locationId,
            executeTime,
            reasonId,
            otCode,
        });
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance/dismount`, {
                tireId,
                retirementReasonId: reasonId,  // ✅ CORREGIDO
                locationId,
                executionDate: actionDate.toISOString(),
                executionTime: executeTime,    // ✅ CORREGIDO
                internalTread,
                externalTread,
            }

            );

            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            handleCancel();
            setLoading(false);
        }
    };



    const handleCancel = () => {
        setTireDesmonted({
            code: "",
            tireId: null,
            externalTread: 0,
            internalTread: 0,
        });
        setActionDate(dayjs().tz('America/Santiago'));
        setLocationId(null);
        setExecuteTime(null);
        setReasonId(null);
        setOtCode(null);
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] dark:text-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Desmontar Neumático del Equipo</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-4">
                    {/* Codigo del neumatico */}
                    <label className="text-sm mt-2 font-semibold mb-2">Código</label>
                    <input
                        disabled
                        name="Codigo Neumatico"
                        value={tireDesmonted.code}
                        placeholder="Código Neumático"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Fecha de accion con hora */}
                    <label className="text-sm mt-2 font-semibold mb-2">Fecha de Desmontaje</label>
                    <input
                        type="datetime-local"
                        name="Fecha de Desmontaje"
                        value={actionDate ? actionDate.format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => {
                            // Asumimos que lo que el usuario selecciona es en hora chilena
                            const newDate = dayjs.tz(e.target.value, 'America/Santiago');
                            setActionDate(newDate);
                        }}
                        placeholder="Fecha de Desmontaje"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Tiempo de desmontaje */}
                    <label className="text-sm mt-2 font-semibold mb-2">Tiempo de Desmontaje</label>
                    <input
                        type="number"
                        name="Tiempo de Desmontaje"
                        min={0}
                        value={executeTime || ""}
                        onChange={
                            (e) => setExecuteTime(parseFloat(e.target.value))
                        }
                        placeholder="Tiempo de Desmontaje"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Locacion */}
                    <label className="text-sm mt-2 font-semibold mb-2">Lugar de Trabajo</label>
                    <select
                        name="Lugar de Trabajo"
                        value={locationId || ""}
                        onChange={(e) => setLocationId(parseInt(e.target.value))}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona una locación</option>
                        {locations.map((location) => (


                            <option key={location.id} value={location.id}>
                                {location.description}
                            </option>

                        ))}
                    </select>
                    {/* Razon */}
                    <label className="text-sm mt-2 font-semibold mb-2">Razón de Desmontaje</label>
                    <select
                        name="Razon de Desmontaje"
                        value={reasonId || ""}
                        onChange={(e) => setReasonId(parseInt(e.target.value))}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona una razón</option>
                        {razones.map((razon) => (
                            <option key={razon.id} value={razon.id}>
                                {razon.name}
                            </option>

                        ))}
                    </select>
                    {/* OT */}
                    <label className="text-sm mt-2 font-semibold mb-2">OT</label>
                    <input
                        type="text"
                        name="OT"
                        value={otCode || ""}
                        onChange={
                            (e) => setOtCode(e.target.value.toUpperCase())
                        }
                        placeholder="OT"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Remanente interior */}
                    <label className="text-sm mt-2 font-semibold mb-2">Remanente Interior</label>
                    <input
                        type="number"
                        name="Remanente Interior"
                        min={0}
                        value={tireDesmonted.internalTread}
                        onChange={
                            (e) => setTireDesmonted({ ...tireDesmonted, internalTread: parseFloat(e.target.value) })
                        }
                        placeholder="Remanente Interior"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Remanente exterior */}
                    <label className="text-sm mt-2 font-semibold mb-2">Remanente Exterior</label>
                    <input
                        type="number"
                        name="Remanente Exterior"
                        min={0}
                        value={tireDesmonted.externalTread}
                        onChange={

                            (e) => setTireDesmonted({ ...tireDesmonted, externalTread: parseFloat(e.target.value) })
                        }
                        placeholder="Remanente Exterior"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
                <LoadingSpinner isOpen={loading} />
            </div>
        </div>
    );
}
