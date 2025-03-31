"use client";

import React, { useRef } from "react";
import { BarChart, BarChartProps } from "@mui/x-charts/BarChart";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const translations: Record<string, string> = {
    cut: "Corte",
    wear: "Desgaste",
    abnormalWear: "Desgaste Anormal",
    separation: "Separación",
};

const colors: Record<keyof TireScrapEntry, string> = {
    year: "", // No se usa color para el año
    cut: "#1E90FF", // Amarillo
    wear: "#FFBF08", // Azul
    abnormalWear: "#71abf8", // Rojo Naranja
    separation: "#fad876", // Verde Lima
};

type TireScrapEntry = {
    year: string;
    cut: number;
    wear: number;
    abnormalWear: number;
    separation: number;
};

const tireScrapData: TireScrapEntry[] = [
    { year: "2020", cut: 50, wear: 120, abnormalWear: 30, separation: 20 },
    { year: "2021", cut: 60, wear: 130, abnormalWear: 40, separation: 25 },
    { year: "2022", cut: 70, wear: 140, abnormalWear: 50, separation: 30 },
    { year: "2023", cut: 80, wear: 150, abnormalWear: 60, separation: 35 },
];

type SeriesItem = {
    dataKey: keyof Omit<TireScrapEntry, "year">;
    stack: string;
};

function addLabels(series: SeriesItem[]): BarChartProps["series"] {
    return series.map(s => ({
        ...s,
        label: translations[s.dataKey] || s.dataKey,
        color: colors[s.dataKey],
        valueFormatter: (v: number | null) => (v ? `${v.toLocaleString()} neumáticos` : "-"),
    }));
}

function exportToImage(chartRef: React.RefObject<HTMLDivElement | null>) {
    if (chartRef.current) {
        html2canvas(chartRef.current).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "Neumaticos_Dados_de_Baja.png";
            link.click();
        });
    }
}

export default function StackBars() {
    const chartRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col justify-center items-center">
            <h2>Neumáticos Dados de Baja</h2>

            <div ref={chartRef}>
                <BarChart
                    dataset={tireScrapData}
                    series={addLabels([
                        { dataKey: "cut", stack: "scrap" },
                        { dataKey: "wear", stack: "scrap" },
                        { dataKey: "abnormalWear", stack: "scrap" },
                        { dataKey: "separation", stack: "scrap" },
                    ])}
                    xAxis={[{ scaleType: "band", dataKey: "year" }]}
                    slotProps={{ legend: { hidden: false } }}
                    width={500}
                    height={330}
                />
            </div>
            <button onClick={() => exportToImage(chartRef)} className="bg-amber-300 flex justify-between items-center p-2 rounded-sm mx-auto font-semibold">
                Descargar grafico
                <FaDownload style={{ marginLeft: "5px" }} />
            </button>
        </div>
    );
}
