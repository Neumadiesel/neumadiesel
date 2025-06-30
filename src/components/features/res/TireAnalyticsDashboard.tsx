'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { FaChartLine, FaChartPie, FaArrowUp } from 'react-icons/fa';
import { useAuthFetch } from '@/utils/AuthFetch';
import { useAuth } from '@/contexts/AuthContext';

interface Tire {
    id?: string;
    model: { dimensions: string };
    lastInspection: { hours: number; kilometrage: number; date?: string };
    usedHours: number;
    procedures?: Array<{
        startDate: string;
        tireHours: number;
        retirementReason?: { description: string };
    }>;
    createdAt?: string;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function TireAnalyticsDashboard() {
    const authFetch = useAuthFetch();
    const [operationalTires, setOperationalTires] = useState<Tire[]>([]);
    const [scrappedTires, setScrappedTires] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const [opRes, scrRes] = await Promise.all([
                authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`),
                authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`)
            ]);

            const [opData, scrData] = await Promise.all([
                opRes.json(),
                scrRes.json()
            ]);

            setOperationalTires(opData);
            setScrappedTires(scrData);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const analytics = useMemo(() => {
        if (loading) return null;

        // Distribución por horas de vida
        type HoursDistributionItem = {
            range: string;
            operational: number;
            scrapped: number;
            total: number;
        };
        const hoursDistribution: HoursDistributionItem[] = [];
        const ranges = [
            { min: 0, max: 2000, label: '0-2K hrs' },
            { min: 2000, max: 4000, label: '2K-4K hrs' },
            { min: 4000, max: 6000, label: '4K-6K hrs' },
            { min: 6000, max: 8000, label: '6K-8K hrs' },
            { min: 8000, max: 10000, label: '8K-10K hrs' },
            { min: 10000, max: Infinity, label: '10K+ hrs' }
        ];

        ranges.forEach(range => {
            const operational = operationalTires.filter(tire =>
                tire.lastInspection?.hours >= range.min && tire.lastInspection?.hours < range.max
            ).length;

            const scrapped = scrappedTires.filter(tire => {
                const totalHours = tire.procedures?.reduce((sum, proc) => sum + proc.tireHours, 0) || 0;
                return totalHours >= range.min && totalHours < range.max;
            }).length;

            hoursDistribution.push({
                range: range.label,
                operational,
                scrapped,
                total: operational + scrapped
            });
        });

        // Distribución por dimensiones (para gráfico de torta)
        const dimensionDistribution = [...operationalTires, ...scrappedTires]
            .reduce((acc, tire) => {
                const dim = tire.model?.dimensions || 'Sin dimensión';
                acc[dim] = (acc[dim] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const pieData = Object.entries(dimensionDistribution)
            .map(([dimension, count]) => ({ dimension, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 dimensiones

        // Tendencia de rendimiento por dimensión
        const performanceTrend = Object.entries(
            [...operationalTires, ...scrappedTires].reduce((acc, tire) => {
                const dim = tire.model?.dimensions || 'Sin dimensión';
                if (!acc[dim]) {
                    acc[dim] = { dimension: dim, totalHours: 0, count: 0, operational: 0, scrapped: 0 };
                }

                const isOperational = operationalTires.includes(tire);
                if (isOperational) {
                    acc[dim].totalHours += tire.lastInspection?.hours || 0;
                    acc[dim].operational++;
                } else {
                    acc[dim].totalHours += tire.procedures?.reduce((sum, proc) => sum + proc.tireHours, 0) || 0;
                    acc[dim].scrapped++;
                }
                acc[dim].count++;
                return acc;
            }, {} as Record<string, {
                dimension: string;
                totalHours: number;
                count: number;
                operational: number;
                scrapped: number;
            }>)
        )
            .map(([, data]) => ({
                ...data,
                avgHours: Math.round(data.totalHours / data.count),
                operationalRate: Math.round((data.operational / data.count) * 100)
            }))
            .sort((a, b) => b.avgHours - a.avgHours)
            .slice(0, 10);

        return {
            hoursDistribution,
            pieData,
            performanceTrend
        };
    }, [operationalTires, scrappedTires, loading]);

    if (loading) {
        return (
            <div className="text-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando análisis...</p>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-6">
            {/* Distribución por Horas de Vida */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <FaChartLine className="text-blue-500 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Distribución por Horas de Vida
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.hoursDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="range"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value, name) => [value, name === 'operational' ? 'Operativos' : 'Dados de baja']}
                            labelStyle={{ color: '#374151' }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="operational"
                            stackId="1"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.7}
                            name="Operativos"
                        />
                        <Area
                            type="monotone"
                            dataKey="scrapped"
                            stackId="1"
                            stroke="#EF4444"
                            fill="#EF4444"
                            fillOpacity={0.7}
                            name="Dados de baja"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución por Dimensiones */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                        <FaChartPie className="text-purple-500 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Distribución por Dimensiones
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics.pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="count"
                                label={({ dimension, percent }) =>
                                    `${dimension}: ${(percent * 100).toFixed(1)}%`
                                }
                                labelLine={false}
                            >
                                {analytics.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Rendimiento por Dimensión */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                        <FaArrowUp className="text-green-500 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Rendimiento por Dimensión
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.performanceTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="dimension"
                                tick={{ fontSize: 10 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis yAxisId="hours" orientation="left" tick={{ fontSize: 12 }} />
                            <YAxis yAxisId="rate" orientation="right" tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'avgHours' ? `${value} hrs` : `${value}%`,
                                    name === 'avgHours' ? 'Promedio de horas' : 'Tasa operatividad'
                                ]}
                                labelStyle={{ color: '#374151' }}
                            />
                            <Legend />
                            <Line
                                yAxisId="hours"
                                type="monotone"
                                dataKey="avgHours"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                name="Promedio de horas"
                            />
                            <Line
                                yAxisId="rate"
                                type="monotone"
                                dataKey="operationalRate"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                name="Tasa operatividad (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tabla de Top Dimensiones */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Top Dimensiones por Rendimiento
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Dimensión
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Operativos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Dados de baja
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Promedio horas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Operatividad
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {analytics.performanceTrend.slice(0, 5).map((item, index) => (
                                <tr key={item.dimension} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {item.dimension}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {item.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                        {item.operational}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                                        {item.scrapped}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                                        {item.avgHours.toLocaleString()} hrs
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400">
                                        {item.operationalRate}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
