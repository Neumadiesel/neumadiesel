"use client"
import { FileCheck, Info } from "lucide-react";
import Link from "next/link";

import { useState, useEffect } from "react";
import { InspectionDTO } from "@/types/Inspection";
import { useAuth } from "@/contexts/AuthContext";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import Modal from "@/components/common/modal/CustomModal";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";


interface KpiDTO {
    operationalTires: number;
    operationalVehicles: number;
    treadAlerts: number;
    tyresInspectedThisWeek: number;
}
export default function MedicionPage() {
    const { user, token } = useAuth();
    const client = useAxiosWithAuth();
    const [pendingInspections, setPendingInspections] = useState<InspectionDTO[]>([]);
    const [lastApprovedInspection, setLastApprovedInspection] = useState<InspectionDTO[]>([]);
    const [kpi, setKpi] = useState<KpiDTO>(); // Puedes definir un tipo más específico si lo deseas
    const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
    const [inspectionIdToDeny, setInspectionIdToDeny] = useState<number | null>(null);

    // Funcion de axios que pide las inspecciones pendientes
    const fetchPendingInspections = async () => {
        try {

            const response = await client.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/site/1/disapproved`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPendingInspections(response.data);
        } catch (error) {
            console.error("Error fetching pending inspections:", error);
            return []; // Retorna un array vacío en caso de error
        }
    };

    // Get kpi
    const fetchKpi = async () => {
        try {


            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reporting/kpis/1`);
            setKpi(response.data);
        } catch (error) {
            console.error("Error fetching KPI:", error);
            return null; // Retorna null en caso de error
        }
    }

    // fetch las 50 inspecciones aprobadas http://localhost:3002/inspections/site/1/last-50
    const fetchLastInspections = async () => {
        try {


            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/site/1/last-25`);
            setLastApprovedInspection(response.data);
        } catch (error) {
            console.error("Error fetching last inspections:", error);
            return []; // Retorna un array vacío en caso de error
        }
    };

    const aproveInspection = async (inspectionId: number) => {

        const approvedById = user?.user_id; // ID del usuario que aprueba la inspección, puedes obtenerlo del contexto o estado global
        const approvedByName = user?.name + " " + user?.last_name; // Nombre del usuario que aprueba la inspección
        try {

            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${inspectionId}/approve`,
                {
                    approvedUserId: approvedById, // ID del usuario que aprueba la inspección
                    approvedUserName: approvedByName, // Nombre del usuario que aprueba la inspección
                }
            );
            console.log("Inspección aprobada:", response.data);
            // Actualizar la lista de inspecciones pendientes
            fetchLastInspections();
            fetchPendingInspections();
        } catch (error) {
            console.error("Error approving inspection:", error);
            return [];
        }
    };

    const handleDenyInspection = (inspectionId: number) => {
        setInspectionIdToDeny(inspectionId);
        setIsDenyModalOpen(true);
    };

    // Denegar inspección
    const denyInspection = async () => {
        if (inspectionIdToDeny === null) {
            console.error("No inspection ID provided for denial.");
            return;
        }

        try {

            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${inspectionIdToDeny}/deny`
            );
            console.log("Inspección denegada:", response.data);
            // Actualizar la lista de inspecciones pendientes
            fetchLastInspections();
            fetchPendingInspections();
            setIsDenyModalOpen(false); // Cerrar el modal después de denegar
            setInspectionIdToDeny(null); // Resetear el ID de inspección a den
        } catch (error) {
            console.error("Error denying inspection:", error);
            return [];
        }
    }

    useEffect(() => {
        fetchPendingInspections();
        fetchLastInspections();
        fetchKpi();
    }, []);

    useEffect(() => {
        fetchPendingInspections();
        fetchLastInspections();
        fetchKpi();
    }, [user]);

    return (
        <div className="bg-neutral-50 dark:bg-[#212121] dark:text-white flex flex-col p-2 lg:p-4">
            <div className="w-full flex max-lg:flex-col justify-between mb-2">

                <h1 className="text-4xl dark:text-white font-semibold">Panel de Inspecciones</h1>
                <div className="flex max-lg:flex-col items-center gap-2 max-lg:py-2">
                    {/* Inspeccionar equipo */}
                    <Link href="/medicion/medicion-por-equipo" className="bg-green-500 max-lg:w-full text-center text-white px-4 py-2 rounded flex justify-center  items-center gap-2 hover:bg-emerald-600 transition-colors">
                        <p className="text-lg font-semibold">
                            Inspeccionar Equipo
                        </p>
                    </Link>
                    {/* Inspeccionar neumatico */}
                    <Link href="/medicion/medicion-por-neumatico" className="bg-blue-500 max-lg:w-full text-white px-4 py-2 rounded flex justify-center items-center gap-2 hover:bg-blue-600 transition-colors">
                        <p className="text-lg font-semibold">
                            Inspeccionar Neumático
                        </p>
                    </Link>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Aquí puedes realizar inspecciones de neumáticos, verificar su estado y registrar cualquier anomalía.
            </p>
            {/* Seccion de principales estadisticas */}
            <section className="w-full p-2 lg:p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800  flex flex-col items-center">
                        <p className="text-xl font-semibold mb-2">Chequeos Pendientes</p>
                        <p className="text-3xl font-bold">
                            {pendingInspections.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <p className="text-xl font-semibold mb-2">Chequeos Última Semana</p>
                        <p className="text-3xl font-bold">{kpi?.tyresInspectedThisWeek}</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <p className="text-xl font-semibold mb-2">Neumáticos en Alerta</p>
                        <p className="text-3xl font-bold">{kpi?.treadAlerts}</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <p className="text-xl font-semibold mb-2">Neumáticos Operativos</p>
                        <p className="text-3xl font-bold">{kpi?.operationalTires}</p>
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
                                        {/* Denegar */}
                                        <button
                                            onClick={() => handleDenyInspection(inspection.id)}
                                            className="bg-red-500 text-white hover:cursor-pointer px-4 py-2 rounded hover:bg-red-600 transition-colors font-semibold">
                                            Denegar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </section>
            {/* Ultimas Inspecciones Aprobadas */}
            <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h2 className="text-3xl font-semibold mb-4 flex items-center">
                    <FileCheck size={32} className="inline mr-2 text-emerald-400" />
                    Ultimas Inspecciones Aprobadas
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver las últimas inspecciones aprobadas por el personal autorizado.
                </p>
                {/* Tabla de mediciones semanales */}
                {/* Tabla de inspecciones pendientes */}
                <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                    <thead>
                        <tr className="border-b dark:border-neutral-600">
                            <th className="px-4 py-2 text-left">Neumático</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Equipo</th>
                            <th className="px-4 py-2 text-left">Remanente</th>
                            <th className="px-4 py-2 text-left">Inspector</th>
                            {/* aprobado por */}
                            <th className="px-4 py-2 text-left">Aprobado por</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lastApprovedInspection.length === 0 && (
                                <tr className="border-b dark:border-neutral-600">
                                    <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                                        No hay inspecciones pendientes
                                    </td>
                                </tr>
                            )
                        }
                        {
                            lastApprovedInspection.map((inspection) => (
                                <tr key={inspection.id} className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                    <td className="px-4 py-2">{inspection.tire.code}</td>
                                    <td className="px-4 py-2">{new Date(inspection.inspectionDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        {inspection.tire.installedTires?.[0]?.vehicle?.code ?? "N/A"}
                                    </td>
                                    <td className="px-4 py-2">{`${inspection.externalTread}/${inspection.internalTread}`}</td>
                                    <td className="px-4 py-2">{inspection.approvedByName}</td>
                                    <td className="px-4 py-2">{inspection.inspectorName}</td>
                                    <td className="px-4 py-2 gap-2 flex">
                                        <ToolTipCustom content="Ver Inspección">
                                            <Link href={`/medicion/${inspection.id}`}>
                                                <Info className="w-6 h-6 text-emerald-400 hover:text-emerald-500 transition-colors" />
                                            </Link>
                                        </ToolTipCustom>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>
            <Modal isOpen={isDenyModalOpen} onClose={() => setIsDenyModalOpen(false)} onConfirm={denyInspection} title="¿Estás seguro?">
                <p>
                    Esta Inspección será denegada y no podrá ser aprobada nuevamente. ¿Deseas continuar?
                </p>
            </Modal>
        </div>
    );
}