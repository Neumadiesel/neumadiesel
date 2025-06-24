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

export interface RetirementTyreDTO {
    id: number;
    retirementReasonId: number;
    tireId: number;
    finalExternalTread: number;
    finalInternalTread: number;
    finalKilometrage: number;
    finalHours: number;
    lastVehicleId: number;
    lastPosition: number;
    retirementDate: string;
    tire: {
        id: number;
        code: string;
        modelId: number;
        initialTread: number;
        initialKilometrage: number;
        initialHours: number;
        lastInspectionId: number;
        locationId: number;
        usedHours: number;
        usedKilometrage: number;
        siteId: number;
        creationDate: string;
    };
    retirementReason: {
        id: number;
        name: string;
        description: string;
    };
    lastVehicle: {
        id: number;
        code: string;
        modelId: number;
        siteId: number;
        kilometrage: number;
        hours: number;
        typeId: number;
    };
}

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
    const [retirementRecords, setRetirementRecords] = useState<RetirementTyreDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedMotivos, setSelectedMotivos] = useState<string[]>([]);

    useEffect(() => {
        const fetchRetirements = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tire-retirement/site/1/initial-tread/97`);
                const data = await response.json();
                setRetirementRecords(data);
            } catch (error) {
                console.error("Error fetching tyre retirement data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRetirements();
    }, []);

    const scatterData = retirementRecords.map((record) => {
        const initialTread = record.tire.initialTread;
        const finalTread = (record.finalInternalTread + record.finalExternalTread) / 2;
        const desgaste = initialTread
            ? Number((((initialTread - finalTread) / initialTread) * 100).toFixed(2))
            : 0;

        return {
            horas: record.finalHours,
            desgaste,
            codigo: record.tire.code,
            motivo: record.retirementReason?.name ?? "Desconocido",
            descripcionMotivo: record.retirementReason?.description ?? "Desconocido",
            fecha: new Date(record.retirementDate).toISOString().split("T")[0],
        };
    });

    const groupedData: Record<string, typeof scatterData> = {};
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
                Desgaste vs. Horas de Operación al Momento de la Baja
            </h2>

            <div className="mb-4">
                <label className="font-semibold text-sm dark:text-white mb-2 block">Filtrar por tipo de baja:</label>
                <Select
                    options={motivoOptions}
                    isMulti

                    value={motivoOptions.filter((opt) => selectedMotivos.includes(opt.value))}
                    onChange={(selected) => setSelectedMotivos(selected.map((opt) => opt.value))}
                    placeholder="Selecciona tipos de baja..."
                    className="text-black "
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
