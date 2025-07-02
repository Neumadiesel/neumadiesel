"use client";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";

type TireScrapResponse = {
    id: number;
    code: string;
    initialTread: number;
    retirementReason: {
        name: string;
        description: string;
    };
    procedures: {
        externalTread: number;
        internalTread: number;
        tireHours: number;
        startDate: string;
    }[];
}[];

type ScatterPoint = {
    horas: number;
    desgaste: number;
    codigo: string;
    motivo: string;
    descripcionMotivo: string;
    fecha: string;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: ScatterPoint }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm text-black dark:text-white max-w-xs">
                <p><strong>Neumático:</strong> {data.codigo}</p>
                <p><strong>Motivo de Baja:</strong> {data.descripcionMotivo}</p>
                <p><strong>Fecha:</strong> {data.fecha}</p>
                <p><strong>Horas:</strong> {data.horas}h</p>
                <p><strong>% Desgaste:</strong> {data.desgaste}%</p>
            </div>
        );
    }
    return null;
};

export default function ScrapTyres() {
    const authFetch = useAuthFetch();
    const [scatterData, setScatterData] = useState<ScatterPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMotivos, setSelectedMotivos] = useState<string[]>([]);
    const { user } = useAuth();

    const fetchScrappedTires = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`http://localhost:3002/tires/scrapped/site/1/initialTread/97`);
            const tires: TireScrapResponse = await response.json();

            const data: ScatterPoint[] = tires.flatMap((tire) => {
                const procedure = tire.procedures?.[0];
                if (
                    !procedure ||
                    tire.initialTread == null ||
                    procedure.externalTread == null ||
                    procedure.internalTread == null ||
                    procedure.tireHours == null ||
                    !tire.retirementReason
                ) {
                    return [];
                }

                const finalTread = (procedure.externalTread + procedure.internalTread) / 2;
                const desgaste = Number(
                    (((tire.initialTread - finalTread) / tire.initialTread) * 100).toFixed(2)
                );

                return {
                    horas: procedure.tireHours,
                    desgaste,
                    codigo: tire.code,
                    motivo: tire.retirementReason.name,
                    descripcionMotivo: tire.retirementReason.description,
                    fecha: new Date(procedure.startDate).toISOString().split("T")[0],
                };
            });

            setScatterData(data);
        } catch (error) {
            console.error("Error fetching scrap tires:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchScrappedTires();
        }
    }, [user]);

    const groupedData: Record<string, ScatterPoint[]> = {};
    scatterData.forEach((item) => {
        const key = item.descripcionMotivo;
        if (!groupedData[key]) groupedData[key] = [];
        groupedData[key].push(item);
    });

    const motivoKeys = Object.keys(groupedData);
    const colorMap: Record<string, string> = {};
    motivoKeys.forEach((key, index) => {
        const hue = (index * 137.508) % 360;
        colorMap[key] = `hsl(${hue}, 70%, 50%)`;
    });

    const motivoOptions = motivoKeys.map((desc) => ({
        value: desc,
        label: desc,
    }));

    const visibleGroups = Object.entries(groupedData).filter(([descMotivo]) =>
        selectedMotivos.length === 0 || selectedMotivos.includes(descMotivo)
    );

    return (
        <section className="my-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
                % Desgaste vs. Horas de Operación al Momento de la Baja
            </h2>

            <div className="mb-4">
                <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por tipo de baja:</label>
                <Select
                    options={motivoOptions}
                    isMulti
                    value={motivoOptions.filter((opt) => selectedMotivos.includes(opt.value))}
                    onChange={(selected) => setSelectedMotivos(selected.map((opt) => opt.value))}
                    placeholder="Selecciona tipos de baja..."
                    className="text-black"
                />
            </div>

            <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md shadow">
                {loading ? (
                    <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="horas" name="Horas" unit="h" stroke="#888" />
                            <YAxis type="number" dataKey="desgaste" name="% Desgaste" unit="%" stroke="#888" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: '#000', fontWeight: 'bold' }} />
                            {visibleGroups.map(([descripcionMotivo, data]) => (
                                <Scatter
                                    key={descripcionMotivo}
                                    name={descripcionMotivo}
                                    data={data}
                                    fill={colorMap[descripcionMotivo]}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}