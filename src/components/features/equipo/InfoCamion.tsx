"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ModaleditarEquipo from "./modaleditarEquipo";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { installedTiresDTO } from "@/types/Tire";
import Button from "@/components/common/button/Button";
import ModalAsignarNeumatico from "./ModalAsignarNeumatico";
import LabelLoading from "@/components/common/forms/LabelLoading";
import ModalDesmontarNeumatico from "../mantenimiento/ModalDesmontarNeumatico";
import ModalAddKms from "./ModalAddKms";
import CardTire from "@/components/common/cards/CardTyre";
import { VehicleDTO } from "@/types/Vehicle";
import { useAuth } from "@/contexts/AuthContext";

import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import axios from "axios";

export default function ListaMaquinaria() {
    const params = useParams<{ id: string }>();
    const { user } = useAuth();

    const siteId = user?.faena_id
    const id = params.id;
    const { setHasChanged } = useLayoutContext();

    const [loading, setLoading] = useState(true);
    const [vehicle, setVehicle] = useState<VehicleDTO>({} as VehicleDTO);
    const [installedTires, setInstalledTires] = useState<installedTiresDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const client = useAxiosWithAuth();
    const fetchVehicleModels = async () => {
        setError(null);
        setLoading(true);
        if (!id) {
            setLoading(false);
            return;
        }
        if (!siteId) {
            setError("Vehículo no encontrado o no autorizado para esta faena. Seleccione otro vehículo.");
            setLoading(false);
            return;
        }
        try {


            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/withTires/${id}/site/${siteId}`,);
            const data = await response.data;
            console.log("Installed tires", data);
            setLoading(false);
            setVehicle(data);
            setInstalledTires(data.installedTires);
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
    }, [mostrarEditar, mostrarAsignarNeumatico, mostrarDesmontar, mostrarAddKms, siteId]);

    return (
        <div className="p-2 h-[100%] w-full bg-white dark:bg-[#212121] relative shadow-md">
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
                                        || error !== null
                                    }
                                    text="Instalar Neumático"
                                    onClick={() => { setMostrarAsignarNeumatico(true) }}
                                />
                                {/* BOTON PARA AGREGAR HORAS Y KILOMETROS AL EQUIPO */}
                                <Button
                                    disabled={loading
                                        || id === undefined
                                        || error !== null
                                    }
                                    text="Agregar Horas/Kilometros"
                                    onClick={() => { setMostrarAddKms(true) }}
                                />
                                {/* Boton de editar */}
                                {/* <ToolTipCustom content="Editar Equipo">
                                    <button disabled={loading || id === undefined || error !== null} onClick={() => setMostrarEditar(true)} className={`bg-gray-100  dark:bg-[#313131] border text-lg text-black dark:text-white p-2 rounded-md mb-2 flex items-center justify-center ${loading || id === undefined || error !== null ? "opacity-50 " : "cursor-pointer hover:bg-gray-200 dark:hover:bg-[#141414]"}`}>
                                        <FaEdit />
                                    </button>
                                </ToolTipCustom> */}

                            </section>
                            {/* Info del camión */}

                            <div className="grid grid-cols-2 pt-2 bg-white shadow-sm dark:bg-[#141414] rounded-sm border dark:border-neutral-700  p-2 w-[100%] h-[65%] mb-2">
                                <LabelLoading loading={loading} title={"Faena:"} text={vehicle.site?.name} />
                                <LabelLoading loading={loading} title={"Marca:"} text={vehicle.model?.brand} />
                                <LabelLoading loading={loading} title={"Modelo:"} text={vehicle.model?.model} />
                                <LabelLoading loading={loading} title={"Horas:"} text={vehicle.hours?.toString()} />
                                <LabelLoading loading={loading} title={"Kilometraje:"} text={vehicle.kilometrage?.toString()} />
                            </div>
                            {/* Boton para cambiar entre neumaticos y sensores */}

                        </section>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                        {
                            error && (
                                <div className="text-red-500 dark:text-red-400 text-center col-span-2 row-span-3 bg-red-50 dark:bg-neutral-800 px-10 h-[40dvh] flex items-center justify-center rounded-md border border-red-300">
                                    {error}
                                </div>
                            )
                        }
                        {loading ? (
                            [...Array(6)].map((_, idx) => (
                                <CardTire key={idx} position={idx + 1} loading={loading} />
                            ))
                        ) : (
                            getTiresByPosition().map(({ position, tireData }) => (
                                <CardTire
                                    key={position}
                                    loading={loading}
                                    position={position}
                                    code={tireData?.tire.code}
                                    internalTread={tireData?.tire.lastInspection?.internalTread}
                                    externalTread={tireData?.tire.lastInspection?.externalTread}
                                    kilometrage={tireData?.tire.lastInspection?.kilometrage}
                                    hours={tireData?.tire.usedHours}
                                    pressure={tireData?.tire.lastInspection?.pressure}
                                    temperature={tireData?.tire.lastInspection?.temperature}
                                    tireId={tireData?.tire.id}
                                    onDesinstalar={() => {
                                        setTireDesmonatado(tireData);
                                        setMostrarDesmontar(true);
                                    }}
                                />

                            ))
                        )}

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
