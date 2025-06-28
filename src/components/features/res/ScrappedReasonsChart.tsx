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
    const [availableReasons, setAvailableReasons] = useState<string[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);
            const json = await res.json();
            setData(json);
            setLoading(false);
        };
        fetchData();
    }, []);

    const processed = useMemo(() => {
        const counts: Record<string, Record<string, { hrs: number; count: number }>> = {};
        const foundReasons = new Set<string>();

        data.forEach((tire) => {
            if (dimension && tire.model?.dimensions !== dimension) return;

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
                // Primero verificar coincidencias exactas
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
                const entry: any = {
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
    }, [data, year, semester, dimension]);

    if (loading) {
        return <p className="text-center my-8">Cargando datos...</p>;
    }

    const availableYears = Array.from(new Set(data.flatMap(t =>
        t.procedures.map(p => new Date(p.startDate).getFullYear())
    ))).sort();

    const availableDimensions = Array.from(new Set(data.map(t => t.model?.dimensions).filter(Boolean)));

    return (
        <section className="my-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    📊 Rendimiento Mensual por Motivo de Baja
                </h2>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📅 Año:
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📆 Semestre:
                            </label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value as '1' | '2')}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                                <option value="1">1er Semestre (Ene-Jun)</option>
                                <option value="2">2do Semestre (Jul-Dic)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                📏 Dimensión:
                            </label>
                            <select
                                value={dimension ?? ''}
                                onChange={(e) => setDimension(e.target.value || null)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                                <option value="">Todas las dimensiones</option>
                                {availableDimensions.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderWidth: '2px',
                                        borderColor: '#e5e7eb',
                                        borderRadius: '8px',
                                        padding: '4px',
                                        '&:hover': {
                                            borderColor: '#3b82f6'
                                        }
                                    }),
                                    multiValue: (base, { data }) => ({
                                        ...base,
                                        backgroundColor: data.color + '20',
                                        borderRadius: '6px'
                                    }),
                                    multiValueLabel: (base, { data }) => ({
                                        ...base,
                                        color: data.color,
                                        fontWeight: '600'
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={processed} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: '#666' }}
                                tickLine={{ stroke: '#ddd' }}
                            />
                            <YAxis
                                label={{
                                    value: "⏱️ Horas promedio",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { textAnchor: 'middle', fill: '#666', fontSize: '14px' }
                                }}
                                tick={{ fontSize: 12, fill: '#666' }}
                                tickLine={{ stroke: '#ddd' }}
                            />
                            <Tooltip
                                formatter={(value, name, props) => {
                                    const count = props.payload[`${name}_count`];
                                    return [
                                        `${value} hrs promedio (${count} neumáticos)`,
                                        `🔧 ${name}`
                                    ];
                                }}
                                labelFormatter={(label) => `📅 ${label}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    fontSize: '13px'
                                }}
                                labelStyle={{
                                    color: '#374151',
                                    fontWeight: 'bold',
                                    marginBottom: '4px'
                                }}
                            />
                            <Legend
                                wrapperStyle={{
                                    fontSize: '12px',
                                    paddingTop: '15px',
                                    fontWeight: '500'
                                }}
                                iconType="circle"
                            />
                            {selectedReasons.map(motivo => (
                                <Bar
                                    key={motivo}
                                    dataKey={motivo}
                                    stackId="a"
                                    fill={COLORS[motivo] || '#94A3B8'}
                                    radius={[6, 6, 0, 0]}
                                    stroke="#fff"
                                    strokeWidth={1}
                                >
                                    <LabelList
                                        dataKey={`${motivo}_count`}
                                        position="top"
                                        formatter={(val: number) => (val > 0 ? `${val}` : '')}
                                        fill="#374151"
                                        fontSize={11}
                                        fontWeight="600"
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}