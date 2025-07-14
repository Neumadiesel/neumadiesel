'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { toPng } from 'html-to-image';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    BarChart,
    Bar,
    LabelList
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
    const { user, siteId } = useAuth();
    const [data, setData] = useState<Tire[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [semester, setSemester] = useState<'1' | '2'>('1');
    const [dimension, setDimension] = useState<string | null>(null);
    const [equipmentModel, setEquipmentModel] = useState<string | null>(null);
    const [availableReasons, setAvailableReasons] = useState<string[]>([]);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    const fetchData = async () => {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/${siteId}`);
        if (!res) {
            console.warn("No se pudo obtener la respuesta (res es null).");
            return;
        }
        const json = await res.json();
        setData(json);

    };


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, siteId]);

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


    const availableYears = Array.from(new Set(data.flatMap(t =>
        t.procedures.map(p => new Date(p.startDate).getFullYear())
    ))).sort();

    const availableDimensions = Array.from(new Set(data.map(t => t.model?.dimensions).filter(Boolean)));

    const availableEquipmentModels = Array.from(new Set(
        data
            .map(t => t.procedures?.at(-1)?.vehicle?.model?.model)
            .filter(Boolean)
    )).sort();

    const downloadChartAsImage = async () => {
        const node = document.getElementById('grafico-bajas');
        if (!node) return;

        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `grafico_baja_mensual_${year}_S${semester}.png`;
        link.click();
    };

    return (
        <section className=" bg-white dark:bg-neutral-800 border dark:border-neutral-700  rounded-md p-2 lg:p-4 shadow-sm">
            <div className="">
                <h2 className="text-2xl font-bold mb-2 text-center bg-black dark:text-white bg-clip-text text-transparent">
                    Rendimiento Mensual por Motivo de Baja
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 text-center">
                    Aquí puedes ver el rendimiento mensual de los neumáticos dados de baja, desglosado por motivo de baja.
                </p>
                <div className="bg-white dark:bg-neutral-800 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {/* Año */}
                        <div className="flex flex-col items-start space-y-1">
                            <label className="block text-xs font-semibold">
                                Año:
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full p-2 text-sm border border-neutral-200 rounded-sm"
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
                                className="w-full p-2 text-sm border border-neutral-200 rounded-sm"
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
                                className="w-full p-2 text-sm border border-neutral-200 rounded-sm"
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
                                className="w-full p-2 text-sm border border-neutral-200 rounded-sm"
                            >
                                <option value="">Todos</option>
                                {availableEquipmentModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={downloadChartAsImage}
                            className="px-4 py-2 bg-blue-600 font-semibold text-white rounded mt-4"
                        >
                            Exportar como Imagen
                        </button>
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

            <main className="bg-white dark:bg-neutral-800 p-3 m-2" id="grafico-bajas">
                <div>
                    <h3 className="text-lg font-semibold text-center dark:text-white mb-2">
                        Rendimiento Mensual por Motivo de Baja
                    </h3>
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
                                >
                                    <LabelList dataKey={motivo} position="top" fill="#f5b041" fontWeight={"bold"} z={10} />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>


                </div>
                <div className="bg-white dark:bg-neutral-800 p-3 m-2 mt-8">
                    <h3 className="text-lg font-semibold text-center dark:text-white mb-2">
                        Cantidad de Neumáticos Dados de Baja por Motivo
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={processed}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis>
                                <Label
                                    value="Cantidad"
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
                                    key={`${motivo}_count`}
                                    dataKey={`${motivo}_count`}
                                    fill={COLORS[motivo] || '#000'}
                                    activeBar={false}
                                    name={motivo}
                                >
                                    <LabelList dataKey={`${motivo}_count`} position="top" style={{
                                    }} fill="#f5b041" fontWeight={"bold"} />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </section>
    );
}
