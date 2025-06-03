"use client"
import { TrendingUp } from "lucide-react"
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

type ChartItem = {
    month: string
    budget: number
    consumo: number
}

interface BudgetChartProps {
    data: ChartItem[]
}

export function BudgetChart({ data }: BudgetChartProps) {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <TrendingUp className="h-10 lg:h-4 w-12 lg:w-4 dark:text-white" />
                <CardTitle className="dark:text-white">Budget vs Consumo</CardTitle>
                <CardDescription className="dark:text-white">
                    Comparación mensual del presupuesto y consumo de neumáticos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
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
                        <Bar dataKey="budget" fill="#0370dd" radius={4} />
                        <Bar dataKey="consumo" fill="#f1c40f" radius={4} />
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
