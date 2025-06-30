'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import Select from 'react-select';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

type MotivoEntry = {
    month: string;
    monthIndex: number;
    [motivo: string]: number | string; // para los motivos dinámicos y sus counts
};

const COLORS: Record<string, string> = {
    Corte: '#FF6B6B',
    Desgarro: '#4ECDC4',
    Desgaste: '#45B7D1',
    'Desgaste Anormal': '#96CEB4',
    Impacto: '#FFEAA7',
    Separación: '#DDA0DD',
    Otros: '#A0A0A0',
};

interface Procedure {
    startDate: string;
    tireHours: number;
    retirementReason: { description: string };
    vehicle?: {
        model?: {
            model?: string;
        };
    };
}

interface Tire {
    model: { dimensions: string };
    procedures: Procedure[];
}

export default function ScrappedReasonsChart() {
    const [data, setData] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [semester, setSemester] = useState<'1' | '2'>('1');
    const [dimension, setDimension] = useState<string | null>(null);
    const [equipmentModel, setEquipmentModel] = useState<string | null>(null);
    const [availableReasons, setAvailableReasons] = useState<string[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);
            const json = await res.json();
            setData(json);

            // Debug
            if (json.length > 0) {
                console.log('Estructura de datos:', json[0]);
                console.log('Primer objeto completo:', JSON.stringify(json[0], null, 2));
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    const processed = useMemo(() => {
        const counts: Record<string, Record<string, { hrs: number; count: number }>> = {};
        const foundReasons = new Set<string>();

        data.forEach((tire) => {
            if (dimension && tire.model?.dimensions !== dimension) return;

            if (equipmentModel) {
                const lastProcedureVehicleModel = tire.procedures?.at(-1)?.vehicle?.model?.model;
                if (lastProcedureVehicleModel !== equipmentModel) return;
            }

            tire.procedures.forEach((p) => {
                if (!p.startDate || !p.retirementReason?.description) return;

                const date = new Date(p.startDate);
                const yearMatch = date.getFullYear() === year;
                const semMatch = semester === '1' ? date.getMonth() < 6 : date.getMonth() >= 6;
                if (!yearMatch || !semMatch) return;

                const monthIndex = date.getMonth();
                const monthLabel = dayjs(p.startDate).format('MMMM');
                const desc = p.retirementReason.description.toLowerCase().trim();

                let group = 'Otros';
                if (desc === 'desgaste') {
                    group = 'Desgaste';
                } else if (desc === 'desgaste anormal') {
                    group = 'Desgaste Anormal';
                } else if (desc.includes('corte')) {
                    group = 'Corte';
                } else if (desc.includes('desgarro')) {
                    group = 'Desgarro';
                } else if (desc.includes('impacto')) {
                    group = 'Impacto';
                } else if (desc.includes('separación')) {
                    group = 'Separación';
                }

                foundReasons.add(group);

                const key = `${monthIndex}-${monthLabel}`;
                if (!counts[key]) counts[key] = {};
                if (!counts[key][group]) counts[key][group] = { hrs: 0, count: 0 };

                counts[key][group].hrs += p.tireHours || 0;
                counts[key][group].count++;
            });
        });

        const reasonsArr = Array.from(foundReasons).sort();
        setAvailableReasons(reasonsArr);
        if (selectedReasons.length === 0) setSelectedReasons(reasonsArr);

        return Object.entries(counts)
            .map(([key, motivos]) => {
                const [monthIndexStr, label] = key.split('-');
                const entry: MotivoEntry = {
                    month: label.charAt(0).toUpperCase() + label.slice(1),
                    monthIndex: parseInt(monthIndexStr),
                };
                Object.entries(motivos).forEach(([motivo, v]) => {
                    entry[motivo] = Math.round(v.hrs / v.count || 0);
                    entry[`${motivo}_count`] = v.count;
                });

                return entry;
            })
            .sort((a, b) => a.monthIndex - b.monthIndex);
    }, [data, year, semester, dimension, equipmentModel]);

    if (loading) {
        return <p className="text-center my-8">Cargando datos...</p>;
    }

    const availableYears = Array.from(new Set(data.flatMap(t =>
        t.procedures.map(p => new Date(p.startDate).getFullYear())
    ))).sort();

    const availableDimensions = Array.from(new Set(data.map(t => t.model?.dimensions).filter(Boolean)));

    const availableEquipmentModels = Array.from(new Set(
        data
            .map(t => t.procedures?.at(-1)?.vehicle?.model?.model)
            .filter(Boolean)
    )).sort();

    return (
        <section className="my-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    📊 Rendimiento Mensual por Motivo de Baja
                </h2>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* Año */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold">
                                📅 Año:
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {/* Semestre */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold">
                                📆 Semestre:
                            </label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value as '1' | '2')}
                                className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg"
                            >
                                <option value="1">1er Semestre</option>
                                <option value="2">2do Semestre</option>
                            </select>
                        </div>
                        {/* Dimensión */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold">
                                📏 Dimensión:
                            </label>
                            <select
                                value={dimension ?? ''}
                                onChange={(e) => setDimension(e.target.value || null)}
                                className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg"
                            >
                                <option value="">Todas</option>
                                {availableDimensions.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        {/* Modelo Equipo */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold">
                                🚛 Modelo Equipo:
                            </label>
                            <select
                                value={equipmentModel ?? ''}
                                onChange={(e) => setEquipmentModel(e.target.value || null)}
                                className="w-full p-2 text-sm border-2 border-gray-200 rounded-lg"
                            >
                                <option value="">Todos</option>
                                {availableEquipmentModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Motivos */}
                <div className="mt-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold">
                            🔍 Motivos de Baja:
                        </label>
                        <Select
                            isMulti
                            options={availableReasons.map(r => ({
                                value: r,
                                label: r,
                                color: COLORS[r]
                            }))}
                            value={selectedReasons.map(r => ({
                                value: r,
                                label: r,
                                color: COLORS[r]
                            }))}
                            onChange={(vals) => setSelectedReasons(vals.map(v => v.value))}
                            placeholder="Selecciona motivos..."
                            className="text-black"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={processed}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedReasons.map(motivo => (
                            <Bar
                                key={motivo}
                                dataKey={motivo}
                                stackId="a"
                                fill={COLORS[motivo] || '#999'}
                            >
                                <LabelList
                                    dataKey={`${motivo}_count`}
                                    position="top"
                                    formatter={(val: number) => (val > 0 ? `${val}` : '')}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
