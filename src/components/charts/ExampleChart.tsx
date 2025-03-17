'use client'
import React, { useEffect } from "react";
import Chart from "chart.js";

export default function ExampleChart() {
    useEffect(() => {
        const config = {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: new Date().getFullYear().toString(),
                        backgroundColor: "#FF784F",
                        borderColor: "#FF784F",
                        data: [65, 78, 66, 44, 56, 67, 75],
                        fill: false,
                    },
                    {
                        label: (new Date().getFullYear() - 1).toString(),
                        fill: false,
                        backgroundColor: "#FFD230",
                        borderColor: "#FFD230",
                        data: [40, 68, 86, 74, 56, 60, 87],
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                legend: {
                    labels: {
                        fontColor: "#212121",
                    },
                    align: "end",
                    position: "bottom",
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: "Month",
                            },
                            gridLines: {
                                display: false,
                                drawBorder: false,
                                color: "rgba(255, 255, 255, 0.15)",
                                zeroLineColor: "rgba(33, 37, 41, 0)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                            ticks: {
                                fontColor: "#212121",
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
                                borderDash: [3],
                                drawBorder: false,
                                color: "rgba(21, 21, 21, 0.15)",
                                zeroLineColor: "rgba(33, 37, 41, 0)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                            ticks: {
                                fontColor: "#212121",

                            },
                        },
                    ],
                },
            },
        };

        const canvas = document.getElementById("line-chart") as HTMLCanvasElement | null;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // @ts-expect-error Chart constructor expects a different config type


                new Chart(ctx, config);
            }
        }
    }, []);

    return (
        <div className="h-[100%] w-[100%] bg-[#EEF0F2] dark:bg-[#212121] flex justify-center items-center">
            <div className="relative bg-amber-100 flex flex-col min-w-0 break-words w-[100vh] h-3/4 mb-6 shadow-lg rounded bg-blueGray-700">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className=" text-black uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                                Overview
                            </h6>
                            <h2 className="text-black text-xl font-semibold">Sales value</h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <canvas id="line-chart"></canvas>
                </div>
            </div>
        </div>
    );
}