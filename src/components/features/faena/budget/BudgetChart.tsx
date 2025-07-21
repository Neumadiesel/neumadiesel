"use client"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuth } from "@/contexts/AuthContext"
import { useAuthFetch } from "@/utils/AuthFetch"
import { toPng } from "html-to-image"

const chartConfig = {
    budget: {
        label: "budget",
        color: "#f9d374",
    },
    consumo: {
        label: "consumo",
        color: "#ff9e00",
    },
} satisfies ChartConfig
interface BudgetDataDTO {
    month: string,
    budgeted: number,
    actual: number

}

interface BudgetChartProps {
    year?: number
}

export function BudgetChart({ year }: BudgetChartProps) {
    const { siteId } = useAuth();
    const authFetch = useAuthFetch();

    const [budgetByYear, setBudgetByYear] = useState<BudgetDataDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBudgetByYear = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/montyhle-tire-budget/withTyres/site/${siteId}/year/${year}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            if (!response.ok) throw new Error("Error al obtener el presupuesto por año");
            const data = await response.json();

            setBudgetByYear(data);
        } catch (error) {
            console.error("Error al obtener el presupuesto por año:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (siteId && year) {
            fetchBudgetByYear();
        }
    }, [siteId, year]);

    const chartData = budgetByYear.map((item) => ({
        month: item.month, // Convert month number to name
        budget: item.budgeted,
        consumo: item.actual,
    }))

    const downloadImage = async () => {
        const node = document.getElementById('grafico-budget-consumo');
        if (!node) return;

        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.download = `grafico_budget_vs_consumo_${year}.png`;
        link.href = dataUrl;
        link.click();
    };
    return (
        <div className="w-full flex flex-col dark:bg-neutral-800 items-center justify-center">
            <div className="w-1/3 grid gird-cols-1 mx-auto mt-2 mb-2">


                <button
                    onClick={downloadImage}
                    className=" px-4 py-2 bg-blue-600 cols-start-3 text-white rounded hover:bg-blue-700"
                >
                    Descargar como Imagen
                </button>
            </div>
            <Card className="dark:bg-neutral-800 bg-white border dark:border-neutral-700 w-[70%]" id="grafico-budget-consumo">
                <CardHeader className="flex justify-between items-center gap-2 space-y-0 border-b py-5 max-lg:flex-col">

                    {/* Selector de faena */}


                    <div className="flex-1 space-y-1 w-full col-start-2">
                        <CardTitle className="dark:text-white text-xl">Budget vs Consumo {year}</CardTitle>
                        <CardDescription className="dark:text-white">
                            Comparación mensual del presupuesto y consumo de neumáticos.
                        </CardDescription>
                    </div>

                </CardHeader>
                <CardContent>
                    {
                        loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )
                            :
                            <ChartContainer config={chartConfig}>
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dashed" />}
                                    />
                                    <Bar dataKey="budget" fill="#0370dd" radius={3} >
                                        <LabelList
                                            dataKey="budget"
                                            position="top"
                                            style={{ fill: "#0370dd", fontSize: 16, fontWeight: 600 }}
                                        />
                                    </Bar>
                                    <Bar dataKey="consumo" fill="#ff9e00" radius={3} >
                                        <LabelList
                                            dataKey="consumo"
                                            position="top"
                                            style={{ fill: "#ff9e00", fontSize: 16, fontWeight: 600 }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                    }

                </CardContent>
                <CardFooter className="flex items-start gap-2 text-sm dark:text-white">
                    <div className="flex gap-2 font-medium leading-none">
                        <div className="bg-[#0370dd] h-4 w-4 rounded-sm"></div>
                        <span>Budget</span>
                    </div>
                    <div className="flex gap-2 font-medium leading-none">
                        <div className="bg-[#ff9e00] h-4 w-4 rounded-sm"></div>
                        <span>Consumo</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
