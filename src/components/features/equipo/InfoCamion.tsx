"use client";
import { MoveLeft, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import ModaleditarEquipo from "./modaleditarEquipo";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { installedTiresDTO } from "@/types/Tire";
import Button from "@/components/common/button/Button";
import ModalAsignarNeumatico from "./ModalAsignarNeumatico";
import LabelLoading from "@/components/common/forms/LabelLoading";
import ModalDesmontarNeumatico from "../mantenimiento/ModalDesmontarNeumatico";
import ModalAddKms from "./ModalAddKms";

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
            usedKilometrage: number;
            usedHours: number;
            lastInspectionId: number | null;
            locationId: number;
            lastInspection: {
                id: number;
                position: number;
                externalTread: number;
                internalTread: number;
                kilometrage: number;
                inspectionDate: string;
                pressure: number;
                temperature: number;
                observation: string;
            }
        };
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
            const response = await fetch(`https://inventory-service-emva.onrender.com/vehicles/withTires/${id}`);
            const data = await response.json();
            console.log("Installed tires", data);
            setLoading(false);
            setVehicle(data);
            setInstalledTires(data.installedTires);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [mostrarAddKms, setMostrarAddKms] = useState(false);
    const [mostrarAsignarNeumatico, setMostrarAsignarNeumatico] = useState(false);
    const [mostrarDesmontar, setMostrarDesmontar] = useState(false);
    const handleUpdate = () => {
        setHasChanged(true);
    }
    const [tireDesmontado, setTireDesmonatado] = useState<installedTiresDTO | null>(null);


    const getTiresByPosition = () => {
        const posiciones: { position: number, tireData: installedTiresDTO | null }[] = [];

        for (let i = 1; i <= vehicle.model?.wheelCount; i++) {
            const neumatico = installedTires.find(t => t.position === i) || null;
            posiciones.push({ position: i, tireData: neumatico });
        }

        return posiciones;
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    useEffect(() => {
        handleUpdate();
        fetchVehicleModels();
    }, [mostrarEditar, mostrarAsignarNeumatico, mostrarDesmontar, mostrarAddKms]);

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
                                <Button
                                    disabled={loading
                                        || id === undefined
                                    }
                                    text="Instalar Neumático"
                                    onClick={() => { setMostrarAsignarNeumatico(true) }}
                                />
                                {/* BOTON PARA AGREGAR HORAS Y KILOMETROS AL EQUIPO */}
                                <Button
                                    disabled={loading
                                        || id === undefined
                                    }
                                    text="Agregar Horas/Kilometros"
                                    onClick={() => { setMostrarAddKms(true) }}
                                />
                                {/* Boton de editar */}
                                <button disabled={loading || id === undefined} onClick={() => setMostrarEditar(true)} className={`bg-gray-100  border text-lg text-black p-2 rounded-md mb-2 flex items-center justify-center ${loading || id === undefined ? "opacity-50 " : "cursor-pointer hover:bg-gray-200"}`}>
                                    <FaEdit />
                                </button>
                            </section>
                            {/* Info del camión */}
                            <div className="grid grid-cols-2 pt-2 bg-gray-100 rounded-sm border  p-1 w-[100%] h-[65%] mb-2">
                                <LabelLoading loading={loading} title={"Faena:"} text={vehicle.site?.name} />
                                <LabelLoading loading={loading} title={"Marca:"} text={vehicle.model?.brand} />
                                <LabelLoading loading={loading} title={"Modelo:"} text={vehicle.model?.model} />
                                <LabelLoading loading={loading} title={"Horas:"} text={vehicle.hours?.toString()} />
                                <LabelLoading loading={loading} title={"Kilometraje:"} text={vehicle.kilometrage?.toString()} />
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
                                            <th className="w-[10%] text-start">Código</th>
                                            <th className="w-[15%]  text-start">
                                                <p className="hidden lg:block">Profundidad</p>
                                                <p className="block lg:hidden ">Rem</p>
                                            </th>
                                            <th className="text-start w-[15%]">Datos</th>
                                            <th className="text-start w-[15%]">Sensor</th>
                                            <th className="w-[15%]">
                                                <p className="hidden lg:block">Historial</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            Cargando neumáticos...
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : getTiresByPosition().map(({ position, tireData }) => (
                                            <tr
                                                key={position}
                                                className="bg-gray-50 border-b border-b-amber-200 dark:bg-[#212121] hover:bg-gray-100 h-16 text-start dark:hover:bg-gray-700 transition-all ease-in-out rounded-md"
                                            >
                                                <td className="w-[5%] text-center font-semibold">{position}</td>
                                                {tireData ? (
                                                    <>
                                                        <td className="w-[15%]">{tireData.tire.code}</td>
                                                        <td>
                                                            <p>Int: {tireData.tire.lastInspection?.internalTread ?? tireData.tire.initialTread}</p>
                                                            <p>Ext: {tireData.tire.lastInspection?.externalTread ?? tireData.tire.initialTread}</p>
                                                        </td>
                                                        <td className="text-justify">
                                                            <p>HRS: {tireData.tire.usedHours}</p>
                                                            <p>KMS: {tireData.tire.usedKilometrage}</p>
                                                        </td>
                                                        <td className="text-start">
                                                            <p>PSI: {tireData.tire.lastInspection?.pressure ?? "No Data"}</p>
                                                            <p>TEM: {tireData.tire.lastInspection?.temperature ?? "No Data"}</p>
                                                        </td>
                                                        <td className="flex justify-center mt-5 items-center gap-1">
                                                            <Link
                                                                href={`/neumaticos/${tireData.tire.id}`}
                                                                className="p-2 text-indigo-500 hover:text-indigo-600 bg-indigo-50 border border-indigo-300 rounded-md flex items-center justify-center"
                                                            >
                                                                <History className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    setTireDesmonatado(tireData);
                                                                    setMostrarDesmontar(true);
                                                                }}
                                                                className="p-2 text-red-500 hover:text-red-600 bg-red-50 border border-red-300 rounded-md flex items-center justify-center"
                                                            >
                                                                <MoveLeft className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td colSpan={5} className="italic text-center text-gray-400">Sin neumático instalado</td>

                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <ModalDesmontarNeumatico
                visible={mostrarDesmontar}
                onClose={() => setMostrarDesmontar(false)}
                tire={tireDesmontado}
                onGuardar={() => {
                    setHasChanged(true);
                    setMostrarDesmontar(false);
                }}
            />
            <ModalAddKms
                visible={mostrarAddKms}
                onClose={() => setMostrarAddKms(false)}
                vehicle={vehicle}
                onGuardar={() => {

                    setHasChanged(true);
                    setMostrarEditar(false);
                }} />
            <ModaleditarEquipo
                visible={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                vehicle={vehicle}
                onGuardar={() => {

                    setHasChanged(true);
                    setMostrarEditar(false);
                }} />
            <ModalAsignarNeumatico
                visible={mostrarAsignarNeumatico}
                onClose={() => setMostrarAsignarNeumatico(false)}
                vehicle={vehicle}
                onGuardar={() => {

                    setHasChanged(true);
                    setMostrarAsignarNeumatico(false);
                }} />

        </div>
    );
}
