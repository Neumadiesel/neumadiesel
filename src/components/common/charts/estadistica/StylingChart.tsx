"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

const chartData = [
  { mes: "Enero", budget: 34, consumo: 34 },
  { mes: "Febrero", budget: 36, consumo: 43 },
  { mes: "Marzo", budget: 28, consumo: 7 },
  { mes: "Abril", budget: 16, consumo: 1 },
  { mes: "Mayo", budget: 14, consumo: 0 },
  { mes: "Junio", budget: 10, consumo: 0 },
  { mes: "Julio", budget: 14, consumo: 0 },
  { mes: "Agosto", budget: 12, consumo: 0 },
  { mes: "Septiembre", budget: 14, consumo: 0 },
  { mes: "Octubre", budget: 16, consumo: 0 },
  { mes: "Noviembre", budget: 16, consumo: 0 },
  { mes: "Diciembre", budget: 16, consumo: 0 },
]

export default function StylingChart() {
    const chartConfig = {
        budget: {
          label: "Budget",
          color: "#f4d03f",
        },
        consumo: {
          label: "Consumo",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
    
            
  return (
    <Card className="shadow-none border-none p-0">
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 mess
        </CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig} >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="consumo"
              type="natural"
              fill="#0080ff"
              fillOpacity={0.8}
              stroke="#045ab0"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="budget"
              type="natural"
              fill="#ffcc00"
              fillOpacity={0.9}
              stroke="#b69b30"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-[90%] items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
