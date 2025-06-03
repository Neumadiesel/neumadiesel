"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "A mixed bar chart"

const chartData = [
  { browser: "corte", visitors: 2, fill: "var(--color-corte)" },
  { browser: "desgarro", visitors: 1, fill: "var(--color-desgarro)" },
  { browser: "desgaste", visitors: 28, fill: "var(--color-desgaste)" },
  { browser: "desgasteAnormal", visitors: 8, fill: "var(--color-desgasteAnormal)" },
  { browser: "impacto", visitors: 0, fill: "var(--color-impacto)" },
  { browser: "separacion", visitors: 0, fill: "var(--color-separacion)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  corte: {
    label: "corte",
    color: "var(--chart-1)",
  },
  desgarro: {
    label: "desgarro",
    color: "var(--chart-2)",
  },
  desgaste: {
    label: "desgaste",
    color: "var(--chart-3)",
  },
  desgasteAnormal: {
    label: "desgaste anormal",
    color: "var(--chart-4)",
  },
  impacto: {
    label: "impacto",
    color: "var(--chart-5)",
  },
  separacion: {
    label: "separación",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

export function ScrapChartByType() {
  return (
    <Card className="border-2 border-emerald-500 dark:border-emerald-400">
      <CardHeader>
        <CardTitle>
          Bajas de Neumáticos por Tipo
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="browser"
              type="category"
              width={100}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />

            <XAxis
              type="number"
              tickCount={6}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={[0, 30]}
              tickFormatter={(value) => value.toString()}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
