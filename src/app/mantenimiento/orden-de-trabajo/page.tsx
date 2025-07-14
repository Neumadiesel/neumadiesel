"use client"
import { useAuth } from "@/contexts/AuthContext";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { CirclePlus, Eye, FileCog } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Procedure {
    id: number;
    tireId: number;
    position: number;
    tireHours: number;
    tireKilometres: number;
    internalTread: number;
    description?: string;
    externalTread: number;
    procedureName: string;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    vehicleId?: number;
    siteId: number;
    retirementReasonId?: number;
    workOrderId?: number;
}

interface WorkOrderDTO {
    id: number;
    code: string;
    description: string;
    type: string; // Programada, En ejecución, Completada, Cancelada
    date: string; // formato ISO
    responsibleName: string;
    dispatchDate: string; // formato ISO
    siteId: number;
    checkInHour: string; // formato HH:mm
    checkOutHour: string; // formato HH:mm
    observations: string;
    technician: string;
    interventionType: string;
    peopleCount: number;
    locationId: number;
    vehicleId: number;
    createdAt: string; // formato ISO
    updatedAt: string; // formato ISO
    procedures: Procedure[]; // Puedes definir un tipo más específico si es necesario
}

export default function OrdenDeTrabajoPage() {

    const { user } = useAuth();
    // axios get work orders
    const client = useAxiosWithAuth();
    const [workOrders, setWorkOrders] = useState<WorkOrderDTO[]>([]);


    const fetchWorkOrders = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/`);
            // Ordenar por dispatchDate descendente (más reciente primero)
            const sortedOrders = response.data.sort(
                (a: WorkOrderDTO, b: WorkOrderDTO) =>
                    new Date(b.dispatchDate).getTime() - new Date(a.dispatchDate).getTime()
            );
            setWorkOrders(sortedOrders);
            console.log("Órdenes de trabajo:", sortedOrders);
        } catch (error) {
            console.error("Error al obtener órdenes de trabajo:", error);
            setWorkOrders([]);
        }
    };



    useEffect(() => {
        if (user) {
            fetchWorkOrders();
        }
    }, [user]);

    return (
        <div className="p-4 bg-gray-50 dark:bg-[#212121] dark:text-white w-full">
            <div className="flex w-full items-center justify-between mb-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold">Órdenes de Trabajo</h1>
                    <p>Gestiona y visualiza las órdenes de trabajo aquí.</p>
                </div>
                <aside className="mt-4">
                    {/* Boton para crear nueva orden */}
                    <Link href={"/mantenimiento/orden-de-trabajo/crear-orden"} className="px-4 py-3 hover:cursor-pointer  bg-amber-300 text-black font-semibold rounded hover:bg-amber-400 transition-colors">
                        <CirclePlus className="inline mr-2" />
                        Nueva Orden
                    </Link>
                </aside>
            </div>

            {/* ===================================== */}
            {/* Seccion de tabla de ordenes */}
            {/* ===================================== */}
            <main className="mt-6 bg-white dark:bg-neutral-800 p-4 rounded-md shadow border dark:border-neutral-700">
                <h2 className="text-3xl font-semibold mb-4">
                    <FileCog size={35} className="inline mr-2 text-amber-300" />
                    Lista de Órdenes de Trabajo
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">

                        <thead className="">
                            <tr className="py-6 border-b dark:border-neutral-400 h-14 items-center">
                                <th className="px-4 py-2 text-left">Código</th>
                                <th className="px-4 py-2 text-left">Fecha Ejecución</th>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-left">Responsable</th>
                                <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Simulación de datos */}
                            {
                                workOrders.length === 0 && (
                                    <tr className="text-center">
                                        <td colSpan={8} className="py-4 text-gray-500">
                                            No hay órdenes de trabajo registradas.
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                workOrders.map((orden) => (
                                    <tr key={orden.id} className="border-b dark:border-neutral-400 h-14">
                                        <td className="px-4 py-2">{orden.code}</td>
                                        <td className="px-4 py-2">{new Date(orden.dispatchDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{orden.type}</td>
                                        <td className="px-4 py-2">{orden.responsibleName}</td>
                                        <td className="px-4 py-2">
                                            <Link href={`/mantenimiento/orden-de-trabajo/${orden.id}`} className="text-blue-500 hover:underline">
                                                <Eye className="inline cursor-pointer text-blue-500 mr-2" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </main>

        </div>
    );
}