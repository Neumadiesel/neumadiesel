"use client";

import React, { useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

const labels = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

const datasets = [
    {
        label: "Budget",
        data: [34, 36, 28, 16, 14, 10, 14, 12, 14, 14, 16, 16],
        color: "#0871FF",
    },
    {
        label: "Consumo",
        data: [34, 43, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        color: "#FFBF08",
    },
];

function exportToImage(chartRef: React.RefObject<HTMLDivElement | null>) {
    if (chartRef.current) {
        html2canvas(chartRef.current).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "Neumaticos_Utilizados.png";
            link.click();
        });
    }
}

export default function BarChartComponent() {
    const chartRef = useRef<HTMLDivElement>(null);

    return (
        <div className=" flex flex-col justify-center items-center">
            <h2>Neumáticos Utilizados</h2>
            <div ref={chartRef}>
                <BarChart
                    xAxis={[
                        {
                            scaleType: "band",
                            data: labels,
                            labelStyle: { fill: "white" }, // Color de labels en eje X
                        },
                    ]}
                    yAxis={[
                        {
                            labelStyle: { fill: "white" }, // Color de labels en eje Y
                        },
                    ]}
                    series={datasets.map(ds => ({ data: ds.data, label: ds.label, color: ds.color }))}
                    width={450}
                    height={300}
                    sx={{
                        "& .MuiChartsAxis-tickLabel": { fill: "white" }, // Aplica color blanco a todos los labels
                        "& .MuiChartsAxis-line, & .MuiChartsGrid-root": { stroke: "white" },

                    }}
                />
            </div>
            <button onClick={() => exportToImage(chartRef)} className="bg-amber-300 text-black flex justify-between p-2 items-center rounded-md font-semibold">
                Descargar gráfico
                <FaDownload className="ml-2" />

            </button>
        </div>
    );
}
