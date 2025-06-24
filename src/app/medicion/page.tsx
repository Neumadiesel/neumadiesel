"use client"
import { FileCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import { InspectionDTO } from "@/types/Inspection";
import { TireDTO } from "@/types/Tire";
import OldTyres from "@/components/common/charts/neumatico/OldTyres";
import { useAuth } from "@/contexts/AuthContext";

interface LastInspectionsDTO {
    vehicleId: number;
    code: string;
    inspectionDate: string; // ISO date string
}
export default function MedicionPage() {
    const { user } = useAuth();
    const [pendingInspections, setPendingInspections] = useState<InspectionDTO[]>([]);
    const [lastInspectedVehicle, setLastInspectedVehicle] = useState<LastInspectionsDTO[]>([]);
    // Funcion de axios que pide las inspecciones pendientes
    const fetchPendingInspections = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/site/1/disapproved`);
            setPendingInspections(response.data);
        } catch (error) {
            console.error("Error fetching pending inspections:", error);
            return []; // Retorna un array vacío en caso de error
        }
    };

    const aproveInspection = async (inspectionId: number) => {

        const approvedById = user?.user_id; // ID del usuario que aprueba la inspección, puedes obtenerlo del contexto o estado global
        const approvedByName = user?.name + " " + user?.last_name; // Nombre del usuario que aprueba la inspección
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${inspectionId}/approve`,
                {
                    approvedUserId: approvedById, // ID del usuario que aprueba la inspección
                    approvedUserName: approvedByName, // Nombre del usuario que aprueba la inspección
                }
            );
            console.log("Inspección aprobada:", response.data);
            // Actualizar la lista de inspecciones pendientes
            fetchPendingInspections();
        } catch (error) {
            console.error("Error approving inspection:", error);
            return [];
        }
    };

    const lastVehicleInspected = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/last-inspected-equipment`);
            setLastInspectedVehicle(response.data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching last inspected vehicle:", error);
            return null; // Retorna null en caso de error
        }
    };

    useEffect(() => {
        fetchPendingInspections();
        lastVehicleInspected();
    }, []);
    return (
        <div className="bg-neutral-50 dark:bg-[#212121] dark:text-white flex flex-col  p-4">
            <div className="w-full flex justify-between mb-2">

                <h1 className="text-4xl dark:text-white font-semibold">Panel de Inspecciones</h1>
                <button className="bg-amber-300 text-black px-4 py-2 rounded flex justify-between items-center gap-2 hover:bg-amber-400 transition-colors">
                    <p className="text-lg font-semibold">
                        Realizar Inspección
                    </p>
                </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Aquí puedes realizar inspecciones de neumáticos, verificar su estado y registrar cualquier anomalía.
            </p>
            {/* Seccion de principales estadisticas */}
            <section className="w-full p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800  flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Chequeos Pendientes</h2>
                        <p className="text-3xl font-bold">
                            {pendingInspections.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Chequeos de esta Semana</h2>
                        <p className="text-3xl font-bold">20</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Neumáticos en Alerta</h2>
                        <p className="text-3xl font-bold">15</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Neumáticos Críticos</h2>
                        <p className="text-3xl font-bold">15</p>
                    </div>
                </div>
            </section>
            {/* Seccion de Inspecciones pendientees de aprobacion */}
            <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-4">
                    <FileCheck size={32} className="inline mr-2 text-amber-500" />
                    <h2 className="text-3xl font-semibold flex items-center">
                        Inspecciones que requieren revisión y aprobación
                    </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver las inspecciones que requieren tu aprobación.
                </p>
                {/* Tabla de inspecciones pendientes */}
                <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                    <thead>
                        <tr className="border-b dark:border-neutral-600">
                            <th className="px-4 py-2 text-left">Neumático</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Remanente</th>
                            <th className="px-4 py-2 text-left">Inspector</th>
                            <th className="px-4 py-2 text-left">Observacion</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pendingInspections.length === 0 && (
                                <tr className="border-b dark:border-neutral-600">
                                    <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                                        No hay inspecciones pendientes
                                    </td>
                                </tr>
                            )
                        }
                        {
                            pendingInspections.map((inspection) => (
                                <tr key={inspection.id} className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                    <td className="px-4 py-2">{inspection.tire.code}</td>
                                    <td className="px-4 py-2">{new Date(inspection.inspectionDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{`${inspection.externalTread}/${inspection.internalTread}`}</td>
                                    <td className="px-4 py-2">{inspection.inspectorName}</td>
                                    <td className="px-4 py-2">{inspection.observation || "N/A"}</td>
                                    <td className="px-4 py-2 gap-2 flex">
                                        <Link href={`/medicion/${inspection.id}`} className="bg-gray-50 text-black border hover:cursor-pointer px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
                                            Revisar
                                        </Link>
                                        <button
                                            onClick={() => aproveInspection(inspection.id)}
                                            className="bg-amber-300 text-black hover:cursor-pointer px-4 py-2 rounded hover:bg-amber-400 transition-colors font-semibold">
                                            Aprobar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>
            {/* Seccion de ultimos equipos inspeccionados */}
            <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h2 className="text-3xl font-semibold mb-4 flex items-center">
                    <FileCheck size={32} className="inline mr-2 text-emerald-400" />
                    Ultimos Equipos Inspeccionados
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver los últimos equipos inspeccionados y sus fechas de inspección.
                </p>
                {/* Tabla de mediciones semanales */}
                <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                    <thead>
                        <tr className="border-b dark:border-neutral-600">
                            <th className="px-4 py-2 text-left">Equipo</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lastInspectedVehicle.length === 0 && (
                                <tr className="border-b dark:border-neutral-600">
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                        No hay mediciones semanales registradas
                                    </td>
                                </tr>
                            )
                        }
                        {
                            lastInspectedVehicle.map((vehicle, index) => (
                                <tr key={index} className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                    <td className="px-4 py-2">{vehicle.code}</td>
                                    <td className="px-4 py-2">{new Date(vehicle.inspectionDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        <Link href={`/maquinaria/${vehicle.vehicleId}`} className="bg-gray-50 text-black border hover:cursor-pointer px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </section>
            {/* Seccion para ver los neumaticos criticos */}
            <OldTyres />
        </div>
    );
}