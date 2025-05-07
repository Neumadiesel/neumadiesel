"use client";
import { Neumaticos } from "@/mocks/neumaticos.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaClock, FaEdit } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import ModaleditarEquipo from "./modaleditarEquipo";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { installedTiresDTO } from "@/types/Tire";

interface NeumaticoInt {
    Id: string;
    Codigo: string;
    Serie: string;
    Codigo_Camion: string;
    Profundidad: number;
    META_HORAS: number;
    META_KMS: number;
    Costo: number;
    Posicion: number;
}
export interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
    typeId: number;
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
    installedTires: {
        id: number;
        vehicleId: number;
        tireId: number;
        sensorId: number | null;
        position: number;
        tire: {
            id: number;
            code: string;
            modelId: number;
            initialTread: number;
            initialKilometrage: number;
            initialHours: number;
            lastInspectionId: number | null;
            locationId: number;
        };
        sensor: any | null; // Cambia `any` si tienes una estructura definida para el sensor
    }[];
}


export default function ListaMaquinaria() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { setHasChanged } = useLayoutContext();

    const [loading, setLoading] = useState(true);
    const [vehicle, setVehicle] = useState<VehicleDTO>({} as VehicleDTO);
    const [installedTires, setInstalledTires] = useState<installedTiresDTO[]>([]);
    const fetchVehicleModels = async () => {
        setLoading(true);
        if (!id) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`http://localhost:3002/vehicles/withTires/${id}`);
            const data = await response.json();
            setLoading(false);
            setVehicle(data);
            setInstalledTires(data.installedTires);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const [mostrarEditar, setMostrarEditar] = useState(false);

    const handleUpdate = () => {
        setHasChanged(true);
    }
    useEffect(() => {
        fetchVehicleModels();
    }, []);

    useEffect(() => {
        handleUpdate();
        fetchVehicleModels();
    }, [mostrarEditar]);


    // Tipar los neumáticos correctamente
    const neumaticos: NeumaticoInt[] = Neumaticos.filter(
        (neumatico: NeumaticoInt) => neumatico.Codigo_Camion === id
    );

    return (
        <div className="p-2 h-[100%] w-full bg-white dark:bg-black relative shadow-md">
            <div className="text-black dark:text-white flex flex-col">
                {/* Info del camión */}

                {/* Seccion de informacion */}
                <div className="flex flex-col justify-center items-center">
                    {/* Esquema de neumaticos*/}
                    <div className="flex h-[25vh]  justify-between w-full">
                        {/* Info del camión */}
                        <section className="flex flex-col w-full pt-5 items-start mb-2 ">
                            <section className="flex justify-between w-full items-center mb-2">
                                <h2 className="text-xl font-semibold mb-2 w-42">
                                    Equipo {loading ? "..." : vehicle.code}
                                </h2>
                                {/* Boton de mantenimiento */}
                                <Link
                                    href={`/mantenimiento/${id}`}
                                    className={`text-lg w-52 text-center p-1 rounded-md border flex justify-center items-center gap-2 ${id
                                        ? "text-black bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                        : "text-gray-400 bg-gray-200 cursor-not-allowed"
                                        }`}
                                    onClick={e => {
                                        if (!id) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <FaCirclePlus size={20} />
                                    Mantenimiento
                                </Link>
                                {/* Boton de editar */}

                                <button onClick={() => setMostrarEditar(true)} className="bg-gray-100 hover:bg-gray-200 border text-lg text-black p-2 rounded-md mb-2 flex items-center justify-center">
                                    <FaEdit />
                                </button>
                            </section>
                            {/* Info del camión */}
                            <div className="grid grid-cols-2 pt-2 bg-gray-100 rounded-sm border  p-1 w-[100%] h-[65%] mb-2">
                                <p>
                                    <span className="text-sm font-semibold">Faena:</span>  {loading ? "Cargando..." : vehicle.site?.name}
                                </p>
                                <p>
                                    <span className="text-sm font-semibold">Marca:</span> {vehicle.model?.brand}
                                </p>
                                <p>
                                    <span className="text-sm font-semibold">Modelo:</span> {vehicle.model?.model}
                                </p>
                                <p>
                                    <span className="text-sm font-semibold">Horas:</span> {vehicle.hours}
                                </p>
                                <p>
                                    <span className="text-sm font-semibold">Kilometraje:</span> {vehicle.kilometrage}
                                </p>
                            </div>
                            {/* Boton para cambiar entre neumaticos y sensores */}

                        </section>
                    </div>

                    {/* Lista de neumaticos */}
                    <div className="w-[100%] h-full">
                        {/* Tabla de neumaticos */}
                        <section className="relative overflow-x-auto lg:h-[80%] my-2">
                            <div className="flex flex-col gap-y-2">
                                {/* Table head */}
                                <table className="w-full table-auto rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2 w-[5%]">Pos</th>
                                            <th className="p-2 w-[20%]">Codigo</th>
                                            <th className="p-2 w-[15%]">
                                                <p className="hidden lg:block">Profundidad</p>
                                                <p className="block lg:hidden">Rem</p>
                                            </th>
                                            <th className="p-2 w-[15%]">Meta </th>
                                            <th className="p-2 w-[15%]">Sensor</th>
                                            <th className="p-2 w-[15%]">
                                                <p className="hidden lg:block">Historial</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto ">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            Cargando neumaticos...
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) :
                                            installedTires.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center p-4">
                                                        No hay neumáticos disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        {/* Mapear los neumaticos */}
                                        {installedTires.map(neumatico => (
                                            <tr
                                                key={neumatico.tire.id}
                                                className="bg-gray-50 border-b border-b-amber-200 dark:bg-[#212121] hover:bg-gray-100 h-16 text-center dark:hover:bg-gray-700 transition-all ease-in-out  rounded-md "
                                            >
                                                <td className="w-[5%]">{neumatico.position}</td>
                                                <td className="w-[20%]">{neumatico.tire.code}</td>
                                                <td>
                                                    <div>
                                                        <p>Int: {neumatico.tire.initialTread}</p>
                                                        <p>Ext: {neumatico.tire.initialTread}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{neumatico.tire.initialHours}</p>
                                                    <p>{neumatico.tire.initialKilometrage}</p>
                                                </td>
                                                <td>
                                                    <p>PSI: 105</p>
                                                    <p>Temp: 95</p>
                                                </td>
                                                <td className="flex justify-center mt-5 items-center">
                                                    <Link href={`/mantenimiento/Historial`}>
                                                        <FaClock size={20} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <ModaleditarEquipo
                visible={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                vehicle={vehicle}
                onGuardar={() => {

                    setHasChanged(true);
                    setMostrarEditar(false);
                }} />

        </div>
    );
}
