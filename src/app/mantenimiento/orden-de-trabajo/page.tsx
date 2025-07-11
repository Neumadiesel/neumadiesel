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

interface kpis {
    programadosSemana: number;
    completadas: number;
    pendientes: number;
    porcentajeCumplimiento: number;
}
export default function OrdenDeTrabajoPage() {

    const { user } = useAuth();
    // axios get work orders
    const client = useAxiosWithAuth();
    const [workOrders, setWorkOrders] = useState<WorkOrderDTO[]>([]);
    const [kpis, setKpis] = useState<kpis>({
        programadosSemana: 0,
        completadas: 0,
        pendientes: 0,
        porcentajeCumplimiento: 0,
    });

    const fetchWorkOrders = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/`);
            setWorkOrders(response.data);
            console.log("Órdenes de trabajo:", response.data);
        } catch (error) {
            console.error("Error al obtener órdenes de trabajo:", error);
            setWorkOrders([]);
        }
    };

    // fetch kpis maintenance-program/kpis
    const fetchKpis = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/kpis`);
            setKpis(response.data);
            console.log("KPIs:", response.data);
        } catch (error) {
            console.error("Error al obtener KPIs:", error);
        }
    };


    useEffect(() => {
        if (user) {
            fetchWorkOrders();
            fetchKpis();
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
            {/* Seccion de filtros */}
            {/* <section className="mt-6 dark:bg-neutral-800 p-4 rounded-md shadow border dark:border-neutral-700">
                <h2 className="text-3xl font-semibold mb-4">
                    <Funnel size={35} className=" text-blue-500 inline mr-2" />
                    Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="bg-white dark:bg-neutral-800  p-2">
                        <label className="block mb-2 font-bold">Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar por código o equipo."
                            className="w-full h-10 p-2 border dark:border-neutral-600 rounded dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors"
                        />
                    </div>
                    <div className="bg-white dark:bg-neutral-800  p-2">
                        <label className="block mb-2">Estado</label>
                        <select
                            className="w-full p-2 border dark:border-neutral-600 rounded dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors h-10"
                        >
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                    <div className="bg-white dark:bg-neutral-800  p-2">
                        <label className="block mb-2">Tipo de Orden</label>
                        <select
                            className="w-full p-2 border dark:border-neutral-600 rounded dark:bg-neutral-700 dark:text-white  h-10 focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors"
                        >
                            <option value="">Todos</option>
                            <option value="mantenimiento">Programada</option>
                            <option value="reparacion">Imprevista</option>
                            <option value="inspeccion">Preventiva</option>
                        </select>
                    </div>
                    <div className="bg-white dark:bg-neutral-800  p-2">
                        <label className="block mb-2">Limpiar Filtros</label>
                        <button className=" w-full py-2 bg-gray-200 dark:bg-neutral-700 text-black dark:text-white h-10 font-semibold rounded hover:bg-gray-300 transition-colors">
                            Limpiar Filtros
                        </button>
                    </div>

                </div>
            </section> */}

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
                                <th className="px-4 py-2 text-left">Descripción</th>
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
                                        <td className="px-4 py-2">{orden.description}</td>
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