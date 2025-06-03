"use client"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { BudgetData } from "@/types/Budget"


const chartConfig = {
    budget: {
        label: "budget",
        color: "hsl(var(--chart-1))",
    },
    consumo: {
        label: "consumo",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

// type ChartItem = {
//     month: string
//     budget: number
//     consumo: number
// }

interface BudgetChartProps {
    // data: ChartItem[]
    siteId: number
    year: number
}

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function BudgetChart({ siteId, year }: BudgetChartProps) {

    const [budgetByYear, setBudgetByYear] = useState<BudgetData[]>([]);


    const fetchBudgetByYear = async (year: number) => {
        try {
            const response = await fetch(`https://inventory.neumasystem.site/montyhle-tire-budget/site/${siteId}/year/${year}`);
            if (!response.ok) throw new Error("Error al obtener el presupuesto por año");
            const data = await response.json();
            setBudgetByYear(data);
        } catch (error) {
            console.error("Error al obtener el presupuesto por año:", error);
        }
    };

    useEffect(() => {
        if (siteId && year) {
            fetchBudgetByYear(year);
        }
    }, [siteId, year]);

    const chartData = budgetByYear.map((item) => ({
        month: monthNames[item.month - 1],
        budget: item.tireCount,
        consumo: item.tireCount,
    }))

    return (
        <Card className="border-2 border-amber-400 dark:border-amber-300">
            <CardHeader className="grid grid-cols-1 items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <CardTitle className="dark:text-white text-xl">Budget vs Consumo {year}</CardTitle>
                <CardDescription className="dark:text-white">
                    Comparación mensual del presupuesto y consumo de neumáticos.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <Bar dataKey="budget" fill="#0370dd" radius={3} />
                        <Bar dataKey="consumo" fill="#f1c40f" radius={3} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex items-start gap-2 text-sm dark:text-white">
                <div className="flex gap-2 font-medium leading-none">
                    <div className="bg-[#0370dd] h-4 w-4 rounded-sm"></div>
                    <span>Budget</span>
                </div>
                <div className="flex gap-2 font-medium leading-none">
                    <div className="bg-[#f1c40f] h-4 w-4 rounded-sm"></div>
                    <span>Consumo</span>
                </div>
            </CardFooter>
        </Card>
    )
}
