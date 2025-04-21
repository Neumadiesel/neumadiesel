import * as React from "react";
// import BarChart from '@/components/common/charts/BarChart';
// import PieChart from '@/components/common/charts/PieChart';
import ScatterPlot from "@/components/common/charts/ScatterPlot";
// import StackBars from '@/components/common/charts/BarOverview';
import MainStylingChart from "@/components/common/charts/estadistica/MainStylingChart";
import HorasDeTrabajo from "@/components/common/charts/estadistica/HorasDeTrabajo";
import StylingPieChart from "@/components/common/charts/estadistica/StylingPieChart";
import StylingToolTip from "@/components/common/charts/estadistica/StylingToolTip";
import StylingBarX from "@/components/common/charts/estadistica/StylingBarX";
import { FaCircleDot } from "react-icons/fa6";
import { GiMineTruck } from "react-icons/gi";
import { FaExclamationTriangle } from "react-icons/fa";
export default function Page() {
    return (
        <div className="flex flex-col overflow-x-hidden  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-center w-full mx-auto font-mono lg:p-3">
            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 h-[95%] ">
                <div className="flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold ">Estadisticas</h1>
                    {/* Seleccion entre semana mes y año */}
                    <div className="flex text-center rounded-full">
                        <button className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600         hover:bg-gray-200 px-4 w-20 py-2 rounded-l-full">
                            Semana
                        </button>
                        <button className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600        hover:bg-gray-200 px-4 w-20 py-2 ">
                            Mes
                        </button>
                        <button className="bg-white dark:bg-gray-700 dark:hover:bg-gray-600    hover:bg-gray-200 px-4 w-20 py-2 rounded-r-full">
                            Año
                        </button>
                    </div>
                    {/* Selector de fecha entre rango de fechas */}
                    <div className="flex flex-row ">
                        <input
                            type="date"
                            className="bg-white dark:bg-gray-700 dark:outline-none    hover:bg-gray-200 px-4 py-2 rounded-l-full"
                        />
                        <input
                            type="date"
                            className="bg-white dark:bg-gray-700 dark:outline-none    hover:bg-gray-200  px-4 py-2 rounded-r-full"
                        />
                    </div>
                </div>
                {/* Principales KPI's */}
                <section className="flex flex-row justify-between mt-2 gap-2 col-span-2  row-span-1 row-start-3">
                    {/* Neumaticos Operativos */}
                    <div className="flex flex-row gap-2 items-center w-1/3 py-4 bg-white border-r-4 border-r-blue-500 shadow-md p-2 rounded-sm">
                        <FaCircleDot className="text-4xl text-blue-500" />
                        <div className="flex flex-col text-start">
                            <p>100</p>
                            <p>Neumaticos Operativos</p>
                        </div>
                    </div>
                    {/* Equipos Operativos */}
                    <div className="flex flex-row gap-2 items-center w-1/3 py-4 bg-white border-r-4 border-r-amber-300 shadow-md p-2 rounded-sm">
                        <GiMineTruck className="text-4xl text-amber-400" />
                        <div className="flex flex-col text-start">
                            <p>30</p>
                            <p>Equipos Operativos</p>
                        </div>
                    </div>
                    {/* Cantidad de alertas */}
                    <div className="flex flex-row gap-2 items-center w-1/3 py-4 bg-white border-r-4 border-r-red-500 shadow-md p-2 rounded-sm">
                        <FaExclamationTriangle className="text-4xl text-red-500" />
                        <div className="flex flex-col text-start">
                            <p>10</p>
                            <p>Alertas</p>
                        </div>
                    </div>
                </section>
                <div className="flex py-4 flex-col lg:grid lg:grid-cols-4 grid-rows-3 pb-4 gap-2 lg:gap-4">
                    {/* Grafico de Area estilizado - consumo de neumaticos */}
                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md col-span-4 row-span-1 row-start-1">
                        <MainStylingChart />
                    </div>
                    {/* Grafico de barras estilizado */}
                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md py-3 col-span-1 row-span-1 row-start-2">
                        <HorasDeTrabajo />
                    </div>

                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md py-3 col-span-2  row-span-1 row-start-2">
                        <ScatterPlot />
                    </div>

                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md py-3 col-span-1  row-span-1 row-start-2 col-start-4">
                        <StylingPieChart />
                    </div>
                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md py-3 col-span-2  row-span-1 row-start-3">
                        <StylingToolTip />
                    </div>
                    <div className=" bg-white dark:bg-neutral-900    shadow-md rounded-md py-3 col-span-2  row-span-1 row-start-3">
                        <StylingBarX />
                    </div>
                </div>
            </main>
        </div>
    );
}
