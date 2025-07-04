"use client";

import React, { useEffect, useState, useMemo } from "react";
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

interface TireModel {
    dimensions: string;
}

interface Tire {
    id: number;
    initialTread: number;
    model: TireModel;
}

interface Inspection {
    id: number;
    tireId: number;
    inspectionDate: string;
    hours: number;
    internalTread: number;
    externalTread: number;
    tire: Tire;
}

interface DesgastePorTramo {
    tramo: string;
    tasa: number;
    mm: number;
}

function calcularTasaDesgaste(
    inspecciones: Inspection[],
    intervalo = 2,
    limiteInferior = 10
): DesgastePorTramo[] {
    const tasas: Record<string, { totalHoras: number; totalMm: number }> = {};
    const inspeccionesPorNeumatico: Record<number, Inspection[]> = {};

    inspecciones.forEach((inspeccion) => {
        if (!inspeccionesPorNeumatico[inspeccion.tireId]) {
            inspeccionesPorNeumatico[inspeccion.tireId] = [];
        }
        inspeccionesPorNeumatico[inspeccion.tireId].push(inspeccion);
    });

    Object.values(inspeccionesPorNeumatico).forEach((insps) => {
        if (insps.length < 2) return;
        const sorted = insps.sort(
            (a, b) => new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime()
        );

        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];

            const treadPrev = (prev.internalTread + prev.externalTread) / 2;
            const treadCurr = (curr.internalTread + curr.externalTread) / 2;
            const horas = curr.hours - prev.hours;
            const mmDesgastados = treadPrev - treadCurr;

            if (treadPrev <= treadCurr || horas <= 0 || mmDesgastados <= 0) continue;

            for (let t = treadPrev; t > treadCurr; t -= intervalo) {
                const upper = Math.floor(t / intervalo) * intervalo;
                const lower = upper - intervalo;
                if (lower < limiteInferior) continue;
                const key = `${upper}-${lower}`;
                if (!tasas[key]) tasas[key] = { totalHoras: 0, totalMm: 0 };
                tasas[key].totalHoras += horas;
                tasas[key].totalMm += mmDesgastados;
            }
        }
    });

    return Object.entries(tasas)
        .map(([tramo, valores]) => ({
            tramo,
            tasa: valores.totalHoras / valores.totalMm,
            mm: parseInt(tramo.split("-")[1]) + intervalo / 2,
        }))
        .filter((entry) => entry.mm >= 18)
        .sort((a, b) => b.mm - a.mm);
}

export default function TreadWearChart() {
    const client = useAxiosWithAuth()
    const { user } = useAuth();
    const [inspecciones, setInspecciones] = useState<Inspection[]>([]);

    const [dimensionSeleccionada, setDimensionSeleccionada] = useState<string | null>("46/90R57");

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchInspecciones = async () => {
            try {
                const res = await client.get("http://localhost:3002/inspections");
                setInspecciones(res.data);
            } catch (err) {
                console.error("Error cargando inspecciones", err);
            }
        };
        fetchInspecciones();
    }, [user]);

    const dimensiones = useMemo(() => {
        const unique = new Set(inspecciones.map((i) => i.tire.model.dimensions));
        return Array.from(unique).sort();
    }, [inspecciones]);

    const inspeccionesFiltradas = useMemo(() => {
        return dimensionSeleccionada
            ? inspecciones.filter((i) => i.tire.model.dimensions === dimensionSeleccionada)
            : inspecciones;
    }, [inspecciones, dimensionSeleccionada]);

    const data = useMemo(() => calcularTasaDesgaste(inspeccionesFiltradas), [inspeccionesFiltradas]);

    function getGradientColorByRemanente(mm: number): string {
        const min = 18;
        const max = 97;
        const factor = Math.min(1, Math.max(0, (mm - min) / (max - min)));
        return interpolateColor('#92e5d2', '#F5B7B1', 1 - factor);
    }

    return (
        <div className="bg-white border dark:bg-gray-900 p-2 lg:p-4 rounded-lg shadow-md">
            <div className="flex flex-col  items-center justify-between ">
                <h2 className="text-2xl font-bold text-center bg-black  bg-clip-text text-transparent">
                    Tasa de desgaste promedio por tramo de goma (hrs/mm)
                </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                Análisis del rendimiento de desgaste a lo largo del ciclo de vida del neumático
            </p>
            <div className="flex flex-col items-start space-y-1">
                <label className="block text-xs font-semibold">
                    Año:
                </label>

                <Select
                    options={dimensiones.map((d) => ({ value: d, label: d }))}
                    value={dimensionSeleccionada ? { value: dimensionSeleccionada, label: dimensionSeleccionada } : null}
                    onChange={(opt) => setDimensionSeleccionada(opt?.value || null)}
                    isClearable
                    placeholder="Todas las dimensiones"
                    className="w-full sm:w-52 text-black"
                />
            </div>
            <ResponsiveContainer className={"py-2"} height={300}>
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mm" label={{ value: "Remanente (mm)", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Hrs/mm", angle: -90, position: "insideLeft" }} domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]} />

                    <Tooltip formatter={(val) => `${Math.round(val as number)} hrs/mm`} />
                    <Bar dataKey="tasa">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getGradientColorByRemanente(entry.mm)} />
                        ))}
                        <LabelList
                            dataKey="tasa"
                            position="top"
                            className="max-lg:hidden"
                            formatter={(val: number) => Math.round(val)}
                            style={{ fill: 'black', fontWeight: 600 }}
                        />
                    </Bar>
                    <Line type="monotone" className="max-lg:hidden" dataKey="tasa" stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} />
                </ComposedChart>
            </ResponsiveContainer>
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