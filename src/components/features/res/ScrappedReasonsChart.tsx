'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    BarChart,
    Bar
} from 'recharts';
import Select from 'react-select';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useAuthFetch } from '@/utils/AuthFetch';
import { useAuth } from '@/contexts/AuthContext';
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
    const authFetch = useAuthFetch();
    const { user } = useAuth();
    const [data, setData] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [semester, setSemester] = useState<'1' | '2'>('1');
    const [dimension, setDimension] = useState<string | null>(null);
    const [equipmentModel, setEquipmentModel] = useState<string | null>(null);
    const [availableReasons, setAvailableReasons] = useState<string[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const fetchData = async () => {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);
        const json = await res.json();
        setData(json);

        // Debug
        if (json.length > 0) {
            console.log('Estructura de datos:', json[0]);
            console.log('Primer objeto completo:', JSON.stringify(json[0], null, 2));
        }

        setLoading(false);
    };


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

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

                reasonsArr.forEach(motivo => {
                    if (motivos[motivo]) {
                        entry[motivo] = Math.round(motivos[motivo].hrs / motivos[motivo].count || 0);
                        entry[`${motivo}_count`] = motivos[motivo].count;
                    } else {
                        entry[motivo] = 0; // 👈 evita líneas cortadas
                        entry[`${motivo}_count`] = 0;
                    }
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
        <section className=" bg-white dark:bg-gray-800 border  rounded-md p-4 shadow-sm">
            <div className="">
                <h2 className="text-2xl font-bold mb-2 text-center bg-black  bg-clip-text text-transparent">
                    Rendimiento Mensual por Motivo de Baja
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                    Aquí puedes ver el rendimiento mensual de los neumáticos dados de baja, desglosado por motivo de baja.
                </p>
                <div className="bg-white dark:bg-gray-800 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {/* Año */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="block text-xs font-semibold">
                                Año:
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full p-2 text-sm border border-gray-200 rounded-sm"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {/* Semestre */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="block text-xs font-semibold">
                                Semestre:
                            </label>
                            <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value as '1' | '2')}
                                className="w-full p-2 text-sm border border-gray-200 rounded-sm"
                            >
                                <option value="1">1er Semestre</option>
                                <option value="2">2do Semestre</option>
                            </select>
                        </div>
                        {/* Dimensión */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="block text-xs font-semibold">
                                Dimensión:
                            </label>
                            <select
                                value={dimension ?? ''}
                                onChange={(e) => setDimension(e.target.value || null)}
                                className="w-full p-2 text-sm border border-gray-200 rounded-sm"
                            >
                                <option value="">Todas</option>
                                {availableDimensions.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        {/* Modelo Equipo */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="block text-xs font-semibold">
                                Modelo Equipo:
                            </label>
                            <select
                                value={equipmentModel ?? ''}
                                onChange={(e) => setEquipmentModel(e.target.value || null)}
                                className="w-full p-2 text-sm border border-gray-200 rounded-sm"
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
                        <label className="block text-xs text-start font-semibold">
                            Motivos de Baja:
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

            <div className="bg-white dark:bg-gray-800 p-3 m-2">
                <ResponsiveContainer width="100%" height={350} className="p-2">
                    <BarChart data={processed}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis>
                            <Label
                                value="Horas"
                                angle={-90}
                                position="insideLeft"
                                dx={-10}
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        {selectedReasons.map(motivo => (
                            <Bar
                                key={motivo}
                                dataKey={motivo}
                                fill={COLORS[motivo] || '#999'}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>


            </div>
        </section>
    );
}
