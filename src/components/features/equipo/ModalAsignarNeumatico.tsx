"use client";

import { useState, useEffect } from "react";

import Label from "@/components/common/forms/Label";
import { TireDTO } from "@/types/Tire";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import MultiSelect from "@/components/common/select/MultiSelect";
import { FaPlusCircle } from "react-icons/fa";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import Cross from "@/components/common/icons/Cross";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuthFetch } from "@/utils/AuthFetch";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
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


interface ModalAsignarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    vehicle: VehicleDTO | null;
    onGuardar: () => void;
}

interface TireModelDTO {
    id: number;
    code: string;
    brand: string;
    dimensions: string;
    constructionType: string | null;
    pattern: string;
    originalTread: number | null;
    TKPH: number | null;
    cost: number | null;
    nominalHours: number | null;
    nominalKilometrage: number | null;
}

export default function ModalAsignarNeumatico({
    visible,
    onClose,
    vehicle,
    onGuardar,
}: ModalAsignarNeumaticoProps) {
    const authFetch = useAuthFetch();
    const { user } = useAuth();
    const client = useAxiosWithAuth();
    const [posicion, setPosition] = useState<number | null>(null);
    const [tireIdSelected, setTireIdSelected] = useState<number | null>(null);
    const [tireId, setTireId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [otCode, setOtCode] = useState<string | null>(null);
    const [tires, setTires] = useState<TireDTO[]>([]);
    const [tireSelected, setTireSelected] = useState<TireDTO | null>(null);
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [locationId, setLocationId] = useState<number | null>(null);
    const [models, setModels] = useState<TireModelDTO[]>([]);
    const [selectModelsId, setSelectModelsId] = useState<string[]>([]);
    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [finalDate, setFinalDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/available/site/${vehicle?.siteId}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setTires(Array.isArray(data) ? data : []); // <-- Asegura que siempre sea un array
            console.log("Neumáticos", data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTires([]); // <-- En caso de error, también deja un array vacío
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/location-maintenance/`);
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    }

    const fetchModels = async () => {
        try {


            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tireModels`);
            setModels(response.data);
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchLocations();
            fetchModels();
            fetchData();
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [vehicle?.siteId]);

    if (!visible || !vehicle) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);


        if (!vehicle.code || !posicion || !tireId || !otCode || !actionDate

        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        const vehicleId = vehicle.id;
        const position = Number(posicion);
        const { id, lastInspection } = tireSelected || {};
        const { externalTread, internalTread } = lastInspection || {};

        const date = new Date(actionDate.format('YYYY-MM-DDTHH:mm:ss'));
        const utcDate = date.toISOString();

        const endDate = new Date(finalDate.format('YYYY-MM-DDTHH:mm:ss'));
        const utcEndDate = endDate.toISOString();
        try {

            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/install-tire`,
                {
                    tireId: id,
                    vehicleId: vehicleId,
                    position: position,
                    executionDate: utcDate,
                    executionFinal: utcEndDate,
                    internalTread: internalTread || tireSelected?.initialTread,
                    externalTread: externalTread || tireSelected?.initialTread,
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
        setTireId(null);
        setActionDate(dayjs().tz('America/Santiago'));
        setFinalDate(dayjs().tz('America/Santiago'));
        setLocationId(null);
    }
    const handleClose = () => {
        handleReset();
        setError(null);
        onClose();
    };

    const getFilteredTires = (): TireDTO[] => {
        if (!Array.isArray(tires)) return [];
        return tires.filter((tire) => {
            // Excluir los neumáticos en la ubicación 1
            if (tire.locationId === 1) return false;

            // Si no hay modelos seleccionados, mostrar todos
            if (selectModelsId.length === 0) return true;

            // Mostrar solo los que coincidan con los modelos seleccionados
            return selectModelsId.includes(tire.model.id.toString());
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <section className="relative max-lg:w-full bg-white dark:bg-[#212121] dark:text-white placeholder:dark:text-white p-3 lg:p-6 rounded-md flex max-lg:flex-col shadow-lg h-full lg:h-[80dvh] overflow-y-scroll">

                <main className=" w-full lg:w-[60dvh]  lg:border-r border-gray-300 lg:pr-4">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Instalar neumático</h2>
                        {/* x para cerrar el modal */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            title="Cerrar"
                        >
                            <Cross />
                        </button>
                    </div>
                    <p className="text-sm mb-4">
                        Seleccione el neumático a instalar y la posición en el equipo {vehicle.code}
                    </p>


                    <div className="grid grid-cols-2 gap-2">
                        {/* Lista de modelos */}
                        <Label title="Codigo Equipo" isNotEmpty={true} />
                        <input
                            name="Código Equipo"
                            value={vehicle.code}
                            disabled
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Lista de posiciones segun el nuemro de ruedas dado en el modelo */}
                        <Label title="Posición" isNotEmpty={true} />
                        <select
                            value={posicion ?? ""}
                            onChange={(e) => setPosition(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="" disabled>
                                Seleccione una posición
                            </option>
                            {Array.from({ length: vehicle.model.wheelCount }, (_, index) => (
                                <option key={index} value={index + 1}>
                                    {`Posición ${index + 1}`}
                                </option>
                            ))}
                        </select>
                        <Label title="Fecha de Montaje" isNotEmpty={true} />
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
                        <Label title="Fecha de Despacho" isNotEmpty={true} />
                        <input
                            type="datetime-local"
                            name="Fecha de Despacho"
                            value={finalDate ? finalDate.format('YYYY-MM-DDTHH:mm') : ''}
                            onChange={(e) => {
                                // Asumimos que lo que el usuario selecciona es en hora chilena
                                const newDate = dayjs.tz(e.target.value, 'America/Santiago');
                                setFinalDate(newDate);
                            }}
                            placeholder="Fecha de Montaje"
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
                        {/* código de la OT */}
                        <Label title="código de la OT" isNotEmpty={true} />
                        <input
                            type="text"
                            name="código de la OT"
                            value={otCode ?? ""}
                            onChange={(e) => setOtCode(e.target.value)}
                            placeholder="código de la OT"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Ubicacion */}
                        <Label title="Lugar de Trabajo" isNotEmpty={true} />
                        <select
                            value={locationId ?? ""}
                            onChange={(e) => setLocationId(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="" disabled>
                                Seleccione una ubicación
                            </option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Mostrar error si existe */}
                    {error && <div className="text-red-500 flex justify-between text-sm mt-2 overflow-y-scroll items-center bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                        <button onClick={() => setError("")} className=" text-red-500 pr-2">
                            X
                        </button>
                    </div>}
                </main>

                {/* Lista de neumaticos */}
                <aside className=" w-full max-lg:border-t max-lg:mt-4 max-lg:pt-2 border-t-gray-200 lg:w-[90dvh] lg:pl-4">
                    <h2 className="text-xl font-bold mb-4">Neumáticos Disponibles</h2>
                    <div className="flex flex-row justify-center items-center w-[50%]">
                        <MultiSelect
                            options={models.map((model) => ({
                                value: model.id.toString(), // Convert number to string
                                label: `${model.brand} - ${model.dimensions} - ${model.pattern}`,
                            }))}
                            selected={selectModelsId} // Ensure selected values are strings
                            onChange={setSelectModelsId}
                            placeholder="Filtrar por modelo..."
                        />
                        {selectModelsId.length > 0 ? (
                            <button
                                onClick={() => setSelectModelsId([])}
                                className="text-black w-8 rounded-xl h-10 text-2xl flex justify-center items-center "
                                title="Limpiar filtros"
                            >
                                <FaPlusCircle className="text-2xl rotate-45 bg-white rounded-full" />
                            </button>
                        ) : (
                            <div className="flex flex-row text-gray-500 font-bold dark:bg-text-900 w-8 rounded-xl h-10 justify-center items-center ">
                                <FaPlusCircle className="text-2xl rotate-45 bg-gray-200  rounded-full" />
                            </div>
                        )}
                    </div>
                    <div className="overflow-y-auto h-[50dvh] mt-2">
                        <table className="w-full border-collapse">
                            <thead className="sticky border-x border-t border-b-2 top-0 bg-white dark:bg-[#131313] z-10">
                                <tr>
                                    <th className="border-b p-2 text-left"></th>
                                    <th className="border-b p-2 text-left">Código</th>
                                    <th className="border-b p-2 text-left">Marca</th>
                                    <th className="border-b p-2 text-left">Dimensiones</th>
                                    <th className="border-b p-2 text-left">Patrón</th>
                                    <th className="border-b p-2 text-left">Estado</th>
                                    <th className="border-b p-2 text-left">Remanente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredTires()
                                    .map((tire) => (
                                        tire.locationId === 10 && (
                                            <tr key={tire.id} className={`border-b hover:bg-gray-100 dark:hover:bg-neutral-900 ${tireIdSelected === tire.id ? "bg-gray-200" : ""}`}>
                                                <td className="p-2 py-4 border-x bg-gray-100 dark:bg-[#121212]">
                                                    <input
                                                        type="checkbox"
                                                        className="mx-auto"
                                                        checked={tireId === tire.id}
                                                        onChange={() => {
                                                            setTireId(tire.id);
                                                            setTireSelected(tire);
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2">{tire.code}</td>
                                                <td className="p-2">{tire.model.brand}</td>
                                                <td className="p-2">{tire.model.dimensions}</td>
                                                <td className="p-2">{tire.model.pattern}</td>
                                                <td className="p-2">
                                                    {tire.lastInspection
                                                        ? `INT: ${tire.lastInspection.internalTread} | EXT: ${tire.lastInspection.externalTread}`
                                                        : 'Nuevo'}
                                                </td>
                                                <td className="p-2 border-r">
                                                    {tire.lastInspection
                                                        ? `${tire.lastInspection.externalTread} - 
                                                    ${tire.lastInspection.internalTread}`
                                                        : `${tire.initialTread} - ${tire.initialTread}`}
                                                </td>

                                            </tr>
                                        )
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                            Guardar Cambios
                        </ButtonWithAuthControl>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                        >
                            Cancelar
                        </button>
                    </div>

                </aside>
                <LoadingSpinner isOpen={loading} />

            </section>
        </div>
    );
}
