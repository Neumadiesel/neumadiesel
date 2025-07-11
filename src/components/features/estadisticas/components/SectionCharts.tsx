

import React from "react";

// Imports de Graficos
import MainStylingChart from "@/components/common/charts/estadistica/MainStylingChart";
import { BudgetChart } from "@/components/features/faena/budget/BudgetChart";
import { ScrapChart } from "@/components/features/estadisticas/graficos/ScrapChart";
import { ScrapChartByMonth } from "@/components/features/estadisticas/graficos/ScrapChartByMonth";
import { ScrapChartByType } from "@/components/features/estadisticas/graficos/ScrapChartByType";
import SectionKpi from "./SectionKpi";
import { useAuth } from "@/contexts/AuthContext";


export default function SectionCharts() {
    const { siteId } = useAuth();
    return (
        <div className="grid grid-cols-1 py-4 px-2 gap-2 w-full">
            <div className="flex flex-col lg:flex-row-reverse gap-2 mb-2 w-full h-full">
                {/* KPI: arriba en móvil, derecha en escritorio */}
                <div className="w-full lg:w-1/3 h-[100%] flex items-center justify-center rounded-md">
                    <SectionKpi />
                </div>

                {/* Gráfico: abajo en móvil, izquierda en escritorio */}
                <div className="w-full lg:w-2/3">
                    <ScrapChart />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2   gap-2">
                <div className="h-[100%]  w-full flex items-center justify-center rounded-md">
                    <ScrapChartByMonth />
                </div>
                <div className="h-[100%] w-full flex items-center justify-center rounded-md py-3 ">
                    <BudgetChart siteId={siteId || 1} year={2025} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full  gap-2">
                <div className="h-[100%]w-full flex items-center justify-center   rounded-md py-3">
                    <ScrapChartByType />
                </div>
                <div className="h-[100%] w-full flex items-center justify-center   rounded-md py-3">
                    <MainStylingChart />
                </div>
            </div>
        </div>
    );
}