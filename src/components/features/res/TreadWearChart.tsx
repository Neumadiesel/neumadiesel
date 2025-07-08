"use client";

import React, { useEffect, useState } from "react";
import {
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    ComposedChart,
    Cell,
} from "recharts";
import Select from "react-select";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuth } from "@/contexts/AuthContext";
import { toPng } from "html-to-image";

interface DesgastePorTramo {
    tramo: string;
    tasa: number;
    mm: number;
}

export default function TreadWearChart() {
    const client = useAxiosWithAuth();
    const { user } = useAuth();

    const [dimensionSeleccionada, setDimensionSeleccionada] = useState<string | null>("46/90R57");
    const [dimensiones] = useState<string[]>([]);
    const [data, setData] = useState<DesgastePorTramo[]>([]);

    // Cargar dimensiones únicas desde el backend


    // Cargar tasa de desgaste desde backend
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/wear-rate`, {
                    params: { dimension: dimensionSeleccionada },
                });
                setData(res.data);
            } catch (err) {
                console.error("Error al cargar tasa de desgaste", err);
            }
        };

        fetchData();
    }, [user, dimensionSeleccionada]);

    // Función para colorear según remanente (mm)
    function getGradientColorByRemanente(mm: number): string {
        const min = 18;
        const max = 97;
        const factor = Math.min(1, Math.max(0, (mm - min) / (max - min)));
        return interpolateColor('#92e5d2', '#F5B7B1', 1 - factor);
    }
    const downloadChartAsImage = async () => {
        const node = document.getElementById('grafico-desgaste');
        if (!node) return;

        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `grafico_tasa_desgaste.png`;
        link.click();
    };

    return (
        <div className="bg-white border dark:bg-neutral-800 dark:border-neutral-700 p-2 lg:p-4 rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-between">
                <h2 className="text-2xl font-bold text-center bg-black dark:text-white bg-clip-text text-transparent">
                    Tasa de desgaste promedio por tramo de goma (hrs/mm)
                </h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm text-center mb-2">
                Análisis del rendimiento de desgaste a lo largo del ciclo de vida del neumático
            </p>
            <div className="w-full flex justify-between items-center mb-4">

                <div className="flex flex-col items-start space-y-1">
                    <label className="block text-xs font-semibold">Dimensión:</label>
                    <Select
                        options={dimensiones.map((d) => ({ value: d, label: d }))}
                        value={dimensionSeleccionada ? { value: dimensionSeleccionada, label: dimensionSeleccionada } : null}
                        onChange={(opt) => setDimensionSeleccionada(opt?.value || null)}
                        isClearable
                        placeholder="Todas las dimensiones"
                        className="w-full sm:w-52 text-black"
                    />
                </div>
                <button
                    onClick={downloadChartAsImage}
                    className="px-4 py-2 bg-blue-600 font-semibold text-white rounded mt-4"
                >
                    Exportar como Imagen
                </button>
            </div>
            <div className="bg-white dark:bg-neutral-800 " id={"grafico-desgaste"} >
                <ResponsiveContainer height={300} >
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="mm"
                            label={{ value: "Remanente (mm)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis
                            label={{
                                value: "Hrs/mm",
                                angle: -90,
                                position: "insideLeft",
                            }}
                            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
                        />
                        <Tooltip formatter={(val) => `${Math.round(val as number)} hrs/mm`} />
                        <Bar dataKey="tasa">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getGradientColorByRemanente(entry.mm)} />
                            ))}
                            <LabelList
                                dataKey="tasa"
                                position="top"
                                className="max-lg:hidden "
                                formatter={(val: number) => Math.round(val)}
                                style={{ fill: "#f1760f", fontWeight: 600 }}
                            />
                        </Bar>
                        <Line
                            type="monotone"
                            className="max-lg:hidden"
                            dataKey="tasa"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function interpolateColor(hex1: string, hex2: string, factor: number): string {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
