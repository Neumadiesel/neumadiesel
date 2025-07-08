"use client"
import { useAuth } from "@/contexts/AuthContext";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { VehicleDTO } from "@/types/Vehicle";
import { useState, useEffect } from "react";
import CardVehicleStatus from "./components/CardVehicleStatus";

export default function StatusVehicle() {
    const { user } = useAuth();
    const client = useAxiosWithAuth();
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);

    const fetchVehicles = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1`);
            setVehicles(response.data);
            console.log("Órdenes de trabajo:", response.data);
        } catch (error) {
            console.error("Error al obtener órdenes de trabajo:", error);
            setVehicles([]);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVehicles();
        }
    }, [user]);

    return (
        <div className="flex flex-col overflow-x-hidden gap-y-4 lg:gap-y-5 bg-white dark:bg-[#212121] pt-4 p-2 dark:text-white w-full lg:p-3">
            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className="grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold">Estado del Vehículo</h1>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver el estado actual del vehículo y sus neumáticos.
                </p>
                <section className="mb-4 grid grid-cols-2 lg:grid-cols-4  gap-2">
                    {vehicles.map((vehicle) => (
                        <CardVehicleStatus key={vehicle.id} vehicle={vehicle} />
                    ))}
                </section>
            </main>
        </div>
    )
}
