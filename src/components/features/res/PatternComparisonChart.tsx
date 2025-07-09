"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";

// Tipos
interface Tire {
    code: string;
    initialTread: number;
    model: {
        pattern: string;
        dimensions: string;
    };
    lastInspection: {
        internalTread: number;
        externalTread: number;
        hours: number;
    };
}

interface PatternStats {
    pattern: string;
    cantidad: number;
    horasPromedio: number;
    desgastePromedio: number;
    horasMin: number;
    horasMax: number;
    desgasteMin: number;
    desgasteMax: number;
    histogram: number[]; // bins de frecuencia de desgaste
    dimension: string;
}

const bins = [0, 20, 40, 60, 80, 100];

export default function PatternComparisonVisual() {
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const [tires, setTires] = useState<Tire[]>([]);
    const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
    const [selectedPattern1, setSelectedPattern1] = useState<string | null>(null);
    const [selectedPattern2, setSelectedPattern2] = useState<string | null>(null);
    const [dimensionOptions, setDimensionOptions] = useState<string[]>([]);
    const [patternOptions, setPatternOptions] = useState<string[]>([]);
    const [stats, setStats] = useState<PatternStats[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTires = async () => {
        setLoading(true);
        try {
            const res = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`);
            if (!res) throw new Error("No se pudo obtener la respuesta del servidor");
            const data = await res.json();
            setTires(data);

            const dimensions = Array.from(new Set(data.map((t: Tire) => t.model.dimensions)))
                .filter((d): d is string => typeof d === "string");
            setDimensionOptions(dimensions);
        } catch (err) {
            console.error("Error cargando neumáticos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchTires();
    }, [user]);

    useEffect(() => {
        if (!selectedDimension) {
            setPatternOptions([]);
            return;
        }
        const filteredTires = tires.filter(t => t.model.dimensions === selectedDimension);
        const patterns = Array.from(new Set(filteredTires.map(t => t.model.pattern?.split(" ")[0])));
        setPatternOptions(patterns);
    }, [selectedDimension, tires]);

    useEffect(() => {
        if (!selectedDimension || !selectedPattern1 || !selectedPattern2) {
            setStats([]);
            return;
        }

        const selected = [selectedPattern1, selectedPattern2];

        const result: PatternStats[] = selected.map((pattern) => {
            const matching = tires.filter(
                t => t.model.dimensions === selectedDimension && t.model.pattern?.startsWith(pattern)
            );

            const horasList = matching.map(t => t.lastInspection.hours);
            const desgasteList = matching.map(t => {
                const finalTread = (t.lastInspection.internalTread + t.lastInspection.externalTread) / 2;
                return t.initialTread ? ((t.initialTread - finalTread) / t.initialTread) * 100 : 0;
            });

            const histogram = Array(bins.length - 1).fill(0);
            desgasteList.forEach(val => {
                for (let i = 0; i < bins.length - 1; i++) {
                    if (val >= bins[i] && val < bins[i + 1]) histogram[i]++;
                }
            });

            const safeAvg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

            return {
                pattern,
                cantidad: matching.length,
                horasPromedio: Math.round(safeAvg(horasList)),
                desgastePromedio: Math.round(safeAvg(desgasteList) * 100) / 100,
                horasMin: Math.min(...horasList),
                horasMax: Math.max(...horasList),
                desgasteMin: Math.min(...desgasteList),
                desgasteMax: Math.max(...desgasteList),
                histogram,
                dimension: selectedDimension,
            };
        });

        setStats(result);
    }, [selectedDimension, selectedPattern1, selectedPattern2, tires]);

    const barData = stats.map(s => ({
        pattern: s.pattern,
        desgastePromedio: s.desgastePromedio,
        horasPromedio: s.horasPromedio,
    }));

    const histogramData = bins.slice(0, -1).map((start, idx) => {
        const end = bins[idx + 1];
        const binLabel = `${start}-${end}%`;
        const row: { bin: string;[key: string]: number | string } = { bin: binLabel };
        stats.forEach(s => {
            row[s.pattern] = s.histogram[idx];
        });
        return row;
    });

    return (
        <section className="p-6 bg-white dark:bg-neutral-800 border rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Comparativa Visual de Patrones</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="text-sm font-medium dark:text-white block mb-1">Filtrar por dimensión:</label>
                    <Select
                        options={dimensionOptions.map(d => ({ value: d, label: d }))}
                        value={selectedDimension ? { value: selectedDimension, label: selectedDimension } : null}
                        onChange={(opt) => setSelectedDimension(opt?.value || null)}
                        placeholder="Selecciona una dimensión..."
                        className="text-black"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium dark:text-white block mb-1">Patrón 1:</label>
                    <Select
                        options={patternOptions.map(p => ({ value: p, label: p }))}
                        value={selectedPattern1 ? { value: selectedPattern1, label: selectedPattern1 } : null}
                        onChange={(opt) => setSelectedPattern1(opt?.value || null)}
                        placeholder="Selecciona patrón 1..."
                        className="text-black"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium dark:text-white block mb-1">Patrón 2:</label>
                    <Select
                        options={patternOptions.map(p => ({ value: p, label: p }))}
                        value={selectedPattern2 ? { value: selectedPattern2, label: selectedPattern2 } : null}
                        onChange={(opt) => setSelectedPattern2(opt?.value || null)}
                        placeholder="Selecciona patrón 2..."
                        className="text-black"
                    />
                </div>
            </div>

            {loading ? <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p> : null}

            {stats.length > 0 && (
                <div className="space-y-12">
                    {/* Tabla básica */}
                    <div>
                        <h3 className="font-semibold mb-2 dark:text-white">Resumen Numérico</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left border">
                                <thead className="bg-gray-200 dark:bg-neutral-700 text-black dark:text-white">
                                    <tr>
                                        <th className="px-4 py-2">Patrón</th>
                                        <th className="px-4 py-2">Dimensión</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Horas Prom.</th>
                                        <th className="px-4 py-2">Horas Min</th>
                                        <th className="px-4 py-2">Horas Max</th>
                                        <th className="px-4 py-2">Desgaste Prom.</th>
                                        <th className="px-4 py-2">Desgaste Min</th>
                                        <th className="px-4 py-2">Desgaste Max</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((s) => (
                                        <tr key={s.pattern} className="border-t dark:border-neutral-600">
                                            <td className="px-4 py-2">{s.pattern}</td>
                                            <td className="px-4 py-2">{s.dimension}</td>
                                            <td className="px-4 py-2">{s.cantidad}</td>
                                            <td className="px-4 py-2">{s.horasPromedio}</td>
                                            <td className="px-4 py-2">{s.horasMin}</td>
                                            <td className="px-4 py-2">{s.horasMax}</td>
                                            <td className="px-4 py-2">{s.desgastePromedio}%</td>
                                            <td className="px-4 py-2">{s.desgasteMin}%</td>
                                            <td className="px-4 py-2">{s.desgasteMax}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gráfico de barras */}
                    <div>
                        <h3 className="font-semibold mb-2 dark:text-white">Promedios por Patrón</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="pattern" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="horasPromedio" fill="#8884d8">
                                    <LabelList dataKey="horasPromedio" position="top" />
                                </Bar>
                                <Bar dataKey="desgastePromedio" fill="#82ca9d">
                                    <LabelList dataKey="desgastePromedio" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Histograma */}
                    <div>
                        <h3 className="font-semibold mb-2 dark:text-white">Distribución de Desgaste</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={histogramData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="bin" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                {stats.map((s, idx) => (
                                    <Bar key={s.pattern} dataKey={s.pattern} fill={idx === 0 ? "#8884d8" : "#82ca9d"} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </section>
    );
}
