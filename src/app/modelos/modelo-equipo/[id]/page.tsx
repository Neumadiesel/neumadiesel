"use client";

import { FaInfoCircle } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import ModalRegistarModeloVehiculo from "@/components/features/equipo/mod/model/ModalRegistrarModeloVehiculo";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { useAuth } from "@/contexts/AuthContext";

interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
    vehicleCount: number;
    vehicles?: VehicleDTO[];
}

interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
}

export default function EquiposPorModelo() {
    const { id } = useParams();
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [model, setModel] = useState<VehicleModelDto>({} as VehicleModelDto);
    const [loading, setLoading] = useState(true);
    const [modalRegistarFaena, setModalRegistrarFaena] = useState(false);
    const { user } = useAuth();

    const fetchVehicleModels = useCallback(async () => {
        setLoading(true);
        try {
            const baseURL = `https://inventory-service-emva.onrender.com/vehicleModels/withVehicles/${id}/site/${user?.faena_id}`

            const response = await fetch(baseURL);
            const data = await response.json();
            console.log("Fetched vehicle model data:", data);
            setModel(data);
            setVehicles(data.vehicles || data[0]?.vehicles || []);
        } catch (error) {
            console.error("Error fetching vehicle models:", error);
        } finally {
            setLoading(false);
        }
    }, [id, user?.faena_id]);

    useEffect(() => {
        if (!user?.faena_id) return;
        fetchVehicleModels();
    }, [fetchVehicleModels, user?.faena_id]);

    useEffect(() => {
        if (!modalRegistarFaena || !user?.faena_id) return;
        fetchVehicleModels();
    }, [modalRegistarFaena, fetchVehicleModels, user?.faena_id]);

    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg h-full pb-4 gap-4 flex flex-col">
            <Breadcrumb />
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Lista de Vehículos de {model.brand} - {model.model}
                </h1>
            </section>

            <main>
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max overflow-hidden rounded-md border">
                        <thead className="text-xs text-black uppercase bg-amber-300">
                            <tr>
                                <th className="p-4">Código</th>
                                <th className="p-4">Horas</th>
                                <th className="p-4">Kilometraje</th>
                                <th className="p-4">Tipo de Equipo</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 dark:bg-neutral-800">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando Equipos...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8">
                                        <div className="flex flex-col items-center space-y-4 animate-pulse">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.062 20h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">No se encontraron Equipos.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="bg-white dark:text-white border-b dark:bg-neutral-800 dark:border-amber-300">
                                        <td className="p-4 ">{vehicle.code}</td>
                                        <td className="p-4">{vehicle.hours}</td>
                                        <td className="p-4">{vehicle.kilometrage}</td>
                                        <td className="p-4 ">CAEX</td>
                                        <td className="px-2 ">
                                            <div className="flex gap-2">
                                                <Link href={`/maquinaria/${vehicle.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border border-blue-300 rounded-md flex items-center justify-center">
                                                    <FaInfoCircle />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <ModalRegistarModeloVehiculo
                    visible={modalRegistarFaena}
                    onClose={() => setModalRegistrarFaena(false)}
                    onGuardar={() => setModalRegistrarFaena(false)}
                />
            </main>
        </div>
    );
}
