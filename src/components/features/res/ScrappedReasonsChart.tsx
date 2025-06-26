"use client";
import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer, CartesianGrid } from 'recharts';
import Select from 'react-select';

interface Tyre {
    id: number;
    // 🎯 CORRECCIÓN: El campo correcto para la fecha de baja
    procedures?: Array<{
        endDate: string;
        // otros campos del procedimiento
    }>;
    retirementReason: {
        id: number;
        description: string; // 🎯 También podemos usar la descripción
    };
    vehicle?: {
        model: {
            brand: string;
            model: string//revissssssss
        };
    };
    model: {
        dimensions: string;
        pattern: string;
    };
}

interface ChartDataPoint {
    month: string;
    total: number;
    counts: Record<string, number>;
    [key: string]: any; // Para las razones dinámicas
}

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF',
    '#FF5C8D', '#8DD1E1', '#FFB6C1', '#C4E17F', '#FFD700',
    '#32CD32', '#FF69B4', '#87CEEB', '#DDA0DD', '#F0E68C'
];

const getMonthName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { month: 'long' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as ChartDataPoint;
    const sortedPayload = payload.sort((a: any, b: any) => b.value - a.value);

    return (
        <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm">
            <p className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                {label} - Total: {data.total} neumáticos
            </p>
            <div className="space-y-1">
                {sortedPayload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 rounded mr-2"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-700 dark:text-gray-300">{entry.dataKey}:</span>
                        </div>
                        <div className="text-right ml-3">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {entry.value.toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                ({data.counts[entry.dataKey] || 0})
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function ScrappedReasonsChart() {
    const [tyres, setTyres] = useState<Tyre[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Filtros
    const [year, setYear] = useState(new Date().getFullYear());
    const [fleet, setFleet] = useState<string | null>(null);
    const [dimension, setDimension] = useState<string | null>(null);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

    // 🎯 SSR PROTECTION
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 🎯 ESTILOS PARA REACT-SELECT (SSR SAFE)
    const selectStyles = useMemo(() => ({
        control: (base: any) => ({
            ...base,
            minHeight: '36px',
            fontSize: '14px',
            borderColor: '#D1D5DB',
            zIndex: 10,
        }),
        menuPortal: (base: any) => ({
            ...base,
            zIndex: 9999,
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 9999,
        }),
    }), []);

    // 🎯 FETCH CON DEBUGGING MEJORADO
    useEffect(() => {
        const fetchTyres = async () => {
            if (!isMounted) return;

            setLoading(true);
            setError(null);

            try {
                console.log('🔍 Cargando datos de motivos de baja...');

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Los datos recibidos no son un array válido');
                }

                console.log('✅ Datos cargados:', data.length, 'neumáticos');
                console.log('📊 Muestra de datos:', data[0]); // 🎯 DEBUG: Ver estructura real
                setTyres(data);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
                console.error('❌ Error cargando datos:', errorMessage);
                setError(errorMessage);
                setTyres([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTyres();
    }, [isMounted]);

    // 🎯 FUNCIÓN PARA OBTENER LA FECHA DE BAJA
    const getTireEndDate = (tyre: Tyre): string | null => {
        // Opción 1: Si hay procedures, tomar la última fecha
        if (tyre.procedures && tyre.procedures.length > 0) {
            const lastProcedure = tyre.procedures[tyre.procedures.length - 1];
            if (lastProcedure.endDate) return lastProcedure.endDate;
        }

        // Opción 2: Si tiene endDate directo
        if ((tyre as any).endDate) return (tyre as any).endDate;

        // Opción 3: Otros campos posibles
        if ((tyre as any).retirementDate) return (tyre as any).retirementDate;
        if ((tyre as any).scrapDate) return (tyre as any).scrapDate;

        return null;
    };

    // 🎯 DATOS FILTRADOS CON PROTECCIONES MEJORADAS
    const filteredTyres = useMemo(() => {
        if (!Array.isArray(tyres)) return [];

        console.log('🔍 Filtrando neumáticos:', tyres.length, 'total');

        const filtered = tyres.filter(t => {
            if (!t || !t.retirementReason?.description) {
                console.log('⚠️ Neumático sin motivo de baja:', t?.id);
                return false;
            }

            // 🎯 OBTENER FECHA DE BAJA
            const endDate = getTireEndDate(t);
            if (!endDate) {
                console.log('⚠️ Neumático sin fecha de baja:', t.id);
                return false;
            }

            const tYear = new Date(endDate).getFullYear();
            if (tYear !== year) return false;

            // Filtro por flota
            if (fleet) {
                const tyreModel = t.vehicle?.model?.model;
                const tyreFleet = tyreModel ? ` ${tyreModel}` : null;
                if (tyreFleet !== fleet) return false;
            }

            // Filtro por dimensión
            if (dimension && t.model?.dimensions !== dimension) return false;

            // Filtro por razones seleccionadas
            if (selectedReasons.length > 0 && !selectedReasons.includes(t.retirementReason.description)) {
                return false;
            }

            return true;
        });

        console.log(`✅ Neumáticos filtrados: ${filtered.length} de ${tyres.length}`);
        return filtered;
    }, [tyres, year, fleet, dimension, selectedReasons]);

    // 🎯 DATOS AGRUPADOS PARA EL GRÁFICO
    const chartData: ChartDataPoint[] = useMemo(() => {
        console.log('🔄 Generando datos del gráfico...');

        const groupedData = filteredTyres.reduce((acc, tyre) => {
            const endDate = getTireEndDate(tyre);
            if (!endDate) return acc;

            const month = getMonthName(endDate);
            const reason = tyre.retirementReason.description; // 🎯 USAR NAME, no description

            if (!acc[month]) acc[month] = {};
            acc[month][reason] = (acc[month][reason] || 0) + 1;

            return acc;
        }, {} as Record<string, Record<string, number>>);

        const result = Object.entries(groupedData)
            .map(([month, reasons]) => {
                const total = Object.values(reasons).reduce((a, b) => a + b, 0);
                const percentages = Object.fromEntries(
                    Object.entries(reasons).map(([k, v]) => [k, (v / total) * 100])
                );

                return {
                    month: month.charAt(0).toUpperCase() + month.slice(1),
                    total,
                    counts: reasons,
                    ...percentages,
                };
            })
            .sort((a, b) => {
                const months = [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];
                const monthA = months.findIndex(m => m.toLowerCase() === a.month.toLowerCase());
                const monthB = months.findIndex(m => m.toLowerCase() === b.month.toLowerCase());
                return monthA - monthB;
            });

        console.log('📊 Datos del gráfico generados:', result.length, 'meses');
        return result;
    }, [filteredTyres]);

    // 🎯 OPCIONES INTELIGENTES CON DEBUGGING
    const options = useMemo(() => {
        const years = new Set<number>();
        const reasons = new Set<string>();
        const fleets = new Set<string>();
        const dimensions = new Set<string>();

        console.log('🔍 Generando opciones de filtro...');

        tyres.forEach(tyre => {
            if (!tyre) return;

            // Obtener año de la fecha de baja
            const endDate = getTireEndDate(tyre);
            if (endDate) {
                const year = new Date(endDate).getFullYear();
                years.add(year);
            }

            // Motivos de baja
            if (tyre.retirementReason?.description) {
                reasons.add(tyre.retirementReason.description);
            }

            // Dimensiones
            if (tyre.model?.dimensions) {
                dimensions.add(tyre.model.dimensions);
            }

            // Flotas
            const brand = tyre.vehicle?.model?.brand;
            const model = tyre.vehicle?.model?.model;
            if (brand && model) {
                fleets.add(`${brand} ${model}`);
            }
        });

        const result = {
            years: [...years].sort((a, b) => b - a),
            reasons: [...reasons].sort(),
            fleets: [...fleets].sort(),
            dimensions: [...dimensions].sort(),
        };

        console.log('✅ Opciones generadas:', {
            años: result.years.length,
            motivos: result.reasons.length,
            flotas: result.fleets.length,
            dimensiones: result.dimensions.length
        });

        return result;
    }, [tyres]);

    // 🎯 EVITAR RENDERIZADO HASTA QUE ESTÉ MONTADO
    if (!isMounted) {
        return (
            <section className="my-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Inicializando gráfico...</div>
                </div>
            </section>
        );
    }

    // 🎯 MOSTRAR ERROR SI HAY
    if (error) {
        return (
            <section className="my-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Error al cargar motivos de baja
                            </h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const totalTyres = filteredTyres.length;
    const allReasons = options.reasons;

    return (
        <section className="my-4 space-y-4">
            <h2 className="text-xl font-bold dark:text-white">Motivos de Baja por Mes (%)</h2>

            {/* 🎯 DEBUGGING INFO - TEMPORAL */}
            {tyres.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
                    <p><strong>Debug:</strong> Total neumáticos: {tyres.length} | Filtrados: {totalTyres} | Años disponibles: {options.years.join(', ')} | Motivos: {options.reasons.length}</p>
                </div>
            )}

            {/* 🎯 FILTROS COMPACTOS */}
            <div className="bg-white dark:bg-[#313131] p-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="block mb-1 text-xs font-semibold dark:text-white">
                            Año: ({options.years.length} disponibles)
                        </label>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            {options.years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold dark:text-white">
                            Flota: ({options.fleets.length} disponibles)
                        </label>
                        <Select
                            instanceId="reasons-fleet-select"
                            options={options.fleets.map(f => ({ value: f, label: f }))}
                            value={fleet ? { value: fleet, label: fleet } : null}
                            onChange={v => setFleet(v?.value || null)}
                            placeholder="Todas las flotas"
                            isClearable
                            className="text-black text-sm"
                            classNamePrefix="react-select"
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                            styles={selectStyles}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold dark:text-white">
                            Dimensión: ({options.dimensions.length} disponibles)
                        </label>
                        <Select
                            instanceId="reasons-dimension-select"
                            options={options.dimensions.map(d => ({ value: d, label: d }))}
                            value={dimension ? { value: dimension, label: dimension } : null}
                            onChange={v => setDimension(v?.value || null)}
                            placeholder="Todas las dimensiones"
                            isClearable
                            className="text-black text-sm"
                            classNamePrefix="react-select"
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                            styles={selectStyles}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-xs font-semibold dark:text-white">
                            Motivos: ({allReasons.length} disponibles)
                        </label>
                        <Select
                            instanceId="reasons-filter-select"
                            isMulti
                            options={allReasons.map(r => ({ value: r, label: r }))}
                            value={selectedReasons.map(r => ({ value: r, label: r }))}
                            onChange={v => setSelectedReasons(Array.isArray(v) ? v.map(x => x.value) : [])}
                            placeholder="Todos los motivos"
                            className="text-black text-sm"
                            classNamePrefix="react-select"
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                            styles={selectStyles}
                        />
                    </div>
                </div>

                {/* 🎯 INFO COMPACTA */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-blue-800 dark:text-blue-200">
                            <span className="font-semibold">Analizando:</span> {totalTyres} neumáticos en {year}
                        </div>
                        <div className="text-blue-600 dark:text-blue-300">
                            {fleet && `• ${fleet} `}
                            {dimension && `• ${dimension}`}
                            {selectedReasons.length > 0 && `• ${selectedReasons.length} motivos`}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🎯 GRÁFICO */}
            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white dark:bg-[#313131] rounded-lg shadow">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
                    </div>
                </div>
            ) : totalTyres === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
                    <p className="text-yellow-800 dark:text-yellow-200 text-lg">
                        No hay datos disponibles para los filtros seleccionados 📊
                    </p>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                        Año: {year} | Total neumáticos: {tyres.length} | Años disponibles: {options.years.join(', ')}
                    </p>
                </div>
            ) : chartData.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
                    <p className="text-yellow-800 dark:text-yellow-200 text-lg">
                        Hay {totalTyres} neumáticos pero no se pueden agrupar por mes 📊
                    </p>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                        Verifica que los neumáticos tengan fechas de baja válidas
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#313131] p-4 rounded-lg shadow">
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                stroke="#6B7280"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tickFormatter={(val) => `${val.toFixed(0)}%`}
                                stroke="#6B7280"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {allReasons.map((reason, index) => (
                                <Bar
                                    key={reason}
                                    dataKey={reason}
                                    stackId="a"
                                    fill={COLORS[index % COLORS.length]}
                                    isAnimationActive={false}
                                    radius={index === allReasons.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                >
                                    <LabelList
                                        dataKey={(entry: any) => entry.counts?.[reason]}
                                        position="center"
                                        fill="#fff"
                                        fontSize={10}
                                        fontWeight="bold"
                                        formatter={(val: any) => (val && val > 0 ? val : '')}
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}