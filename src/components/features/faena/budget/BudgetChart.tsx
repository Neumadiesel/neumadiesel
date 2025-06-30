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
import { useAuth } from "@/contexts/AuthContext"
import { useAuthFetch } from "@/utils/AuthFetch"

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
interface BudgetDataDTO {
    month: string,
    budgeted: number,
    actual: number

}

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}
interface BudgetChartProps {
    siteId: number
    year: number
}

export function BudgetChart({ siteId, year }: BudgetChartProps) {
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const isAdmin = user?.role.name.toLowerCase() === "administrador";
    const [budgetByYear, setBudgetByYear] = useState<BudgetDataDTO[]>([]);
    const [yearSelected, setYearSelected] = useState<number>(year);
    const [sites, setSites] = useState<FaenaDTO[]>([]);
    const [siteSelected, setSiteSelected] = useState<number>(siteId);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBudgetByYear = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/montyhle-tire-budget/withTyres/site/${siteSelected}/year/${yearSelected}`);
            if (!response.ok) throw new Error("Error al obtener el presupuesto por año");
            const data = await response.json();
            setBudgetByYear(data);
        } catch (error) {
            console.error("Error al obtener el presupuesto por año:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSites = async () => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/`);
            const data = await response.json();
            setSites(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        if (siteId && year) {
            fetchSites();
            fetchBudgetByYear();
        }
    }, [siteId, year, yearSelected, siteSelected]);

    const chartData = budgetByYear.map((item) => ({
        month: item.month, // Convert month number to name
        budget: item.budgeted,
        consumo: item.actual,
    }))

    return (
        <Card className="border-2 border-amber-400 dark:border-amber-300">
            <CardHeader className="flex justify-between items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                {/* Selector de faena */}
                <div className="flex items-center w-1/4 col-start-1">
                    {
                        isAdmin &&
                        <select
                            value={siteSelected}
                            onChange={(e) => {
                                setSiteSelected(Number(e.target.value));
                            }}
                            className="bg-white dark:bg-[#212121] border dark:text-white border-gray-300 dark:border-gray-600 rounded-md p-2 px-4 text-sm"
                        >
                            {sites.map((site) => (
                                <option key={site.id} value={site.id}>
                                    {site.name}
                                </option>
                            ))}
                        </select>
                    }
                </div>

                <div className="flex-1 space-y-1 w-full col-start-2">
                    <CardTitle className="dark:text-white text-xl">Budget vs Consumo {yearSelected}</CardTitle>
                    <CardDescription className="dark:text-white">
                        Comparación mensual del presupuesto y consumo de neumáticos.
                    </CardDescription>
                </div>
                <div className="flex items-center w-1/4 justify-end">
                    <select
                        value={yearSelected}
                        onChange={(e) => setYearSelected(Number(e.target.value))}
                        className="bg-white dark:bg-[#212121] border dark:text-white border-gray-300 dark:border-gray-600 rounded-md p-2 px-4 text-sm"
                    >
                        {[2023, 2024, 2025, 2026, 2027, 2028].map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>
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
                                <Bar dataKey="budget" fill="#0370dd" radius={3} />
                                <Bar dataKey="consumo" fill="#f1c40f" radius={3} />
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
                    <div className="bg-[#f1c40f] h-4 w-4 rounded-sm"></div>
                    <span>Consumo</span>
                </div>
            </CardFooter>
        </Card>
    )
}
