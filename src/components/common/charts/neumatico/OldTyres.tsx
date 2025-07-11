"use client";
import { useState, useEffect } from "react";
import { TireDTO } from "@/types/Tire";
import { FileCheck, Info } from "lucide-react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";

export default function OldTyres() {
    const [tireCritical, setTireCritical] = useState<TireDTO[]>([]);
    const [showChart, setShowChart] = useState(true);
    const { user, siteId } = useAuth(); // Assuming useAuth is defined in your context
    const client = useAxiosWithAuth();
    function calculateWearPercentage(
        internalTread?: number,
        externalTread?: number,
        originalTread?: number
    ): number | null {
        if (
            typeof internalTread !== "number" ||
            typeof externalTread !== "number" ||
            typeof originalTread !== "number" ||
            originalTread === 0
        ) {
            return null;
        }
        const avgTread = (internalTread + externalTread) / 2;
        const wear = ((originalTread - avgTread) / originalTread) * 100;
        return Math.round(wear * 10) / 10;
    }


    const fetchCriticalTires = async () => {
        try {

            const response = await client.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/more-than-4500-hours/site/${siteId}`
            );
            const sortedTires = response.data.sort(
                (a: TireDTO, b: TireDTO) => {
                    // Helper to calculate wear percentage for sorting
                    const getWear = (tire: TireDTO) =>
                        calculateWearPercentage(
                            tire.lastInspection?.internalTread,
                            tire.lastInspection?.externalTread,
                            tire.initialTread
                        ) ?? 0;
                    return getWear(b) - getWear(a);
                }
            );
            setTireCritical(sortedTires);
        } catch (error) {
            console.error("Error fetching critical tires:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCriticalTires();
        }
    }, [user, siteId]);

    return (
        <section className="w-full h-[65dvh] bg-white shadow-sm dark:bg-gray-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-semibold flex items-center">
                    <FileCheck size={32} className="inline mr-2 text-red-500" />
                    Neumáticos Críticos
                </h2>
                {/* Botón para mostrar gráfico */}
                <div className="flex items-center gap-2">

                    <ExportOldTyresReport
                        tireCritical={tireCritical}
                    />
                    <button
                        onClick={() => setShowChart((prev) => !prev)}
                        className=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        {showChart ? "Mostrar Listado de Neumáticos" : "Mostrar Gráfico de Horas"}
                    </button>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Aquí puedes ver los neumáticos que requieren atención inmediata en formato de lista o gráfico.
            </p>

            <div className=" h-[50dvh] overflow-y-scroll border  mb-4">
                {
                    showChart ? (

                        <table className="min-w-full bg-white  dark:bg-gray-800">
                            <thead className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
                                <tr className="border-b dark:border-neutral-600">
                                    <th className="px-4 py-2 text-left">Neumático</th>
                                    <th className="px-4 py-2 text-left">Equipo</th>
                                    <th className="px-4 py-2 text-left">% de Desgaste</th>
                                    <th className="px-4 py-2 text-left">Dimensiones</th>
                                    <th className="px-4 py-2 text-left">Posición</th>
                                    <th className="px-4 py-2 text-left">Horas</th>
                                    <th className="px-4 py-2 text-left">Ubicación</th>
                                    <th className="px-4 py-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tireCritical.length === 0 ? (
                                    <tr className="border-b dark:border-neutral-600">
                                        <td
                                            colSpan={6}
                                            className="px-4 py-2 text-center text-gray-500"
                                        >
                                            No hay neumáticos críticos
                                        </td>
                                    </tr>
                                ) : (
                                    tireCritical.map((tire) => (
                                        <tr
                                            key={tire.id}
                                            className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                        >
                                            <td className="px-4 py-2">{tire.code}</td>
                                            <td className="px-4 py-2">
                                                {tire.installedTires[0]?.vehicle?.code ?? "—"}
                                            </td>
                                            {/* Porcentaje de desgaste  */}
                                            <td className="px-4 py-2">
                                                {calculateWearPercentage(
                                                    tire.lastInspection?.internalTread,
                                                    tire.lastInspection.externalTread,
                                                    tire.initialTread)
                                                    || "—"
                                                }
                                            </td>
                                            <td className="px-4 py-2">
                                                {tire.model.dimensions
                                                    ? `${tire.model.dimensions}`
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {tire.lastInspection?.position ?? "—"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {tire.lastInspection?.hours ?? "—"}
                                            </td>
                                            <td className="px-4 py-2">{tire.location?.name ?? "—"}</td>
                                            <td className="px-4 py-2 flex items-center gap-2">
                                                <ToolTipCustom content="Ver Neumático">
                                                    <Link href={`/neumaticos/${tire.id}`}>
                                                        <Info className="w-6 h-6 text-blue-500 hover:text-blue-700 transition-colors" />
                                                    </Link>
                                                </ToolTipCustom>
                                                {/* Ver ultima inspeccion */}
                                                <ToolTipCustom content="Ver Ultima Inspección">
                                                    <Link href={`medicion/${tire.lastInspectionId}`}>
                                                        <FileCheck className="w-6 h-6 text-amber-500 hover:text-amber-700 transition-colors" />
                                                    </Link>
                                                </ToolTipCustom>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )
                        : (
                            <ChartBarLabelCustom tireCritical={tireCritical} />
                        )
                }
            </div>
        </section>
    );
}
import { CartesianGrid, LabelList } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import ExportOldTyresReport from "@/utils/export/ExportOldTyreesToExcel";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuth } from "@/contexts/AuthContext";

export const description = "A bar chart with a custom label"


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig

export function ChartBarLabelCustom({ tireCritical }: { tireCritical: TireDTO[] }) {
    return (
        <div className="overflow-y-scroll h-[95%] p-3">
            <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig} >
                    <BarChart
                        accessibilityLayer
                        data={tireCritical.map((tire) => ({
                            name: tire.code,
                            horas: tire.lastInspection?.hours ?? 0,
                        }))}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="horas" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="horas"
                            layout="vertical"
                            fill="#f1c40f"
                            radius={4}
                        >
                            <LabelList
                                dataKey="name"
                                position="insideLeft"
                                offset={10}
                                className="fill-foreground"
                                fontWeight={"bold"}
                                fontSize={16}
                            />
                            <LabelList
                                dataKey="horas"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontWeight={"bold"}
                                fontSize={18}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </ResponsiveContainer>
        </div>
    )
}
