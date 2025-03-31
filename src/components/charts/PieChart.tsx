"use client";

import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function PieArcLabel() {
    return (
        <div className="w-[100%]">
            <h2>Motivos de Baja</h2>
            <PieChart
                series={[{
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: "60%",
                    data: [
                        { id: 0, value: 69, label: "Desgaste", color: "#FFBF08" },
                        { id: 1, value: 11.5, label: "Corte", color: "#0871FF" },
                        { id: 2, value: 11.5, label: "Separación", color: "#FF6B6C" },
                        { id: 3, value: 10, label: "Desgaste Anormal", color: "#FFE4FA" },
                    ],
                }]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: "500",
                    },
                }}

                width={500}
                height={240}
            />
        </div>
    );
}