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

type TireWithModel = { model?: { dimensions?: string } };
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
        vehicle: {
            code: string;
        } | null;
    }[];
}[];

type ScatterPoint = {
    horas: number;
    desgaste: number;
    codigo: string;
    motivo: string;
    descripcionMotivo: string;
    fecha: string;
    dimension: string;
    year: number;
    vehiculo: string
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
                <p><strong>Equipo:</strong> {data.vehiculo}</p>
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

    const [selectedDimension, setSelectedDimension] = useState<string | null>("46/90R57");
    const [selectedYear, setSelectedYear] = useState<number | null>(2025);

    const fetchScrappedTires = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1/`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
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
                    dimension: (tire as TireWithModel).model?.dimensions ?? "Desconocida",
                    year: new Date(procedure.startDate).getFullYear(),
                    vehiculo: procedure.vehicle?.code || "Desconocido",
                };
            });

            setScatterData(data);
        } catch (error) {
            console.error("Error fetching scrap tires:", error);
            setScatterData([]);
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
    scatterData
        .filter(item =>
            (!selectedDimension || item.dimension === selectedDimension) &&
            (!selectedYear || item.year === selectedYear) // ✅ nuevo filtro
        )
        .forEach(item => {
            const key = item.descripcionMotivo;
            if (!groupedData[key]) groupedData[key] = [];
            groupedData[key].push(item);
        });

    const motivoKeys = Object.keys(groupedData);
    const colorMap: Record<string, string> = {};
    motivoKeys.forEach((key, index) => {
        const hue = (index * 125.508) % 360;
        colorMap[key] = `hsl(${hue}, 65%, 50%)`;
    });

    const motivoOptions = motivoKeys.map((desc) => ({
        value: desc,
        label: desc,
    }));

    const visibleGroups = Object.entries(groupedData).filter(([descMotivo]) =>
        selectedMotivos.length === 0 || selectedMotivos.includes(descMotivo)
    );
    const visiblePointsCount = visibleGroups.reduce(
        (total, [, points]) => total + points.length,
        0
    );

    return (
        <section className="p-4 bg-white dark:bg-gray-900 rounded-md shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
                % Desgaste vs. Horas de Operación al Momento de la Baja
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                Mostrando <strong>{visiblePointsCount}</strong> neumáticos de dimensión <strong>{selectedDimension}</strong> dados de baja del año <strong>{selectedYear}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                <div className="mb-4">
                    <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por dimensión:</label>
                    <Select
                        options={Array.from(new Set(scatterData.map(d => d.dimension)))
                            .sort()
                            .map(d => ({
                                value: d,
                                label: d,
                            }))
                        }
                        isClearable
                        value={selectedDimension ? { value: selectedDimension, label: selectedDimension } : null}
                        onChange={(e) => setSelectedDimension(e?.value || null)}
                        placeholder="Selecciona dimensión..."
                        className="text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por año de baja:</label>
                    <Select
                        options={Array.from(new Set(scatterData.map(d => d.year)))
                            .sort((a, b) => b - a) // años descendentes
                            .map(year => ({
                                value: year,
                                label: `${year}`,
                            }))
                        }
                        isClearable
                        placeholder="Todos los años"
                        value={selectedYear ? { value: selectedYear, label: `${selectedYear}` } : null}
                        onChange={e => setSelectedYear(e?.value || null)}
                        className="text-black"
                    />
                </div>
            </div>


            <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md ">
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