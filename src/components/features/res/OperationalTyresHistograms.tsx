"use client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import Select from "react-select";

// Tipos de datos (mantener igual)
type OperationalTire = {
    id: number;
    code: string;
    initialTread: number;
    model: {
        dimensions: string;
    };
    lastInspection: {
        externalTread: number;
        internalTread: number;
        hours: number;
        kilometrage: number;
        position: number;
        inspectionDate: string;
    };
};

type ScrappedTire = OperationalTire & {
    retirementReason?: {
        id: number;
        name: string;
        description: string;
    };
};

type HistData = {
    codigo: string;
    dimension: string;
    posicion: string;
    horas: number;
    kilometros: number;
    gomaInterna: number;
    gomaExterna: number;
    fecha: string;
};

type HistogramBin = {
    bin: string;
    count: number;
    binStart: number;
    binEnd: number;
    range: string;
};

const CustomHistogramTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm text-black dark:text-white">
                <p><strong>Rango:</strong> {data.range}</p>
                <p><strong>Frecuencia:</strong> {data.count} neumáticos</p>
            </div>
        );
    }
    return null;
};

function createFixedHistogram(values: number[], binSize: number, dataType: string): HistogramBin[] {
    // 🎯 PROTECCIÓN: Asegurar que values es un array válido
    if (!Array.isArray(values) || values.length === 0) return [];

    const validValues = values.filter(v => typeof v === 'number' && !isNaN(v) && isFinite(v));
    if (validValues.length === 0) return [];

    const max = Math.max(...validValues);
    const numBins = Math.ceil(max / binSize);
    const bins: HistogramBin[] = [];

    for (let i = 0; i < numBins; i++) {
        const binStart = i * binSize;
        const binEnd = (i + 1) * binSize;
        const rangeLabel =
            dataType === "horas"
                ? `${binStart} - ${binEnd - 1}h`
                : dataType === "kilometros"
                    ? `${(binStart / 1000).toFixed(0)}k - ${((binEnd - 1) / 1000).toFixed(0)}k km`
                    : `${binStart} - ${binEnd - 1}mm`;

        const count = validValues.filter(v => v >= binStart && v < binEnd).length;
        bins.push({ bin: binStart.toString(), count, binStart, binEnd, range: rangeLabel });
    }
    return bins.filter(b => b.count > 0);
}

const renderHistogram = (
    data: HistData[],
    dataKey: keyof HistData,
    label: string,
    color: string,
    binSize: number,
    dataType: string
) => {
    // 🎯 PROTECCIÓN: Validar que data es un array
    const safeData = Array.isArray(data) ? data : [];
    const values = safeData
        .map(d => d && typeof d === 'object' ? Number(d[dataKey]) : NaN)
        .filter(v => !isNaN(v) && isFinite(v));

    const histogramData = createFixedHistogram(values, binSize, dataType);

    let xAxisLabel = "";
    if (dataType === "horas") xAxisLabel = "Horas Acumuladas";
    else if (dataType === "kilometros") xAxisLabel = "Kilómetros Recorridos";
    else if (dataType === "goma") xAxisLabel = "Goma Remanente (mm)";

    // 🎯 DEBUG: Mostrar mensaje si no hay datos
    if (histogramData.length === 0) {
        return (
            <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md shadow">
                <h3 className="text-md font-semibold dark:text-white mb-2 text-center">{label}</h3>
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay datos suficientes para generar el histograma
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md shadow">
            <h3 className="text-md font-semibold dark:text-white mb-2 text-center">{label}</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="bin"
                        stroke="#888"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        label={{
                            value: xAxisLabel,
                            position: 'insideBottom',
                            offset: -10,
                            style: { textAnchor: 'middle', fill: '#666', fontSize: '12px', fontWeight: 'bold' }
                        }}
                    />
                    <YAxis
                        stroke="#888"
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        label={{
                            value: 'Frecuencia (cantidad de neumáticos)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#666', fontSize: '12px', fontWeight: 'bold' }
                        }}
                    />
                    <Tooltip content={<CustomHistogramTooltip />} />
                    <Bar dataKey="count" fill={color} name="Frecuencia" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function OperationalTyresHistograms() {
    const [tiresOperational, setTiresOperational] = useState<OperationalTire[]>([]);
    const [tiresScrapped, setTiresScrapped] = useState<ScrappedTire[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchErrors, setFetchErrors] = useState<{ operational?: string; scrapped?: string }>({});
    const [isMounted, setIsMounted] = useState(false);
    const [selectedDims, setSelectedDims] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [dataType, setDataType] = useState<'operativo' | 'baja'>('operativo');

    // 🎯 SSR PROTECTION
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 🎯 ESTILOS PARA REACT-SELECT (SSR SAFE)
    const selectStyles = useMemo(() => ({
        control: (base: any) => ({
            ...base,
            minHeight: '40px',
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

    // 🎯 FETCH MEJORADO CON MANEJO INDEPENDIENTE DE ERRORES
    useEffect(() => {
        const fetchTires = async () => {
            setLoading(true);
            setError(null);
            setFetchErrors({});

            try {
                console.log('🔍 Iniciando fetch de neumáticos...');
                console.log('🌐 Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

                // 🎯 URLs que estás intentando usar
                const urlOperational = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`;
                const urlScrapped = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`;

                console.log('📡 URL Operacional:', urlOperational);
                console.log('📡 URL Desechados:', urlScrapped);

                // 🎯 FETCH CON MANEJO INDEPENDIENTE DE ERRORES
                const [resOp, resScrap] = await Promise.allSettled([
                    fetch(urlOperational),
                    fetch(urlScrapped) // 🎯 CAMBIO: Prueba sin el filtro initialTread
                ]);

                let operationalData: OperationalTire[] = [];
                let scrappedData: ScrappedTire[] = [];
                const errors: { operational?: string; scrapped?: string } = {};

                // 🎯 PROCESAR RESULTADO OPERACIONAL
                if (resOp.status === 'fulfilled' && resOp.value.ok) {
                    try {
                        const dataOp = await resOp.value.json();
                        if (Array.isArray(dataOp)) {
                            operationalData = dataOp;
                            console.log('✅ Datos operacionales:', dataOp.length, 'items');
                        } else {
                            console.warn('⚠️ Datos operacionales no son un array:', typeof dataOp);
                        }
                    } catch (parseError) {
                        console.error('❌ Error parseando datos operacionales:', parseError);
                        errors.operational = 'Error al procesar datos operacionales';
                    }
                } else {
                    const status = resOp.status === 'fulfilled' ? resOp.value.status : 'rejected';
                    const statusText = resOp.status === 'fulfilled' ? resOp.value.statusText : 'Connection failed';
                    console.error('❌ Error fetch operacional:', status, statusText);
                    errors.operational = `Error ${status}: ${statusText}`;
                }

                // 🎯 PROCESAR RESULTADO DESECHADOS (NO BLOQUEAR SI FALLA)
                if (resScrap.status === 'fulfilled' && resScrap.value.ok) {
                    try {
                        const dataScrap = await resScrap.value.json();
                        if (Array.isArray(dataScrap)) {
                            scrappedData = dataScrap;
                            console.log('✅ Datos desechados:', dataScrap.length, 'items');
                        } else {
                            console.warn('⚠️ Datos desechados no son un array:', typeof dataScrap);
                        }
                    } catch (parseError) {
                        console.error('❌ Error parseando datos desechados:', parseError);
                        errors.scrapped = 'Error al procesar datos desechados';
                    }
                } else {
                    const status = resScrap.status === 'fulfilled' ? resScrap.value.status : 'rejected';
                    const statusText = resScrap.status === 'fulfilled' ? resScrap.value.statusText : 'Connection failed';
                    console.warn('⚠️ Error fetch desechados (no crítico):', status, statusText);
                    errors.scrapped = `Error ${status}: ${statusText}`;
                }

                // 🎯 ACTUALIZAR ESTADO SIEMPRE (INCLUSO CON ERRORES PARCIALES)
                setTiresOperational(operationalData);
                setTiresScrapped(scrappedData);
                setFetchErrors(errors);

                // 🎯 SOLO MOSTRAR ERROR CRÍTICO SI AMBOS FALLAN
                if (operationalData.length === 0 && scrappedData.length === 0) {
                    setError('No se pudieron cargar datos de neumáticos');
                } else {
                    console.log('✅ Estado actualizado correctamente');
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                console.error("❌ Error general cargando neumáticos:", errorMessage);
                setError(errorMessage);

                // 🎯 FALLBACK: Arrays vacíos en caso de error
                setTiresOperational([]);
                setTiresScrapped([]);
            } finally {
                setLoading(false);
            }
        };

        if (isMounted) {
            fetchTires();
        }
    }, [isMounted]);

    // 🎯 VALIDAR SI HAY DATOS DISPONIBLES PARA EL TIPO SELECCIONADO
    const hasDataForCurrentType = useMemo(() => {
        if (dataType === 'operativo') {
            return Array.isArray(tiresOperational) && tiresOperational.length > 0;
        } else {
            return Array.isArray(tiresScrapped) && tiresScrapped.length > 0;
        }
    }, [dataType, tiresOperational, tiresScrapped]);

    // 🎯 DATOS DEL HISTOGRAMA CON PROTECCIONES MEJORADAS
    const histogramData: HistData[] = useMemo(() => {
        // 🎯 PROTECCIÓN: Asegurar que los arrays existen
        const operationalTires = Array.isArray(tiresOperational) ? tiresOperational : [];
        const scrappedTires = Array.isArray(tiresScrapped) ? tiresScrapped : [];

        // 🎯 PROTECCIÓN: Verificar que hay datos para el tipo seleccionado
        const selectedTires = dataType === 'operativo' ? operationalTires : scrappedTires;

        if (!Array.isArray(selectedTires) || selectedTires.length === 0) {
            console.log(`⚠️ No hay datos para el tipo: ${dataType}`);
            return [];
        }

        console.log(`🔄 Procesando ${selectedTires.length} neumáticos (${dataType})`);

        const processedData = selectedTires
            .filter(t => {
                // 🎯 PROTECCIÓN: Verificar estructura del objeto
                const isValid = t &&
                    typeof t === 'object' &&
                    t.lastInspection &&
                    typeof t.lastInspection === 'object' &&
                    t.lastInspection.position !== 0;

                if (!isValid) {
                    console.log('⚠️ Neumático inválido:', t?.id || 'Sin ID');
                }
                return isValid;
            })
            .map(t => {
                const inspection = t.lastInspection;
                return {
                    codigo: t.code || 'Sin código',
                    dimension: t.model?.dimensions || 'Desconocida',
                    posicion: (inspection.position || 0).toString(),
                    horas: inspection.hours || 0,
                    kilometros: inspection.kilometrage || 0,
                    gomaInterna: inspection.internalTread || 0,
                    gomaExterna: inspection.externalTread || 0,
                    fecha: inspection.inspectionDate
                        ? new Date(inspection.inspectionDate).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                };
            });

        console.log(`✅ Datos procesados: ${processedData.length} neumáticos válidos`);
        return processedData;
    }, [tiresOperational, tiresScrapped, dataType]);

    // 🎯 OPCIONES CON PROTECCIONES
    const dimensionOptions = useMemo(() => {
        const dimensions = Array.isArray(histogramData)
            ? Array.from(new Set(histogramData.map(d => d?.dimension).filter(Boolean)))
            : [];
        return dimensions.sort().map(dim => ({ value: dim, label: dim }));
    }, [histogramData]);

    const posicionOptions = useMemo(() => {
        const positions = Array.isArray(histogramData)
            ? Array.from(new Set(histogramData.map(d => d?.posicion).filter(Boolean)))
            : [];
        return positions
            .sort((a, b) => parseInt(a || '0') - parseInt(b || '0'))
            .map(pos => ({ value: pos, label: `Posición ${pos}` }));
    }, [histogramData]);

    // 🎯 DATOS FILTRADOS CON PROTECCIONES
    const filteredData = useMemo(() => {
        if (!Array.isArray(histogramData)) return [];

        const filtered = histogramData.filter(d => {
            if (!d || typeof d !== 'object') return false;

            if (Array.isArray(selectedDims) && selectedDims.length > 0 && !selectedDims.includes(d.dimension)) {
                return false;
            }
            if (Array.isArray(selectedPositions) && selectedPositions.length > 0 && !selectedPositions.includes(d.posicion)) {
                return false;
            }
            return true;
        });

        console.log(`🔍 Datos filtrados: ${filtered.length} de ${histogramData.length} neumáticos`);
        return filtered;
    }, [histogramData, selectedDims, selectedPositions]);

    // 🎯 EVITAR RENDERIZADO HASTA QUE ESTÉ MONTADO
    if (!isMounted) {
        return (
            <section className="my-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Inicializando histogramas...</div>
                </div>
            </section>
        );
    }

    // 🎯 MOSTRAR ERROR CRÍTICO SOLO SI NO HAY DATOS
    if (error && tiresOperational.length === 0 && tiresScrapped.length === 0) {
        return (
            <section className="my-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Error al cargar histogramas
                            </h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                                Verifica la consola del navegador para más detalles
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="my-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Histogramas de Frecuencia</h2>

            {/* 🎯 ALERTAS DE ERRORES PARCIALES */}
            {(fetchErrors.operational || fetchErrors.scrapped) && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm">
                            <p className="text-yellow-800 dark:text-yellow-200 font-medium">Advertencias de carga:</p>
                            {fetchErrors.operational && (
                                <p className="text-yellow-700 dark:text-yellow-300">• Operacionales: {fetchErrors.operational}</p>
                            )}
                            {fetchErrors.scrapped && (
                                <p className="text-yellow-700 dark:text-yellow-300">• Desechados: {fetchErrors.scrapped}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">Dimensión:</label>
                    <Select
                        instanceId="histogram-dimension-select"
                        isMulti
                        options={dimensionOptions}
                        value={dimensionOptions.filter(opt =>
                            Array.isArray(selectedDims) && selectedDims.includes(opt.value)
                        )}
                        onChange={opts => setSelectedDims(
                            Array.isArray(opts) ? opts.map(o => o.value) : []
                        )}
                        placeholder="Todas las dimensiones"
                        className="text-black"
                        classNamePrefix="react-select"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        styles={selectStyles}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">Posición:</label>
                    <Select
                        instanceId="histogram-position-select"
                        isMulti
                        options={posicionOptions}
                        value={posicionOptions.filter(opt =>
                            Array.isArray(selectedPositions) && selectedPositions.includes(opt.value)
                        )}
                        onChange={opts => setSelectedPositions(
                            Array.isArray(opts) ? opts.map(o => o.value) : []
                        )}
                        placeholder="Todas las posiciones"
                        className="text-black"
                        classNamePrefix="react-select"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        styles={selectStyles}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">
                        Tipo de neumático:
                        {!hasDataForCurrentType && (
                            <span className="ml-2 text-xs text-red-500">⚠️ Sin datos</span>
                        )}
                    </label>
                    <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value as 'operativo' | 'baja')}
                        className="p-2 rounded text-sm bg-white border dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="operativo">
                            Operativos {tiresOperational.length > 0 ? `(${tiresOperational.length})` : '(0)'}
                        </option>
                        <option value="baja">
                            Dados de baja {tiresScrapped.length > 0 ? `(${tiresScrapped.length})` : '(0)'}
                        </option>
                    </select>
                </div>
            </div>

            {/* 🎯 INFO EXPANDIDA */}
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Datos analizados:</strong> {Array.isArray(filteredData) ? filteredData.length : 0} neumáticos.
                    <br />
                    <strong>Tipo:</strong> {dataType === 'operativo' ? 'Operativos' : 'Dados de baja'}
                    <br />
                    <strong>Total operativos:</strong> {tiresOperational.length}
                    <br />
                    <strong>Total desechados:</strong> {tiresScrapped.length}
                    <br />
                    <strong>Estado:</strong> {hasDataForCurrentType ? '✅ Datos disponibles' : '⚠️ Sin datos para este tipo'}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
                    </div>
                </div>
            ) : !hasDataForCurrentType ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center">
                    <p className="text-yellow-800 dark:text-yellow-200 text-lg">
                        No hay datos disponibles para neumáticos {dataType === 'operativo' ? 'operativos' : 'dados de baja'} 📊
                    </p>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                        {dataType === 'baja' && fetchErrors.scrapped
                            ? 'Error en el servidor: ' + fetchErrors.scrapped
                            : 'Intenta cambiar el tipo de neumático o verifica la conexión'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderHistogram(filteredData, "horas", "Distribución de Horas Acumuladas", "#4F46E5", 700, "horas")}
                    {renderHistogram(filteredData, "kilometros", "Distribución de Kilómetros Recorridos", "#10B981", 10000, "kilometros")}
                    {renderHistogram(filteredData, "gomaInterna", "Distribución de Goma Remanente Interna", "#F59E0B", 10, "goma")}
                    {renderHistogram(filteredData, "gomaExterna", "Distribución de Goma Remanente Externa", "#EF4444", 10, "goma")}
                </div>
            )}
        </section>
    );
}
