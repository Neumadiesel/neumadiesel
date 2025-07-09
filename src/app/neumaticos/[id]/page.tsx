'use client';
import LabelLoading from "@/components/common/forms/LabelLoading";
import ExportTireReport from "@/utils/export/ExportDataToExcel";
import Breadcrumb from "@/components/layout/BreadCrumb";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import { useAuth } from "@/contexts/AuthContext";
import { TireDTO } from "@/types/Tire";
import { useAuthFetch } from "@/utils/AuthFetch";
import { Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReferenceLine } from 'recharts';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
interface UnifiedRecord {
    id: number;
    type: "inspection" | "procedure";
    date: string;
    position: number | string;
    description: string;
    internalTread?: number;
    externalTread?: number;
    procedureName?: string;
    observation?: string;
}

interface MaintenanceDTO {
    id: number;
    executionDate: string;
    position: number | string;
    description?: string;
    internalTread?: number;
    externalTread?: number;
    // agrega otros campos si tu backend los retorna
}

interface normalizedInspectionDTO {
    id: number;
    type: string
    inspectionDate?: string;
    startDate?: string;
    position: number | string;
    description: string;
    internalTread?: number;
    externalTread?: number;
    procedureName?: string;
    approved?: boolean;
    observation?: string;
}

export default function TirePage() {
    const { id } = useParams();
    const authFetch = useAuthFetch();

    const [tire, setTires] = useState<TireDTO>();
    const [loading, setLoading] = useState(true);
    const [unifiedRecords, setUnifiedRecords] = useState<UnifiedRecord[]>([]);
    const { user } = useAuth();
    const [chartData, setChartData] = useState<{ date: string; avgRemanente: number }[]>([]);

    const fetchUnifiedRecords = async () => {
        setLoading(true);
        try {
            const [inspectionsRes, proceduresRes, maintenancesRes] = await Promise.all([
                authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/tire/${id}/all`),
                authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/tire/${id}`),
                authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance/tire/${id}`),
            ]);

            if (!inspectionsRes || !proceduresRes || !maintenancesRes) {
                console.warn("No se pudo obtener alguna de las respuestas (res es null).");
                return;
            }

            const inspections = await inspectionsRes.json();
            const procedures = await proceduresRes.json();
            const maintenances = await maintenancesRes.json();
            console.log("Mantenciones:", maintenances);

            const normalizedInspections: UnifiedRecord[] = inspections
                .filter((item: normalizedInspectionDTO) => item.approved === true)
                .map((item: normalizedInspectionDTO) => ({
                    id: item.id,
                    type: "inspection",
                    date: item.inspectionDate,
                    position: item.position,
                    description: item.description || "",
                    internalTread: item.internalTread,
                    externalTread: item.externalTread,
                    observation: item.observation,
                }));

            const normalizedMaintenances: UnifiedRecord[] = maintenances.map((item: MaintenanceDTO) => ({
                id: item.id,
                type: "maintenance",
                date: item.executionDate,
                position: item.position,
                description: item.description || "",
                internalTread: item.internalTread,
                externalTread: item.externalTread,
                observation: null,
            }));

            const normalizedProcedures: UnifiedRecord[] = procedures.map((item: normalizedInspectionDTO) => ({
                id: item.id,
                type: "procedure",
                date: item.startDate,
                position: item.position,
                description: item.description || "",
                internalTread: item.internalTread,
                externalTread: item.externalTread,
                procedureName: item.procedureName,
            }));

            const merged = [
                ...normalizedInspections,
                ...normalizedProcedures,
                ...normalizedMaintenances
            ];
            const sorted = merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setUnifiedRecords(sorted);

            const chartData = inspections
                .filter((item: normalizedInspectionDTO) => item.approved === true)
                .map((item: normalizedInspectionDTO) => {
                    const avgRemanente = ((item.internalTread ?? 0) + (item.externalTread ?? 0)) / 2;
                    return {
                        date: new Date(item.inspectionDate!).toISOString().split("T")[0], // formato yyyy-mm-dd
                        avgRemanente,
                    };
                });

            setChartData(chartData);
        } catch (error) {
            console.error("Error fetching combined records:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTires = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/${id}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setTires(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    useEffect(() => {
        fetchUnifiedRecords();
        fetchTires();
    }, []);

    useEffect(() => {
        fetchUnifiedRecords();
        fetchTires();
    }, [user]);

    const calculateWearPercentage = (initialTread: number | null, currentTread: number | null) => {
        if (initialTread === null || currentTread === null) return 0;
        if (initialTread === 0) return 0;
        return (((initialTread - currentTread) / initialTread) * 100).toFixed(2);
    };

    const criticalThreshold = tire?.model?.originalTread
        ? tire.initialTread * 0.2
        : 5;
    return (
        <div className="p-3 bg-white dark:bg-[#212121] relative shadow-sm">
            <Breadcrumb />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">
                    Información del Neumático: {tire?.code} - {tire?.model?.dimensions}
                </h1>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                    <Link href={`/inspeccion/${tire?.lastInspectionId}`}>
                        <div className="bg-neutral-100 text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-white transition-colors w-full flex items-center justify-center font-bold">
                            Ver Última Inspección
                        </div>
                    </Link>

                    {tire && (
                        <ExportTireReport
                            tire={tire}
                            records={unifiedRecords.map(r => ({
                                ...r, // includes id, type, etc.
                                description: r.description,
                                action:
                                    r.type === 'inspection'
                                        ? 'Chequeo'
                                        : r.type === 'procedure'
                                            ? r.procedureName ?? 'Otro'
                                            : 'Otro',
                                date: new Date(r.date).toISOString().split('T')[0],
                                position: r.position === 0 ? 'Stock' : r.position.toString(),
                                remanente: `${r.internalTread ?? '-'} / ${r.externalTread ?? '-'}`,
                            }))}
                        />
                    )}
                </div>
            </div>
            <section className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                    <div className="bg-gray-50 dark:bg-[#313131] dark:text-white p-4 rounded-md border dark:border-neutral-700 grid grid-cols-1 lg:grid-cols-3">
                        <div className="grid grid-cols-2 gap-2 max-lg:pb-4">
                            <LabelLoading loading={loading} title="Marca:" text={tire?.model?.brand || ""} />
                            <LabelLoading loading={loading} title="Patrón:" text={tire?.model?.pattern || ""} />
                            <LabelLoading loading={loading} title="Código:" text={tire?.model?.code || ""} />
                            <LabelLoading loading={loading} title="Medidas:" text={tire?.model?.dimensions || ""} />
                            <LabelLoading loading={loading} title="OTD:" text={tire?.model?.originalTread?.toString() || ""} />
                        </div>
                        <div className="lg:px-4 max-lg:py-4 grid grid-cols-2 gap-2 max-lg:border-y  lg:border-x border-gray-200 dark:border-neutral-700">
                            <LabelLoading
                                loading={loading}
                                title="Desgaste Interior:"
                                text={
                                    tire?.lastInspection?.internalTread !== undefined && tire?.lastInspection?.internalTread !== null
                                        ? tire.lastInspection.internalTread.toString()
                                        : ""
                                }
                            />
                            <LabelLoading
                                loading={loading}
                                title="Desgaste Exterior:"
                                text={
                                    tire?.lastInspection?.externalTread !== undefined && tire?.lastInspection?.externalTread !== null
                                        ? tire.lastInspection.externalTread.toString()
                                        : ""
                                }
                            />
                            <LabelLoading
                                loading={loading}
                                title="Kilometraje:"
                                text={
                                    tire?.lastInspection?.kilometrage !== undefined && tire?.lastInspection?.kilometrage !== null
                                        ? tire.lastInspection.kilometrage.toString()
                                        : ""
                                }
                            />
                            <LabelLoading
                                loading={loading}
                                title="Horas:"
                                text={
                                    tire?.lastInspection?.hours !== undefined && tire?.lastInspection?.hours !== null
                                        ? tire.lastInspection.hours.toString()
                                        : ""
                                }
                            />
                            {tire && (
                                <LabelLoading
                                    loading={loading}
                                    title="% de Desgaste:"
                                    text={
                                        tire.initialTread !== undefined && tire.lastInspection?.externalTread !== undefined
                                            ? `${calculateWearPercentage(tire.initialTread, tire.lastInspection.externalTread)}%`
                                            : ""
                                    }
                                />
                            )}
                        </div>
                        <div className="max-lg:pt-2 lg:px-4 flex flex-col gap-2">
                            <LabelLoading
                                loading={loading}
                                title="Ubicación:"
                                text={tire?.location?.name || ""}
                            />
                            <LabelLoading
                                loading={loading}
                                title="Equipo:"
                                text={tire?.installedTires?.[0]?.vehicle?.code || ""}
                            />
                            <LabelLoading
                                loading={loading}
                                title="Posición:"
                                text={
                                    tire?.installedTires?.[0]?.position !== undefined && tire?.installedTires?.[0]?.position !== null
                                        ? tire.installedTires[0].position.toString()
                                        : ""
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col w-full h-full text-gray-700 bg-white dark:bg-[#212121] dark:text-white mt-2 rounded-md">
                <h2 className="text-xl font-bold mt-4 mb-2">Historial de Movimientos</h2>

                <div className=" h-[65dvh] bg-emerald-50 dark:bg-neutral-800 dark:border-neutral-800 overflow-y-scroll border  mb-4">

                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="text-xs text-black uppercase sticky top-0 z-10 bg-gray-100 dark:bg-neutral-900 dark:text-white">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Acción</th>
                                <th className="p-4">Posición</th>
                                <th className="p-4">Remanente</th>
                                <th className="p-4">Ver</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 dark:bg-[#212121]">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">Cargando movimientos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : unifiedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8">
                                        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">No se han encontrado movimientos.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                unifiedRecords.map((record) => (
                                    <tr key={`${record.type}-${record.id}`} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200  dark:text-white">
                                        <td className="p-4 bg-gray-50 dark:bg-neutral-800">
                                            {/* Fecha UTC */}
                                            {new Date(record.date).toISOString().split("T")[0]}
                                        </td>
                                        <td className="p-4 dark:bg-neutral-900">
                                            {record.type === "inspection" ? "Chequeo" : (record as UnifiedRecord).procedureName ? (record as UnifiedRecord).procedureName : "Otro"}
                                        </td>
                                        <td className="p-4 bg-gray-50 dark:bg-neutral-900">
                                            {/* Posición */}
                                            {record.position === 0 ? "Stock" : record.position}
                                        </td>
                                        <td className="p-4 dark:bg-neutral-800">
                                            {/* Remanente */}
                                            {record.type === "procedure" && record.procedureName === "Ingreso al sistema"
                                                ? `${tire?.initialTread ?? "-"} / ${tire?.initialTread ?? "-"}`
                                                : `${record.internalTread ?? "-"} / ${record.externalTread ?? "-"}`
                                            }
                                        </td>
                                        {/* link para las inspecciones */}
                                        <td className="p-4 bg-gray-50 dark:bg-neutral-800">
                                            {record.type === "inspection" ? (
                                                <ToolTipCustom content="Ver Inspección">
                                                    <Link href={`/inspeccion/${record.id}`}>
                                                        <Info className="w-6 h-6 text-blue-500 hover:text-blue-700 transition-colors" />
                                                    </Link>
                                                </ToolTipCustom>
                                            ) : null}
                                        </td>

                                        <td className="p-4 dark:bg-neutral-800">
                                            {/* Descripción */}
                                            {record.description || "N/A"}
                                        </td>
                                        <td className="p-4 bg-gray-50 dark:bg-neutral-800">
                                            {/* Descripción */}
                                            {record.observation}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="my-4">
                <h2 className="text-xl font-bold mb-2 dark:text-white">Evolución del Remanente Promedio</h2>
                <div className="w-full h-96 bg-white dark:bg-[#313131] rounded-md p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRemanente" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="10%" stopColor="#fbbf24" stopOpacity={0.8} />
                                    <stop offset="90%" stopColor="#fbbf24" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip />

                            <ReferenceLine
                                y={criticalThreshold}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                label={{
                                    value: 'Remanente Bajo (20%)',
                                    position: 'insideTopLeft',
                                    fill: '#ef4444',
                                    fontSize: 12,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="avgRemanente"
                                stroke="#f59e0b"
                                fillOpacity={1}
                                fill="url(#colorRemanente)"
                                name="Remanente Prom."
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

        </div>
    );
}
