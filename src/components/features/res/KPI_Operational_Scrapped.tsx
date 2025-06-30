'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFetch } from '@/utils/AuthFetch';
import React, { useEffect, useState, useMemo } from 'react';
import {
    FaTachometerAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaAward,
    FaChartLine,
    FaIndustry,
    FaPercentage,
    FaClock
} from 'react-icons/fa';

interface LastInspection {
    hours: number;
    kilometrage: number;
    date?: string;
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
    createdAt?: string;
}

export default function TyresKPI() {
    const authFetch = useAuthFetch();
    const [operationalTires, setOperationalTires] = useState<Tire[]>([]);
    const [scrappedTires, setScrappedTires] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const opRes = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`);
            const opData = await opRes.json();

            const scrRes = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);
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
        fetchData();
    }, []);


    useEffect(() => {
        fetchData();
    }, [user]);

    // Cálculos avanzados de KPIs
    const kpis = useMemo(() => {
        if (loading) return null;

        const totalOperational = operationalTires.length;
        const totalScrapped = scrappedTires.length;
        const totalTires = totalOperational + totalScrapped;

        // KPIs básicos
        const avgHoursOperational = totalOperational > 0
            ? operationalTires.reduce((sum, t) => sum + (t.lastInspection?.hours || 0), 0) / totalOperational
            : 0;

        const avgHoursScrapped = totalScrapped > 0
            ? scrappedTires.reduce((sum, t) => sum + (t.procedures?.reduce((acc, p) => acc + p.tireHours, 0) || 0), 0) / totalScrapped
            : 0;

        // Análisis por dimensiones
        const dimensionStats = [...operationalTires, ...scrappedTires].reduce((acc, tire) => {
            const dim = tire.model?.dimensions || 'Sin dimensión';
            if (!acc[dim]) {
                acc[dim] = { operational: 0, scrapped: 0, totalHours: 0 };
            }

            const isOperational = operationalTires.includes(tire);
            if (isOperational) {
                acc[dim].operational++;
                acc[dim].totalHours += tire.lastInspection?.hours || 0;
            } else {
                acc[dim].scrapped++;
                acc[dim].totalHours += tire.procedures?.reduce((sum, p) => sum + p.tireHours, 0) || 0;
            }

            return acc;
        }, {} as Record<string, { operational: number; scrapped: number; totalHours: number }>);

        // Mejor dimensión (mayor rendimiento promedio)
        const bestDimension = Object.entries(dimensionStats)
            .map(([dim, stats]) => ({
                dimension: dim,
                avgHours: stats.totalHours / (stats.operational + stats.scrapped),
                total: stats.operational + stats.scrapped,
                operationalRate: (stats.operational / (stats.operational + stats.scrapped)) * 100
            }))
            .sort((a, b) => b.avgHours - a.avgHours)[0];

        // Análisis de motivos de baja
        const retirementReasons = scrappedTires.reduce((acc, tire) => {
            tire.procedures?.forEach(proc => {
                if (proc.retirementReason?.description) {
                    const reason = proc.retirementReason.description;
                    if (!acc[reason]) acc[reason] = 0;
                    acc[reason]++;
                }
            });
            return acc;
        }, {} as Record<string, number>);

        const mainRetirementReason = Object.entries(retirementReasons)
            .sort(([, a], [, b]) => b - a)[0];

        // Neumático con más horas
        const topTire = operationalTires
            .sort((a, b) => (b.lastInspection?.hours || 0) - (a.lastInspection?.hours || 0))[0];

        // Neumáticos en riesgo (más de 8000 horas o cerca del promedio de baja)
        const riskThreshold = Math.max(8000, avgHoursScrapped * 0.9);
        const tiresAtRisk = operationalTires.filter(tire =>
            (tire.lastInspection?.hours || 0) >= riskThreshold
        ).length;

        // Tasa de operatividad
        const operationalRate = totalTires > 0 ? (totalOperational / totalTires) * 100 : 0;

        // Proyección de reemplazo (basado en ritmo actual)
        const avgMonthlyRetirements = totalScrapped / 12; // Asumiendo datos del último año
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
            dimensionStats
        };
    }, [operationalTires, scrappedTires, loading]);

    if (loading) {
        return (
            <div className="text-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando KPIs...</p>
            </div>
        );
    }

    if (!kpis) return null;

    return (
        <div className="space-y-2">
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
                        <FaPercentage className="text-blue-500 text-3xl" />
                        <div>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{kpis.operationalRate.toFixed(1)}%</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Tasa de operatividad</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">


                {/* Promedio de Horas de Baja */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <FaClock className="text-gray-500 text-3xl" />
                        <div>
                            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{Math.round(kpis.avgHoursScrapped)} hrs</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Promedio horas de baja</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Referencia para reemplazo</p>
                        </div>
                    </div>
                </div>


                {kpis.mainRetirementReason && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 w-full p-4 rounded-lg shadow-md border border-rose-200 dark:border-rose-700">
                        <div className="flex items-start gap-3">
                            <FaChartLine className="text-rose-500 text-3xl mt-1" />
                            <div className="flex-1">
                                <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">📊 Principal Motivo de Baja</p>
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

            {/* Neumático Destacado */}
            {kpis.topTire && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-4 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center gap-4">
                        <FaAward className="text-yellow-500 text-4xl" />
                        <div className="flex-1">
                            <p className="text-xl font-semibold text-yellow-700 dark:text-yellow-300">🥇 Neumático con Mayor Rendimiento</p>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Resumen por Dimensiones */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <FaIndustry className="text-gray-500" />
                    Análisis por Dimensiones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(kpis.dimensionStats).slice(0, 6).map(([dimension, stats]) => {
                        const total = stats.operational + stats.scrapped;
                        const operationalRate = (stats.operational / total) * 100;
                        const avgHours = stats.totalHours / total;

                        return (
                            <div key={dimension} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{dimension}</p>
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">Operativos:</span>
                                        <span className="font-medium text-green-600">{stats.operational}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">Dados de baja:</span>
                                        <span className="font-medium text-red-600">{stats.scrapped}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">Operatividad:</span>
                                        <span className="font-medium text-blue-600">{operationalRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">Prom. horas:</span>
                                        <span className="font-medium text-purple-600">{Math.round(avgHours)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
