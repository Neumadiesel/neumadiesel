'use client';
import LabelLoading from "@/components/common/forms/LabelLoading";
import ExportTireReport from "@/components/features/neumatico/data/ExportDataToExcel";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { TireDTO } from "@/types/Tire";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UnifiedRecord {
    id: number;
    type: "inspection" | "procedure";
    date: string;
    position: number | string;
    description: string;
    internalTread?: number;
    externalTread?: number;
    procedureName?: string;
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
}

export default function TirePage() {
    const { id } = useParams();

    const [tire, setTires] = useState<TireDTO>();
    const [loading, setLoading] = useState(true);
    const [unifiedRecords, setUnifiedRecords] = useState<UnifiedRecord[]>([]);

    const fetchUnifiedRecords = async () => {
        setLoading(true);
        try {
            const [inspectionsRes, proceduresRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/tire/${id}/all`),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/tire/${id}`)
            ]);

            const inspections = await inspectionsRes.json();
            const procedures = await proceduresRes.json();

            const normalizedInspections: UnifiedRecord[] = inspections.map((item: normalizedInspectionDTO
            ) => ({
                id: item.id,
                type: "inspection",
                date: item.inspectionDate,
                position: item.position,
                description: item.description || "",
                internalTread: item.internalTread,
                externalTread: item.externalTread,
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

            const merged = [...normalizedInspections, ...normalizedProcedures];
            const sorted = merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setUnifiedRecords(sorted);
        } catch (error) {
            console.error("Error fetching combined records:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTires = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/${id}`);
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

    const calculateWearPercentage = (initialTread: number | null, currentTread: number | null) => {
        if (initialTread === null || currentTread === null) return 0;
        if (initialTread === 0) return 0;
        return (((initialTread - currentTread) / initialTread) * 100).toFixed(2);
    };

    return (
        <div className="p-3 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm">
            <Breadcrumb />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Información del Neumático: {tire?.code}</h1>
                <div className="flex flex-row justify-between items-center gap-2">
                    <Link href={`/medicion/${tire?.lastInspectionId}`}>
                        <div className="bg-neutral-100 text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-white transition-colors w-full flex items-center justify-center font-bold">

                            Ver Inspección
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
                    <div className="bg-gray-50 dark:bg-[#313131] dark:text-white p-4 rounded-md border grid grid-cols-1 lg:grid-cols-3">
                        <div className="grid grid-cols-2 gap-2 max-lg:pb-4">
                            <LabelLoading loading={loading} title="Marca:" text={tire?.model.brand || ""} />
                            <LabelLoading loading={loading} title="Patrón:" text={tire?.model.pattern || ""} />
                            <LabelLoading loading={loading} title="Código:" text={tire?.model.code || ""} />
                            <LabelLoading loading={loading} title="Medidas:" text={tire?.model.dimensions || ""} />
                            <LabelLoading loading={loading} title="OTD:" text={tire?.model.originalTread?.toString() || ""} />
                        </div>
                        <div className="lg:px-4 max-lg:py-4 grid grid-cols-2 gap-2 max-lg:border-y lg:border-x border-gray-200">
                            <LabelLoading loading={loading} title="Desgaste Interior:" text={tire?.lastInspection?.internalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Desgaste Exterior:" text={tire?.lastInspection?.externalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Kilometraje:" text={tire?.lastInspection?.kilometrage?.toString() || ""} />
                            <LabelLoading loading={loading} title="Horas:" text={tire?.lastInspection.hours?.toString() || ""} />
                            {tire && <LabelLoading loading={loading} title="% de Desgaste:" text={`${calculateWearPercentage(tire?.initialTread, tire?.lastInspection?.externalTread)}%`} />}
                        </div>
                        <div className="max-lg:pt-2 lg:px-4 flex flex-col gap-2">
                            <LabelLoading loading={loading} title="Ubicación:" text={tire?.location.name || ""} />
                            <LabelLoading loading={loading} title="Equipo:" text={tire?.installedTires[0]?.vehicle?.code || ""} />
                            <LabelLoading loading={loading} title="Posición:" text={tire?.installedTires[0]?.position?.toString() || ""} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white dark:bg-[#212121] dark:text-white mt-2 rounded-md">
                <h2 className="text-xl font-bold mt-4 mb-2">Historial de Movimientos</h2>
                <table className="w-full text-left table-auto min-w-max">
                    <thead className="text-xs text-black uppercase bg-gray-100 dark:bg-neutral-900 dark:text-white">
                        <tr>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Acción</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Posición</th>
                            <th className="p-4">Remanente</th>
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
                                <tr key={`${record.type}-${record.id}`} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200 dark:text-white">
                                    <td className="p-4 bg-gray-50 dark:bg-neutral-800">
                                        {/* Descripción */}
                                        {record.description}
                                    </td>
                                    <td className="p-4 dark:bg-neutral-900">
                                        {/* Acción */}
                                        {record.type === "inspection" ? "Chequeo" : (record as UnifiedRecord).procedureName ? (record as UnifiedRecord).procedureName : "Otro"}
                                    </td>
                                    <td className="p-4 dark:bg-neutral-800">
                                        {/* Fecha UTC */}
                                        {new Date(record.date).toISOString().split("T")[0]}
                                    </td>
                                    <td className="p-4 bg-gray-50 dark:bg-neutral-900">
                                        {/* Posición */}
                                        {record.position === 0 ? "Stock" : record.position}
                                    </td>
                                    <td className="p-4 bg-gray-50 dark:bg-neutral-800">
                                        {/* Remanente */}
                                        {(record.internalTread ?? "-")} / {(record.externalTread ?? "-")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

        </div>
    );
}
