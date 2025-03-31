"use client";
import React from "react";
import html2canvas from "html2canvas";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { FaDownload } from "react-icons/fa";

function exportToImage(chartRef: React.RefObject<HTMLDivElement | null>) {
    if (chartRef.current) {
        html2canvas(chartRef.current).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "Pie_Chart.png";
            link.click();
        });
    }
}
export default function PieArcLabel() {
    const chartRef = React.useRef(null);

    return (
        <div className="w-[100%] h-[100%] mr-14 flex flex-col justify-between items-center">
            <h2 className="font-semibold text-lg">Motivos de Baja</h2>
            <div ref={chartRef}>

                <PieChart
                    series={[{
                        arcLabel: (item) => `${item.value}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: "60%",
                        data: [
                            { id: 0, value: 69, label: "Desgaste", color: "#FFBF08" },
                            { id: 1, value: 11.5, label: "Corte", color: "#0871FF" },
                            { id: 2, value: 11.5, label: "Separación", color: "#fad876" },
                            { id: 3, value: 10, label: "Des. Anormal", color: "#71abf8" },
                        ],
                    }]}

                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                            fontWeight: "500",
                        },
                    }}

                    width={460}
                    height={200}
                />
            </div>
            <button
                onClick={() => exportToImage(chartRef)}
                className="mb-4 px-4 py-2 bg-blue-500 font-semibold flex justify-between items-center text-white rounded"
            >
                Descargar grafico
                <FaDownload className="ml-2" />
            </button>
        </div>
    );
}