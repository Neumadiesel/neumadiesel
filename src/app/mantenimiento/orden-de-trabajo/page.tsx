"use client"
import ModalCrearOrden from "@/components/features/ordendetrabajo/ModalCrearOrden";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { Ban, CirclePlus, Eye, FileCog, Funnel, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface WorkOrderDTO {
    id: number;
    date: string; // formato ISO
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
    procedures: any[]; // Puedes definir un tipo más específico si es necesario
}
export default function OrdenDeTrabajoPage() {

    const [modalAbierto, setModalAbierto] = useState(false);
    const { user } = useAuth();
    // axios get work orders
    const client = useAxiosWithAuth();
    const [workOrders, setWorkOrders] = useState<WorkOrderDTO[]>([]);

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

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    useEffect(() => {
        fetchWorkOrders();
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
                    <button onClick={() => { setModalAbierto(true) }} className="px-4 py-3 hover:cursor-pointer  bg-amber-300 text-black font-semibold rounded hover:bg-amber-400 transition-colors">
                        <CirclePlus className="inline mr-2" />
                        Nueva Orden
                    </button>
                </aside>
            </div>
            {/* Seccion de kpis */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Mantenimientos Programados</h2>
                    <p className="text-3xl font-bold">22</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Mantenimientos programados para esta semana.
                    </p>
                </div>
                <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Órdenes Completadas</h2>
                    <p className="text-3xl font-bold">15
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Órdenes que han sido finalizadas.</p>
                </div>
                <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Órdenes en Pendientes</h2>
                    <p className="text-3xl font-bold">4</p>
                    <p className="text-gray-600 dark:text-gray-400">Órdenes que están pendientes de ejecución.</p>
                </div>
                {/* KPI Completadas */}
                <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Porcentaje de Cumplimiento</h2>
                    <p className="text-3xl font-bold">83%</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Porcentaje de órdenes completadas a tiempo.
                    </p>
                </div>
            </section>

            {/* Seccion de filtros */}
            <section className="mt-6 dark:bg-neutral-800 p-4 rounded-md shadow border dark:border-neutral-700">
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
                    {/* Filtro por estado */}
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
                    {/* Filtro por Tipo */}
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
                    {/* Boton de limpiar filtro */}
                    <div className="bg-white dark:bg-neutral-800  p-2">
                        <label className="block mb-2">Limpiar Filtros</label>
                        <button className=" w-full py-2 bg-gray-200 dark:bg-neutral-700 text-black dark:text-white h-10 font-semibold rounded hover:bg-gray-300 transition-colors">
                            Limpiar Filtros
                        </button>
                    </div>

                </div>
            </section>

            {/* ===================================== */}
            {/* Seccion de tabla de ordenes */}
            {/* ===================================== */}
            <main className="mt-6 bg-white dark:bg-neutral-800 p-4 rounded-md shadow border dark:border-neutral-700">
                <h2 className="text-3xl font-semibold mb-4">
                    <FileCog size={35} className="inline mr-2 text-amber-300" />
                    Lista de Órdenes de Trabajo</h2>
                <table className="w-full table-auto">
                    <thead className="">
                        <tr className="py-6 border-b dark:border-neutral-400 h-14 items-center">
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left">Equipo</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                            <th className="px-4 py-2 text-left">Tipo</th>
                            <th className="px-4 py-2 text-left">Fecha Programada</th>
                            <th className="px-4 py-2 text-left">Fecha Ejecución</th>
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
                                    <td className="px-4 py-2">{orden.id}</td>
                                    <td className="px-4 py-2">{orden.vehicleId}</td>
                                    <td className="px-4 py-2">
                                        {orden.interventionType === "completada" ? (
                                            <span className="text-green-500">Completada</span>
                                        ) : (
                                            <span className="text-yellow-500">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{orden.interventionType}</td>
                                    <td className="px-4 py-2">{new Date(orden.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{new Date(orden.dispatchDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{orden.technician}</td>
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
            </main>

            {modalAbierto && (
                <ModalCrearOrden onClose={() => setModalAbierto(false)} />
            )}
        </div>
    );
}