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
    // Estoy plenamente orgulloso de este código, es una obra maestra de la ingeniería del software.
    // Total si funciona, no? que refactorizar ni que ocho cuartos.
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
    const [dimensionFilter, setDimensionFilter] = useState<string>("");
    const [invertirNeumatico, setInvertirNeumatico] = useState(false);
    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [finalDate, setFinalDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [codeFilter, setCodeFilter] = useState<string>("");
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/site/${vehicle?.siteId}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();
            const filteredTires = Array.isArray(data)
                ? data.filter((tire: TireDTO) => tire.locationId === 10 || tire.locationId === 2)
                : [];
            setTires(filteredTires);
            console.log("data neumaticos", filteredTires)
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
    }, [user, vehicle?.siteId]);

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
            if (invertirNeumatico) {
                const flipTire = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/flip-tire`, {
                    tireId: id,
                    executionDate: utcDate,
                    executionFinal: utcEndDate,
                    internalTread: externalTread || tireSelected?.initialTread,
                    externalTread: internalTread || tireSelected?.initialTread,
                });
                console.log("Neumático invertido correctamente", flipTire.data);
            }
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
            const matchesModel =
                selectModelsId.length === 0 || selectModelsId.includes(tire.model.id.toString());

            const matchesCode = tire.code.toLowerCase().includes(codeFilter.toLowerCase());

            const matchesDimension =
                dimensionFilter === "" || tire.model.dimensions === dimensionFilter;

            return matchesModel && matchesCode && matchesDimension;
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
                        {/* Si querian un codigo mas lindo y ordenado, me hubiesen pagado primero */}
                        <Label title="Instalar Invertido" isNotEmpty={false} />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={invertirNeumatico}
                                onChange={(e) => setInvertirNeumatico(e.target.checked)}
                            />
                            <span className="text-sm">Invertir remanente interno y externo</span>
                        </div>
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
                    <div className="grid grid-cols-2 w-full gap-2 mb-2">
                        <div className="flex flex-row justify-center items-center w-full">
                            <MultiSelect
                                options={models.map((model) => ({
                                    value: model.id.toString(), // Convert number to string
                                    label: `${model.code} - ${model.dimensions} - ${model.pattern} - ${model.originalTread}mm`,
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
                        <div className="flex flex-row justify-center items-center w-full gap-4">
                            <select
                                value={dimensionFilter}
                                onChange={(e) => setDimensionFilter(e.target.value)}
                                className="border border-gray-300 p-2 rounded w-full"
                            >
                                <option value="">Filtrar por dimensión...</option>
                                {[...new Set(models.map((m) => m.dimensions))].map((dim) => (
                                    <option key={dim} value={dim}>
                                        {dim}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-full gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Filtrar por código..."
                            value={codeFilter}
                            onChange={(e) => setCodeFilter(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full"
                        />
                    </div>
                    <div className="overflow-y-auto h-[50dvh] mt-2">
                        <table className="w-full border-collapse">
                            <thead className="sticky border-x border-t border-b-2 top-0 bg-white dark:bg-[#131313] z-10">
                                <tr>
                                    <th className="border-b p-2 text-left"></th>
                                    <th className="border-b p-2 text-left">Código</th>
                                    <th className="border-b p-2 text-left">Modelo</th>
                                    <th className="border-b p-2 text-left">Dimensiones</th>
                                    <th className="border-b p-2 text-left">Patrón</th>
                                    <th className="border-b p-2 text-left">Remanente</th>
                                </tr>
                            </thead>
                            {/* Int 54, Exte 47 B4A001795 */}
                            <tbody>
                                {getFilteredTires()
                                    .sort((a, b) => {
                                        // Primero los con locationId == 2
                                        if (a.locationId === 2 && b.locationId !== 2) return -1;
                                        if (a.locationId !== 2 && b.locationId === 2) return 1;
                                        // Si ambos tienen lastInspection, comparar internalTread
                                        const aTread = a.lastInspection?.internalTread ?? a.initialTread ?? 0;
                                        const bTread = b.lastInspection?.internalTread ?? b.initialTread ?? 0;
                                        return bTread - aTread;
                                    })
                                    .map((tire) => (
                                        <tr
                                            key={tire.id}
                                            className={`border-b  dark:hover:bg-neutral-900
                                                ${tireIdSelected === tire.id ? "bg-gray-200" : ""}
                                                ${tire.locationId === 2 ? "bg-emerald-50 dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800" : "hover:bg-gray-100 dark:hover:bg-emerald-900"}
                                            `}
                                        >
                                            <td
                                                className={`p-2 py-4 border-x ${tire.locationId === 2
                                                    ? "bg-emerald-100 dark:bg-emerald-900"
                                                    : "bg-gray-100 dark:bg-emerald-800"
                                                    }`}
                                            >
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
                                            <td className="p-2">{tire.model.code}</td>
                                            <td className="p-2">{tire.model.dimensions}</td>
                                            <td className="p-2">{tire.model.pattern}</td>
                                            <td className="p-2">
                                                {tire.lastInspection
                                                    ? `INT: ${tire.lastInspection.internalTread} | EXT: ${tire.lastInspection.externalTread}`
                                                    : 'Nuevo'}
                                            </td>
                                        </tr>
                                    )
                                    )}
                                {/* S4J003452 Int 58. Ext 63 */}
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
