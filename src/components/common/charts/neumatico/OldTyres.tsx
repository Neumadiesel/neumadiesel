"use client";
import { useState, useEffect } from "react";
import { TireDTO } from "@/types/Tire";
import axios from "axios";
import { FileCheck } from "lucide-react";
import Link from "next/link";

export default function OldTyres() {
    const [tireCritical, setTireCritical] = useState<TireDTO[]>([]);

    // Funcion de axios que pide los neumaticos criticos
    const fetchCriticalTires = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/more-than-4500-hours/site/1`);
            // Ordenar por mayor cantidad de horas en lastInspection
            const sortedTires = response.data.sort(
                (a: TireDTO, b: TireDTO) => (b.lastInspection?.hours ?? 0) - (a.lastInspection?.hours ?? 0)
            );
            setTireCritical(sortedTires);
            console.log("Neumáticos críticos:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching critical tires:", error);
            return []; // Retorna un array vacío en caso de error
        }
    };
    useEffect(() => {
        fetchCriticalTires();
    }, []);
    return (
        <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
            <h2 className="text-3xl font-semibold mb-4 flex items-center">
                <FileCheck size={32} className="inline mr-2 text-red-500" />
                Neumáticos Críticos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Aquí puedes ver los neumáticos que requieren atención inmediata.
            </p>
            {/* Tabla de neumáticos críticos */}
            <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                <thead>
                    <tr className="border-b dark:border-neutral-600">
                        <th className="px-4 py-2 text-left">Neumático</th>
                        <th className="px-4 py-2 text-left">Equipo</th>
                        <th className="px-4 py-2 text-left">Posición</th>
                        <th className="px-4 py-2 text-left">Horas</th>
                        <th className="px-4 py-2 text-left">Ubicación</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aquí se pueden listar los neumáticos críticos */}
                    {
                        tireCritical.length === 0 && (
                            <tr className="border-b dark:border-neutral-600">
                                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                    No hay neumáticos críticos
                                </td>
                            </tr>
                        )
                    }
                    {
                        tireCritical.map((tire) => (
                            <tr key={tire.id} className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                <td className="px-4 py-2">{tire.code}</td>
                                <td className="px-4 py-2">{tire.installedTires[0].vehicle.code}</td>
                                <td className="px-4 py-2">{tire.lastInspection.position}</td>
                                <td className="px-4 py-2">{tire.lastInspection.hours}</td>
                                <td className="px-4 py-2">{tire.location.name}</td>
                                <td className="px-4 py-2">
                                    <Link href={`/neumaticos/${tire.id}`} className="bg-gray-50 text-black border hover:cursor-pointer px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
                                        Ver Detalles
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </section>
    );
}