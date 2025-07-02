"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Legend,
    ReferenceLine,
} from "recharts";

interface Tire {
    code: string;
    id: number;
    model: {
        dimensions: string;
    };
    lastInspection: {
        pressure: number | null;
        temperature: number | null;
        internalTread: number;
        externalTread: number;
    };
    installedTires: {
        vehicle: {
            model: string;
        };
        position: number;
    }[];
}

type ProcessedTire = {
    code: string;
    dimension: string;
    model: string;
    position: number;
    pressure: number;
    temperature: number;
    treadDiff: number;
    minTread: number;
    avgTread: number;
    status: string;
    action: string;
    priority: number;
    internalTread: number;
    externalTread: number;
    positionColor: string;
    positionName: string;
};
export default function TireHealthChart() {
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const getPositionColor = (position: number) => {
        const colors: { [key: number]: string } = {
            1: '#ef4444', // Rojo - Delantero izquierdo
            2: '#f97316', // Naranja - Delantero derecho
            3: '#eab308', // Amarillo - Trasero izquierdo exterior
            4: '#22c55e', // Verde - Trasero derecho exterior
            5: '#06b6d4', // Cian - Trasero izquierdo interior
            6: '#3b82f6', // Azul - Trasero derecho interior
            7: '#8b5cf6', // Violeta - Repuesto/Otros
            8: '#ec4899', // Rosa - Repuesto/Otros
        };
        return colors[position] || '#6b7280'; // Gris por defecto
    };
    const getPositionName = (position: number) => {
        const names: { [key: number]: string } = {
            1: 'Del. Izq.',
            2: 'Del. Der.',
            3: 'Tras. Izq. Ext.',
            4: 'Tras. Der. Ext.',
            5: 'Tras. Izq. Int.',
            6: 'Tras. Der. Int.',
            7: 'Repuesto',
            8: 'Otros',
        };
        return names[position] || `Pos. ${position}`;
    };

    const [tires, setTires] = useState<Tire[]>([]);
    const [selectedDimension, setSelectedDimension] = useState<string | null>("46/90R57");
    const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
                .then(res => res.json())
                .then(setTires)
                .catch(err => console.error("Error cargando neumáticos:", err));
        }
    }, [user]);


    const processedData = useMemo(() => {
        return tires
            .filter(t => {
                // Filtro por dimensión
                if (selectedDimension && t.model.dimensions !== selectedDimension) return false;



                // Filtro por posición
                if (selectedPosition && !t.installedTires.some(i => i.position === selectedPosition)) return false;

                return true;
            })
            .map(t => {
                const { pressure, temperature, internalTread, externalTread } = t.lastInspection;
                const position = t.installedTires[0]?.position || 0;

                const treadDiff = Math.abs(internalTread - externalTread);
                const minTread = Math.min(internalTread, externalTread);
                const avgTread = (internalTread + externalTread) / 2;

                let status = "Normal";
                let action = "Sin acción";
                let priority = 0; // 0=Normal, 1=Alerta, 2=Crítico

                // Análisis de diferencia de goma
                if (treadDiff > 10) {
                    status = "Crítico";
                    action = "Reemplazo inmediato - Desgaste irregular";
                    priority = 2;
                } else if (treadDiff > 6) {
                    status = "Alerta";
                    action = "Rotar neumático - Desgaste desigual";
                    priority = 1;
                }

                // Análisis de desgaste general
                if (minTread <= 8) {
                    status = "Crítico";
                    action = "Reemplazo inmediato - Desgaste límite";
                    priority = 2;
                } else if (minTread <= 15 && priority < 2) {
                    status = "Alerta";
                    action = "Planificar cambio - Desgaste avanzado";
                    priority = Math.max(priority, 1);
                }

                // Análisis de presión por posición
                if (pressure !== null) {
                    let pressureOk = true;
                    if (position === 1 || position === 2) { // Posiciones delanteras
                        if (pressure < 116 || pressure > 150) {
                            pressureOk = false;
                        }
                    } else { // Posiciones traseras
                        if (pressure < 105 || pressure > 140) {
                            pressureOk = false;
                        }
                    }

                    if (!pressureOk && priority < 2) {
                        status = priority === 0 ? "Alerta" : status;
                        action = priority === 0 ? "Verificar presión - Fuera de rango" : action;
                        priority = Math.max(priority, 1);
                    }
                }

                // Análisis de temperatura
                if (temperature !== null) {
                    if (temperature >= 85) {
                        status = "Crítico";
                        action = "Reemplazo inmediato - Sobrecalentamiento";
                        priority = 2;
                    } else if (temperature >= 75 && priority < 2) {
                        status = priority === 0 ? "Alerta" : status;
                        action = priority === 0 ? "Revisar temperatura - Calentamiento" : action;
                        priority = Math.max(priority, 1);
                    }
                }

                return {
                    id: t.id,
                    code: t.code,
                    dimension: t.model.dimensions,
                    model: t.installedTires[0]?.vehicle.model || "Desconocido",
                    position,
                    pressure: pressure || 0,
                    temperature: temperature || 0,
                    treadDiff,
                    minTread,
                    avgTread,
                    status,
                    action,
                    priority,
                    internalTread,
                    externalTread,
                    // Color por posición para gráficos
                    positionColor: getPositionColor(position),
                    positionName: getPositionName(position)
                };
            });
    }, [tires, selectedDimension, selectedPosition]);

    const validPressureTemperatureCount = useMemo(() => {
        return processedData.filter(t => t.pressure > 0 && t.temperature > 0).length;
    }, [processedData]);



    // Datos para scatter agrupados por posición
    const scatterDataByPosition = useMemo(() => {
        const grouped: { [key: number]: ProcessedTire[] } = {};
        processedData.forEach(item => {
            if (!grouped[item.position]) {
                grouped[item.position] = [];
            }
            grouped[item.position].push(item);
        });
        return grouped;
    }, [processedData]);


    const uniqueDimensions = Array.from(new Set(tires.map(t => t.model.dimensions)));



    const uniquePositions = Array.from(new Set(tires.flatMap(t => t.installedTires.map(i => i.position)))).sort((a, b) => a - b);

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-neutral-700 border-gray-200 dark:text-white">

            <main className="p-6">
                <div className="flex flex-col items-center  mb-2">

                    <h2 className="text-2xl font-bold mb-2 text-center bg-black  bg-clip-text text-transparent">
                        Panel de Salud de Neumáticos OTR
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                        Monitoreo en tiempo real del estado de neumáticos con análisis detallado
                    </p>

                </div>

                {/* Filtros mejorados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col items-start space-y-1 ">
                        <label className="block text-xs font-semibold">
                            Dimensión del neumático:
                        </label>
                        <Select
                            value={
                                selectedDimension
                                    ? {
                                        value: selectedDimension,
                                        label: `${selectedDimension} (${tires.filter(t => t.model.dimensions === selectedDimension).length} neumáticos)`
                                    }
                                    : null
                            }
                            options={uniqueDimensions.map(d => {
                                const tiresCount = tires.filter(t => t.model.dimensions === d).length;
                                return {
                                    value: d,
                                    label: `${d} (${tiresCount} neumáticos)`
                                };
                            })}
                            isClearable
                            placeholder="Todas las dimensiones"
                            onChange={e => setSelectedDimension(e?.value || null)}
                            className="w-full rounded-md react-select-container text-black "
                            classNamePrefix="react-select"
                        />
                    </div>

                    <div className="flex flex-col items-start space-y-1 ">
                        <label className="block text-xs font-semibold">
                            Posición en vehículo:
                        </label>
                        <Select
                            options={uniquePositions.map(p => {
                                const tiresCount = tires.filter(t =>
                                    t.installedTires.some(install => install.position === p)
                                ).length;
                                return {
                                    value: p,
                                    label: `${getPositionName(p)} - Pos. ${p} (${tiresCount} neumáticos)`
                                };
                            })}
                            isClearable
                            placeholder="Todas las posiciones"
                            onChange={e => setSelectedPosition(e?.value || null)}
                            className=" w-full rounded-md react-select-container text-black"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>
            </main>
            <main className={`grid grid-cols-1 ${validPressureTemperatureCount >= 40 ? 'lg:grid-cols-2' : ''}`}>

                {validPressureTemperatureCount >= 40 && (
                    <div className="p-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Temperatura vs Presión por Posición
                            </h3>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    type="number"
                                    dataKey="pressure"
                                    name="Presión"
                                    unit=" PSI"
                                    label={{
                                        value: 'Presión (PSI)',
                                        position: 'insideBottom',
                                        offset: -20,
                                        style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                                    }}
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    domain={['dataMin - 10', 'dataMax + 10']}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="temperature"
                                    name="Temperatura"
                                    unit="°C"
                                    label={{
                                        value: 'Temperatura (°C)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: 20,
                                        style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                                    }}
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip
                                    formatter={(value, name) => [
                                        value === 0 ? "Sin dato" : `${value}${name === 'pressure' ? ' PSI' : '°C'}`,
                                        name === 'pressure' ? 'Presión' : 'Temperatura'
                                    ]}
                                    labelFormatter={(label, payload) => {
                                        if (payload && payload[0]) {
                                            const data = payload[0].payload;
                                            return `${data.code} - ${data.positionName}`;
                                        }
                                        return "";
                                    }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend />

                                {/* Líneas de referencia para rangos seguros */}
                                <ReferenceLine x={105} stroke="#ef4444" strokeDasharray="5 5" />
                                <ReferenceLine x={150} stroke="#ef4444" strokeDasharray="5 5" />
                                <ReferenceLine y={75} stroke="#f97316" strokeDasharray="5 5" />
                                <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="5 5" />

                                {Object.entries(scatterDataByPosition).map(([position, data]) => (
                                    <Scatter
                                        key={position}
                                        name={getPositionName(parseInt(position))}
                                        data={data.filter(d => d.pressure > 0 && d.temperature > 0)}
                                        fill={getPositionColor(parseInt(position))}
                                    />
                                ))}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>


                )
                }

                <section id="chart-area" className="p-3">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Desgaste Interno vs Externo por Posición
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                reversed
                                type="number"
                                dataKey="internalTread"
                                name="Goma Interna"
                                unit=" mm"
                                label={{
                                    value: 'Goma Interna (mm)',
                                    position: 'insideBottom',
                                    offset: -50,
                                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                                }}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <YAxis
                                reversed
                                type="number"
                                dataKey="externalTread"
                                name="Goma Externa"
                                unit=" mm"
                                label={{
                                    value: 'Goma Externa (mm)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    offset: -20,
                                    style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                                }}
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <Tooltip
                                formatter={(value, name) => [
                                    `${value} mm`,
                                    name === 'internalTread' ? 'Goma Interna' : 'Goma Externa'
                                ]}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload[0]) {
                                        const data = payload[0].payload;
                                        return `${data.code} - ${data.positionName}`;
                                    }
                                    return "";
                                }}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />

                            {/* Línea diagonal para desgaste uniforme */}
                            <ReferenceLine
                                segment={[{ x: 0, y: 0 }, { x: 50, y: 50 }]}
                                stroke="#22c55e"
                                strokeDasharray="3 3"
                            />

                            {selectedPosition && (
                                <>
                                    {[1, 2].includes(selectedPosition) ? (
                                        <>
                                            {/* Delanteras: alerta en 70 mm, crítico en 56 mm */}
                                            <ReferenceLine x={70} stroke="#f97316" strokeDasharray="5 5" />
                                            <ReferenceLine y={70} stroke="#f97316" strokeDasharray="5 5" />
                                            <ReferenceLine x={56} stroke="#ef4444" strokeDasharray="5 5" />
                                            <ReferenceLine y={56} stroke="#ef4444" strokeDasharray="5 5" />
                                        </>
                                    ) : (
                                        <>
                                            {/* Traseras: crítico en 25 mm */}
                                            <ReferenceLine x={25} stroke="#ef4444" strokeDasharray="5 5" />
                                            <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="5 5" />
                                        </>
                                    )}
                                </>
                            )}

                            {Object.entries(scatterDataByPosition).map(([position, data]) => (
                                <Scatter
                                    key={position}
                                    name={getPositionName(parseInt(position))}
                                    data={data}
                                    fill={getPositionColor(parseInt(position))}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </section>
            </main>
        </div >
    )
}