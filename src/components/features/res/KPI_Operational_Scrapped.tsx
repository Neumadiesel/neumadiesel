'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFetch } from '@/utils/AuthFetch';
import React, { useEffect, useState, useMemo } from 'react';
import Select from "react-select";
import {
    FaTachometerAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaAward,
    FaChartLine,
    FaClock
} from 'react-icons/fa';
import Skeleton_KPI_Operational_Scrapped from './skeleton/Skeleton_KPI_Operational';
import { Donut } from 'lucide-react';

interface LastInspection {
    hours: number;
    kilometrage: number;
    date?: string;
    internalTread: number;
    externalTread: number;
}

interface Procedure {
    startDate: string;
    tireHours: number;
    retirementReason?: { description: string };
    vehicle?: {
        model?: {
            model?: string;
        };
    };
}

interface Tire {
    id?: string;
    model: { dimensions: string };
    lastInspection: LastInspection;
    usedHours: number;
    code: string;
    procedures?: Procedure[];
    initialTread: number;
    createdAt?: string;
}

export default function TyresKPI() {
    const authFetch = useAuthFetch();
    const [operationalTires, setOperationalTires] = useState<Tire[]>([]);
    const [scrappedTires, setScrappedTires] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDimension, setSelectedDimension] = useState<string | null>('46/90R57');
    const [monthRange, setMonthRange] = useState(12);

    const { user, siteId } = useAuth();
    console.log("User in TyresKPI:", user);
    console.log("Site ID in TyresKPI:", siteId);

    const fetchData = async () => {
        try {
            const opRes = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/${siteId}`);
            if (!opRes) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const opData = await opRes.json();

            const scrRes = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/${siteId}`);
            if (!scrRes) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const scrData = await scrRes.json();

            setOperationalTires(opData);
            setScrappedTires(scrData);
        } catch (error) {
            console.error('Error fetching tire data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, siteId]);

    const allDimensions = useMemo(() => {
        const all = [...operationalTires, ...scrappedTires].map(t => t.model?.dimensions || 'Sin dimensión');
        return Array.from(new Set(all));
    }, [operationalTires, scrappedTires]);

    const kpis = useMemo(() => {
        if (loading) return null;

        // Filtro por dimensión
        const filteredOperational = selectedDimension
            ? operationalTires.filter(t => t.model?.dimensions === selectedDimension)
            : operationalTires;

        const filteredScrapped = selectedDimension
            ? scrappedTires.filter(t => t.model?.dimensions === selectedDimension)
            : scrappedTires;

        // Filtro por fecha de baja (procedures)
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(now.getMonth() - monthRange);

        const filteredScrappedByDate = filteredScrapped.filter(tire =>
            tire.procedures?.some(proc => new Date(proc.startDate) >= startDate)
        );

        const totalOperational = filteredOperational.length;
        const totalScrapped = filteredScrappedByDate.length;
        const totalTires = totalOperational + totalScrapped;

        const avgHoursOperational = totalOperational > 0
            ? filteredOperational.reduce((sum, t) => sum + (t.lastInspection?.hours || 0), 0) / totalOperational
            : 0;

        const avgHoursScrapped = totalScrapped > 0
            ? filteredScrappedByDate.reduce((sum, t) => sum + (t.procedures?.reduce((acc, p) => {
                const date = new Date(p.startDate);
                return date >= startDate ? acc + p.tireHours : acc;
            }, 0) || 0), 0) / totalScrapped
            : 0;

        const dimensionStats = [...filteredOperational, ...filteredScrappedByDate].reduce((acc, tire) => {
            const dim = tire.model?.dimensions || 'Sin dimensión';
            if (!acc[dim]) {
                acc[dim] = { operational: 0, scrapped: 0, totalHours: 0 };
            }

            const isOperational = filteredOperational.includes(tire);
            if (isOperational) {
                acc[dim].operational++;
                acc[dim].totalHours += tire.lastInspection?.hours || 0;
            } else {
                acc[dim].scrapped++;
                acc[dim].totalHours += tire.procedures?.reduce((sum, p) => {
                    const date = new Date(p.startDate);
                    return date >= startDate ? sum + p.tireHours : sum;
                }, 0) || 0;
            }

            return acc;
        }, {} as Record<string, { operational: number; scrapped: number; totalHours: number }>);

        const bestDimension = Object.entries(dimensionStats)
            .map(([dim, stats]) => ({
                dimension: dim,
                avgHours: stats.totalHours / (stats.operational + stats.scrapped),
                total: stats.operational + stats.scrapped,
                operationalRate: (stats.operational / (stats.operational + stats.scrapped)) * 100
            }))
            .sort((a, b) => b.avgHours - a.avgHours)[0];

        const retirementReasons = filteredScrappedByDate.reduce((acc, tire) => {
            tire.procedures?.forEach(proc => {
                const date = new Date(proc.startDate);
                if (date >= startDate && proc.retirementReason?.description) {
                    const reason = proc.retirementReason.description;
                    if (!acc[reason]) acc[reason] = 0;
                    acc[reason]++;
                }
            });
            return acc;
        }, {} as Record<string, number>);

        const avgTread = totalOperational > 0
            ? filteredOperational.reduce((sum, t) => {
                const int = t.lastInspection?.internalTread ?? 0;
                const ext = t.lastInspection?.externalTread ?? 0;
                return sum + (int + ext) / 2;
            }, 0) / totalOperational
            : 0;

        const mainRetirementReason = Object.entries(retirementReasons)
            .sort(([, a], [, b]) => b - a)[0];

        const topTire = filteredOperational
            .sort((a, b) => (b.lastInspection?.hours || 0) - (a.lastInspection?.hours || 0))[0];

        const wearRate = totalOperational > 0
            ? filteredOperational.reduce((sum, t) => {
                const original = t.initialTread ?? 100; // o un valor fijo
                const actual = ((t.lastInspection?.internalTread ?? 0) + (t.lastInspection?.externalTread ?? 0)) / 2;
                const used = t.lastInspection?.hours ?? 0;

                const worn = original - actual;
                const rate = worn > 0 ? used / worn : 0;

                return sum + rate;
            }, 0) / totalOperational
            : 0;


        const riskThreshold = Math.max(8000, avgHoursScrapped * 0.9);
        const tiresAtRisk = filteredOperational.filter(tire =>
            (tire.lastInspection?.hours || 0) >= riskThreshold
        ).length;

        const operationalRate = totalTires > 0 ? (totalOperational / totalTires) * 100 : 0;
        const avgMonthlyRetirements = totalScrapped / (monthRange || 1);
        const monthsToReplace = totalOperational > 0 ? totalOperational / Math.max(avgMonthlyRetirements, 1) : 0;

        return {
            totalOperational,
            totalScrapped,
            totalTires,
            avgHoursOperational,
            avgHoursScrapped,
            operationalRate,
            bestDimension,
            mainRetirementReason,
            topTire,
            tiresAtRisk,
            riskThreshold,
            monthsToReplace,
            dimensionStats,
            avgTread,
            wearRate
        };
    }, [operationalTires, scrappedTires, loading, selectedDimension, monthRange]);

    if (loading) return <Skeleton_KPI_Operational_Scrapped />;
    if (!kpis) return null;

    return (
        <div className="space-y-4">
            {/* Filtro por dimensión */}
            <div className='flex max-lg:flex-col gap-y-2 w-full gap-x-5 items-center'>
                <div className="flex justify-between max-lg:w-full items-center lg:gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por dimensión:</label>
                    <Select
                        options={allDimensions.map(dim => {
                            const count = [...operationalTires, ...scrappedTires].filter(t => t.model.dimensions === dim).length;
                            return {
                                value: dim,
                                label: `${dim} (${count} neumáticos)`
                            };
                        })}
                        isClearable
                        placeholder="Todas las dimensiones"
                        onChange={(e) => setSelectedDimension(e?.value || null)}
                        value={
                            selectedDimension
                                ? {
                                    value: selectedDimension,
                                    label: `${selectedDimension} (${[...operationalTires, ...scrappedTires].filter(t => t.model.dimensions === selectedDimension).length
                                        } neumáticos)`
                                }
                                : null
                        }
                        className="react-select-container text-black max-w-3/5 w-full sm:w-72"
                        classNamePrefix="react-select"
                    />




                </div>
                <div className='flex items-center max-lg:justify-between w-full gap-3'>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rango de tiempo:</label>
                    <Select
                        options={[
                            { value: 12, label: 'Últimos 12 meses' },
                            { value: 24, label: 'Últimos 24 meses' },
                            { value: 36, label: 'Últimos 36 meses' },
                            { value: 48, label: 'Últimos 48 meses' }
                        ]}
                        defaultValue={{ value: 12, label: 'Últimos 12 meses' }}
                        onChange={(e) => setMonthRange(e?.value || 12)}
                        className="react-select-container text-black max-w-3/5 w-full sm:w-48"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>


            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-4 rounded-lg shadow-md border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500 text-3xl" />
                        <div>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{kpis.totalOperational}</p>
                            <p className="text-sm text-green-600 dark:text-green-400">Neumáticos operativos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900 dark:to-rose-900 p-4 rounded-lg shadow-md border border-red-200 dark:border-red-700">
                    <div className="flex items-center gap-3">
                        <FaTimesCircle className="text-red-500 text-3xl" />
                        <div>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{kpis.totalScrapped}</p>
                            <p className="text-sm text-red-600 dark:text-red-400">Neumáticos dados de baja</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-3">
                        <Donut size={35} className="text-blue-500 text-3xl" />
                        <div>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{kpis.wearRate.toFixed(1)} h/mm</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Horas en las que se consume un milimetro</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 p-4 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3">
                        <FaTachometerAlt className="text-purple-500 text-3xl" />
                        <div>
                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round(kpis.avgHoursOperational)} hrs</p>
                            <p className="text-sm text-purple-600 dark:text-purple-400">Promedio horas neumáticos operativos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs de Análisis Avanzado */}
            <div className="grid grid-cols-1  md:grid-cols-4 lg:grid-cols-4 max-lg:gap-y-4 lg:gap-4">


                {/* Promedio de Horas de Baja */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 ">
                        <FaClock className="text-gray-500 text-3xl" />
                        <div>
                            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{Math.round(kpis.avgHoursScrapped)} hrs</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Promedio horas de baja</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Referencia para reemplazo</p>
                        </div>
                    </div>
                </div>


                {/* Neumático Destacado */}
                {kpis.topTire && (
                    <div className="bg-gradient-to-r col-span-2 from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-4 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center gap-4">
                            <FaAward className="text-yellow-500 text-4xl" />
                            <div className="flex-1">
                                <p className="text-xl font-semibold text-yellow-700 dark:text-yellow-300">Neumático con Mayor Rendimiento</p>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Dimensión</p>
                                        <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{kpis.topTire.model?.dimensions}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Código</p>
                                        <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{kpis.topTire.code}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Horas Acumuladas</p>
                                        <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{kpis.topTire.lastInspection?.hours?.toLocaleString()} hrs</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Kilometraje</p>
                                        <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{kpis.topTire.lastInspection?.kilometrage?.toLocaleString()} km</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {kpis.mainRetirementReason && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 w-full p-4 rounded-lg shadow-md border border-rose-200 dark:border-rose-700">
                        <div className="flex items-start gap-3">
                            <FaChartLine className="text-rose-500 text-3xl mt-1" />
                            <div className="flex-1">
                                <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">Principal Motivo de Baja</p>
                                <p className="text-lg font-bold text-rose-800 dark:text-rose-200">{kpis.mainRetirementReason[0]}</p>
                                <div className="mt-2">
                                    <p className="text-sm text-rose-600 dark:text-rose-400">
                                        {kpis.mainRetirementReason[1]} casos ({((kpis.mainRetirementReason[1] / kpis.totalScrapped) * 100).toFixed(1)}%)
                                    </p>
                                    <p className="text-xs text-rose-500 dark:text-rose-400">
                                        Del total de neumáticos dados de baja
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>



        </div>
    );
}
