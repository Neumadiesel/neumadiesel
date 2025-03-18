'use client'
import React from "react";
import Chart from "chart.js";

export default function BarChart() {
    React.useEffect(() => {
        const config = {
            type: "bar",
            data: {
                labels: [
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre",
                    "Enero",
                    "Febrero",
                    "Marzo",
                ],
                datasets: [
                    {
                        label: new Date().getFullYear(),
                        backgroundColor: "#212121",
                        borderColor: "#212121",
                        data: [30, 78, 56, 34, 100, 45, 13],
                        fill: false,
                        barThickness: 20,
                    },
                    {
                        label: new Date().getFullYear() - 1,
                        fill: false,
                        backgroundColor: "#FFBF08",
                        borderColor: "#FFBF08",
                        data: [27, 68, 86, 74, 10, 4, 87],
                        barThickness: 20,
                    },

                    {
                        label: 'Line Dataset',
                        data: [79, 80, 80, 80, 80, 80, 80],
                        type: 'line',
                        // this dataset is drawn on top
                        order: 2
                    }
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: false,
                    text: "Orders Chart",
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                legend: {
                    labels: {
                        fontColor: "#212121",
                    },
                    align: "end",
                    position: "bottom",
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Meses",
                            },
                            gridLines: {
                                borderDash: [2],
                                borderDashOffset: [2],
                                color: "rgba(33, 37, 41, 0.15)",
                                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: "Value",
                            },
                            gridLines: {
                                borderDash: [2],
                                drawBorder: false,
                                borderDashOffset: [2],
                                color: "rgba(33, 37, 41, 0.15)",
                                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                },
            },
        };

        const canvas = document.getElementById("bar-chart") as HTMLCanvasElement | null;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // @ts-expect-error Chart constructor expects a different config type


                new Chart(ctx, config);
            }
        }
    }, []);
    return (
        <div className="h-[100%] w-[100%] bg-white dark:bg-[#212121] flex justify-center items-center">
            <div className="relative bg-[#fef3c6] flex flex-col min-w-0 break-words w-[100vh] h-[80%] mb-6 shadow-lg rounded bg-blueGray-700">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-black mb-1 text-xs font-semibold">
                                Performance
                            </h6>
                            <h2 className="text-black text-xl font-semibold">
                                Total orders
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative h-[90%]">
                        <canvas id="bar-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}