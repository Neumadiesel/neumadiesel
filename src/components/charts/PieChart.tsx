"use client";

import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function PieArcLabel() {
    return (
        <div className="w-[100%] mr-14">
            <h2 className="font-semibold text-lg">Motivos de Baja</h2>
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
    );
}