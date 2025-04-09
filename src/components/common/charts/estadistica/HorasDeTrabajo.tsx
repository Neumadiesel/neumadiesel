"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
const chartData = [{ month: "Marzo", Disponible: 1260, Indisponible: 570 }]

const chartConfig = {
  Disponible: {
    label: "Disponible",
    color: "hsl(var(--chart-1))",
  },
  Indisponible: {
    label: "Indisponible",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function HorasDeDisponible() {
  const totalHours = chartData[0].Disponible + chartData[0].Indisponible
  return (
    <Card className="flex flex-col shadow-none border-none dark:bg-neutral-900">
      <CardHeader className="items-center pb-0">
        <CardTitle>Horas trabajadas por flota</CardTitle>
        <CardDescription>Marzo 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0 w-[100%] pt-10 mt-10  ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full flex items-center justify-center  max-w-[350px] h-[200px] text-md" 
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={90}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalHours.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Horas totales
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="Indisponible"
              fill="#0080ff"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Disponible"
              stackId="a"
              cornerRadius={5}
              fill="#ffcc00"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
                <p>Horas trabajadas</p>  <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
