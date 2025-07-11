// components/kpi/TireKPIOverview.tsx
'use client';

import Select from "react-select";
import { useEffect, useState } from 'react';
import { getKpiData, kpiItems } from '@/utils/kpiLogic';
import useAxiosWithAuth from '@/hooks/useAxiosWithAuth';
import { TireDTO } from '@/types/Tire';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Info, Siren } from 'lucide-react';
import ExportListOfTires from '@/utils/export/ExportListofTyresToExcel';

type KpiKey = 'inversion' | 'rotacion' | 'finVida' | 'temperatura' | 'posicionCritica';

interface KpiItem {
    key: KpiKey;
    title: string;
    criterio: string;
    color: string;
}
export default function TireKPIOverview() {
    const client = useAxiosWithAuth();
    const { user, siteId } = useAuth();

    const [selectedKpi, setSelectedKpi] = useState<KpiKey>(kpiItems[0].key as KpiKey);
    const [allTires, setAllTires] = useState<TireDTO[]>([]);
    const [filteredTires, setFilteredTires] = useState<TireDTO[] | null>([]);
    const [selectedDimension, setSelectedDimension] = useState<string | null>("46/90R57");
    const [allDimensions, setAllDimensions] = useState<string[]>([]);

    const fetchOperationalTires = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/${siteId}`);
            setAllTires(response.data);
            const dimensions = Array.from(
                new Set(response.data.map((t: TireDTO) => t.model.dimensions))
            ).filter((d): d is string => typeof d === "string");
            setAllDimensions(dimensions);

            const initialFiltered = getKpiData(response.data)[kpiItems[0].key as KpiKey] || [];
            setFilteredTires(initialFiltered);
        } catch (error) {
            console.error("Error al obtener neumáticos operativos:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOperationalTires();
        }
    }, [user, siteId]);

    const handleKpiClick = (kpiKey: KpiKey) => {
        setCurrentPage(1)
        setSelectedKpi(kpiKey);
        let filtered = getKpiData(allTires)[kpiKey] || [];
        if (selectedDimension) {
            filtered = filtered.filter(t => t.model.dimensions === selectedDimension);
        }
        setFilteredTires(filtered);
    };

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedTires = (filteredTires ?? []).slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const paddedTires: (TireDTO | null)[] = [...paginatedTires];
    while (paddedTires.length < ITEMS_PER_PAGE) {
        paddedTires.push(null);
    }

    const totalPages = Math.ceil((filteredTires ?? []).length / ITEMS_PER_PAGE);
    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-4">Alertas de Neumáticos</h1>
            <div className="mb-4   flex gap-x-2 items-center ">
                <label className="text-lg font-semibold text-gray-700 dark:text-white">
                    Seleccione una Dimensión:
                </label>
                <Select
                    options={allDimensions.map(dim => {
                        const count = allTires.filter(t => t.model.dimensions === dim).length;
                        return {
                            value: dim,
                            label: `${dim} (${count} neumáticos)`
                        };
                    })}
                    isClearable
                    placeholder="Todas las dimensiones"
                    onChange={(e) => {
                        setSelectedDimension(e?.value || null);
                        // volver a aplicar filtro
                        const filtered = getKpiData(allTires)[selectedKpi] || [];
                        setFilteredTires(
                            e?.value ? filtered.filter(t => t.model.dimensions === e.value) : filtered
                        );
                        setCurrentPage(1); // reiniciar paginación
                    }}
                    value={
                        selectedDimension
                            ? {
                                value: selectedDimension,
                                label: `${selectedDimension} (${allTires.filter(t => t.model.dimensions === selectedDimension).length} neumáticos)`
                            }
                            : null
                    }
                    className="react-select-container text-black w-full sm:w-96"
                    classNamePrefix="react-select"
                />
            </div>

            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {kpiItems.map((kpi: KpiItem) => (
                    <div
                        key={kpi.key}
                        className={`bg-${kpi.color}-50 dark:bg-nuetral-800 text-${kpi.color}-500 dark:text-${kpi.color}-600  border border-${kpi.color}-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                        onClick={() => handleKpiClick(kpi.key)}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-2xl w-1/5">
                                    <Siren size={35} />
                                </div>
                                <div className="text-right w-4/5">
                                    <div className="text-xl font-bold">{kpi.title}</div>
                                </div>
                            </div>

                            <div className="text-sm opacity-90">{kpi.criterio}</div>
                        </div>
                    </div>
                ))}
            </section>


            <section className="bg-white dark:bg-neutral-900  rounded-sm ">
                <div className='w-full flex justify-between items-center p-2  dark:bg-[#212121] rounded-t-sm'>
                    <div className="flex flex-col gap-1 max-lg:w-1/2">
                        <h2 className="text-2xl font-bold">{kpiItems.find(i => i.key === selectedKpi)?.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {kpiItems.find(i => i.key === selectedKpi)?.criterio}
                        </p>
                    </div>
                    {
                        filteredTires && filteredTires.length > 0 &&
                        <ExportListOfTires
                            title={`LISTA DE NEUMÁTICOS EN ALERTA POR: ${kpiItems.find(i => i.key === selectedKpi)?.title.toUpperCase()}` || "RESUMEN DE NEUMÁTICOS"}
                            tireList={filteredTires}
                        />
                    }
                </div>
                <table className="w-full table-auto text-sm  min-h-[60dvh] max-h-[70dvh] overflow-scroll">
                    <thead className="bg-gray-800 text-white dark:bg-gray-800">
                        <tr className='text-start'>
                            <th className="p-2 text-start">Código</th>
                            <th className="p-2">Posición</th>
                            <th className='p-2'>Equipo</th>
                            <th className="p-2">Interno</th>
                            <th className="p-2">Externo</th>
                            <th className="p-2">Presión</th>
                            <th className="p-2">Temperatura</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paddedTires.map((tire: TireDTO | null, index: number) => (
                            <tr key={index} className="border-t dark:border-gray-800 text-center">
                                <td className="p-2 text-start">{tire?.code || "-"}</td>
                                <td className="p-2">{tire?.lastInspection.position || "-"}</td>
                                <td className="p-2">{tire?.installedTires[0].vehicle.code || "-"}</td>

                                <td className="p-2">{tire?.lastInspection.internalTread || "-"}</td>
                                <td className="p-2">{tire?.lastInspection.externalTread || "-"}</td>
                                <td className="p-2">{tire?.lastInspection.pressure || "-"}</td>
                                <td className="p-2">{tire?.lastInspection.temperature || "-"}</td>
                                <td className={`p-2 flex justify-center ${tire === null ? "hidden" : "flex"}`}>
                                    <Link href={`/neumaticos/${tire?.id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        <Info className="inline mr-1" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </section>
            {totalPages > 1 ? (
                <div className="flex justify-center gap-2 p-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                        ← Anterior
                    </button>
                    <span className="px-4 py-1 font-medium">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
                    >
                        Siguiente →
                    </button>
                </div>
            ) :
                (
                    <div className="text-center text-gray-500 p-4">
                        No hay más páginas.
                    </div>
                )}
        </div>
    );
}