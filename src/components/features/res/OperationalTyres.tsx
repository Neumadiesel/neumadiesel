"use client";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import Select from "react-select";

type OperationalTire = {
    id: number;
    code: string;
    initialTread: number;
    model: {
        dimensions: string;
        originalTread: number;
    };
    lastInspection: {
        externalTread: number;
        internalTread: number;
        hours: number;
        inspectionDate: string;
    };
    installedTires?: {
        vehicle?: {
            code: string;
        };
    }[];
};

type ScatterPoint = {
    codigo: string;
    horas: number;
    desgaste: number;
    fecha: string;
    dimension: string;
    equipo: string;
};
type CustomTooltipProps = {
    active?: boolean;
    payload?: { payload: ScatterPoint }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm text-black dark:text-white max-w-xs">
                <p><strong>Neumático:</strong> {data.codigo}</p>
                <p><strong>Dimensión:</strong> {data.dimension}</p>
                <p><strong>Equipo:</strong> {data.equipo}</p>
                <p><strong>Fecha inspección:</strong> {data.fecha}</p>
                <p><strong>Horas inspección:</strong> {data.horas}h</p>
                <p><strong>% Desgaste:</strong> {data.desgaste}%</p>
            </div>
        );
    }
    return null;
};

export default function OperationalTyres() {
    const [tires, setTires] = useState<OperationalTire[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);

    useEffect(() => {
        const fetchTires = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`);
                const data = await res.json();
                setTires(data);
            } catch (error) {
                console.error("Error cargando neumáticos operacionales:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTires();
    }, []);

    const scatterData: ScatterPoint[] = tires.map((tire) => {
        const finalTread = (tire.lastInspection.externalTread + tire.lastInspection.internalTread) / 2;
        const desgaste = tire.initialTread
            ? Number((((tire.initialTread - finalTread) / tire.initialTread) * 100).toFixed(2))
            : 0;

        const equipo = tire.installedTires?.[0]?.vehicle?.code ?? "Desconocido";

        return {
            codigo: tire.code,
            horas: tire.lastInspection.hours,
            desgaste,
            fecha: new Date(tire.lastInspection.inspectionDate).toISOString().split("T")[0],
            dimension: tire.model.dimensions,
            equipo,
        };
    });

    const groupedData: Record<string, ScatterPoint[]> = {};
    scatterData.forEach((item) => {
        if (!groupedData[item.dimension]) groupedData[item.dimension] = [];
        groupedData[item.dimension].push(item);
    });

    const dimensionOptions = Object.keys(groupedData).map((d) => ({ value: d, label: d }));

    const colorMap: Record<string, string> = {};
    dimensionOptions.forEach((opt, i) => {
        const hue = (i * 137.508) % 360;
        colorMap[opt.value] = `hsl(${hue}, 70%, 50%)`;
    });

    const visibleGroups = Object.entries(groupedData).filter(
        ([dim]) => selectedDimensions.length === 0 || selectedDimensions.includes(dim)
    );

    return (
        <section className="my-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
                Desgaste vs. Horas de Inspección - Neumáticos Operacionales
            </h2>

            <div className="mb-4">
                <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por dimensión:</label>
                <Select
                    isMulti
                    options={dimensionOptions}
                    value={dimensionOptions.filter(opt => selectedDimensions.includes(opt.value))}
                    onChange={(opts) => setSelectedDimensions(opts.map(opt => opt.value))}
                    placeholder="Selecciona dimensiones..."
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
                            {visibleGroups.map(([dimension, data]) => (
                                <Scatter
                                    key={dimension}
                                    name={dimension}
                                    data={data}
                                    fill={colorMap[dimension]}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}
