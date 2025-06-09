"use client";

import { FaInfoCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState, useCallback } from "react";
import ModalEditarVehicleModel from "@/components/features/equipo/mod/model/modaleditarModeloVehiculo";
import ModalRegistarModeloVehiculo from "@/components/features/equipo/mod/model/ModalRegistrarModeloVehiculo";
import Link from "next/link";
import Button from "@/components/common/button/Button";
import { useAuth } from "@/contexts/AuthContext";

interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
    vehicleCount: number;
}

export default function ModelosEquipo() {
    const [vehicleModels, setVehicleModels] = useState<VehicleModelDto[]>([]);
    const [vehicleModelSelected, setVehicleModelSelected] = useState<VehicleModelDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [modalRegistarFaena, setModalRegistrarFaena] = useState(false);
    const { user } = useAuth();

    const fetchVehicleModels = useCallback(async () => {
        if (!user?.faena_id) {
            console.warn("No se puede cargar modelos sin faena_id");
            setVehicleModels([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicleModels/site/${user.faena_id}`);
            const data = await response.json();
            setVehicleModels(data);
        } catch (error) {
            console.error("Error fetching vehicle models:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.faena_id]);

    useEffect(() => {
        console.log("User in fetchVehicleModels:", user?.faena_id);
        fetchVehicleModels();
    }, [fetchVehicleModels]);

    useEffect(() => {
        if (!mostrarEditar && !modalRegistarFaena) return;
        fetchVehicleModels();
    }, [mostrarEditar, modalRegistarFaena, fetchVehicleModels]);

    const handleEditVehicleModel = (model: VehicleModelDto) => {
        setVehicleModelSelected(model);
        setMostrarEditar(true);
    };

    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Modelos de Equipos</h1>
                <Button
                    onClick={() => setModalRegistrarFaena(true)}
                    text="Crear Nuevo Modelo"
                />
            </section>

            <main>
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max overflow-hidden rounded-md border">
                        <thead className="text-xs text-black uppercase bg-amber-300">
                            <tr>
                                <th className="p-4">Marca</th>
                                <th className="p-4">Modelo</th>
                                <th className="p-4">Tipo de Equipo</th>
                                <th className="p-4">Cantidad de Ruedas</th>
                                <th className="p-4">Cantidad de Equipos</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 dark:bg-neutral-800">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">Cargando modelos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : vehicleModels.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8">
                                        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.062 20h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">No se encontraron modelos.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                vehicleModels.map((vehicleModel) => (
                                    <tr key={vehicleModel.id} className="bg-white border-b dark:text-white dark:bg-neutral-800 dark:border-amber-300">
                                        <td className="p-4 ">{vehicleModel.brand}</td>
                                        <td className="p-4">{vehicleModel.model}</td>
                                        <td className="p-4 ">CAEX</td>
                                        <td className="p-4">{vehicleModel.wheelCount}</td>
                                        <td className="p-4 ">{vehicleModel.vehicleCount}</td>
                                        <td className="px-2 ">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditVehicleModel(vehicleModel)}
                                                    className="p-2 text-green-500 hover:text-green-600 bg-green-50 dark:bg-neutral-700 border border-green-300 rounded-md flex items-center justify-center"
                                                >
                                                    <FaPencil />
                                                </button>
                                                <Link
                                                    href={`/modelos/modelo-equipo/${vehicleModel.id}`}
                                                    className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border dark:bg-neutral-700 border-blue-300 rounded-md flex items-center justify-center"
                                                >
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

                <ModalEditarVehicleModel
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    vehicleModel={vehicleModelSelected}
                    onGuardar={() => setMostrarEditar(false)}
                />

                <ModalRegistarModeloVehiculo
                    visible={modalRegistarFaena}
                    onClose={() => setModalRegistrarFaena(false)}
                    onGuardar={() => setModalRegistrarFaena(false)}
                />
            </main>
        </div>
    );
}
