"use client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";
import { useEffect, useState, useMemo } from "react";
import Select, { CSSObjectWithLabel } from "react-select";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";

// Tipos de datos diferenciados
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
    installedTires?: {
        position: number;
        vehicle: {
            model: string;
        };
    }[];
};

type Discrepancy =
    | {
        type: 'operativo';
        code: string;
        lastInspectionPosition: number;
        installedTiresPosition: number | undefined;
        inspectionDate: string;
    }
    | {
        type: 'baja';
        code: string;
        position: number;
        startDate: string;
    };

type ScrappedTire = {
    id: number;
    code: string;
    initialTread: number;
    model: {
        dimensions: string;
    };
    retirementReason: {
        id: number;
        name: string;
        description: string;
    };
    installedTires: []; // Siempre vacío para dados de baja
    procedures: {
        id: number;
        tireId: number;
        position: number;
        tireHours: number;
        tireKilometres: number; // Nota: es "tireKilometres" no "tireKilometers"
        internalTread: number;
        externalTread: number;
        description: string;
        procedureName: string;
        startDate: string;
        endDate: string;
        vehicleId: number;
        siteId: number;
        retirementReasonId: number;
        retirementReason: {
            id: number;
            name: string;
            description: string;
        };
        vehicle: {
            id: number;
            code: string;
            model: {
                brand: string;
                model: string;
            };
        };
    }[];
    // También tienen lastInspection
    lastInspection: {
        id: number;
        position: number;
        externalTread: number;
        internalTread: number;
        kilometrage: number;
        hours: number;
        inspectorId: number;
        inspectorName: string;
        tireId: number;
        inspectionDate: string;
        pressure: number | null;
        temperature: number | null;
        description: string;
        approved: boolean;
        approvedAt: string;
        approvedById: number | null;
        approvedByName: string;
        operatorName: string;
        operatorId: number | null;
        observation: string;
    };
};

// Union type para el procesamiento
type TireUnion = OperationalTire | ScrappedTire;

// Type guards
function isOperationalTire(tire: TireUnion): tire is OperationalTire {
    return 'lastInspection' in tire;
}

function isScrappedTire(tire: TireUnion): tire is ScrappedTire {
    return 'retirementReason' in tire &&
        tire.retirementReason !== null &&
        tire.retirementReason !== undefined &&
        'procedures' in tire &&
        Array.isArray(tire.procedures) &&
        tire.procedures.length > 0;
}

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

const CustomHistogramTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload as HistogramBin;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded 
             text-sm text-black dark:text-white">
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
            <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md">
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
        <div className="w-full h-[400px] bg-white dark:bg-[#313131] p-4 rounded-md border">
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
    const authFetch = useAuthFetch();
    const { user } = useAuth();
    const [tiresOperational, setTiresOperational] = useState<OperationalTire[]>([]);
    const [tiresScrapped, setTiresScrapped] = useState<ScrappedTire[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchErrors, setFetchErrors] = useState<{ operational?: string; scrapped?: string }>({});
    const [isMounted, setIsMounted] = useState(false);
    const [selectedDims, setSelectedDims] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [dataType, setDataType] = useState<'operativo' | 'baja'>('operativo');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');

    // 🎯 SSR PROTECTION
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 🎯 ESTILOS PARA REACT-SELECT (SSR SAFE)
    const selectStyles = useMemo(() => ({
        control: (base: CSSObjectWithLabel) => ({
            ...base,
            minHeight: '40px',
            borderColor: '#D1D5DB',
            zIndex: 10,
        }),
        menuPortal: (base: CSSObjectWithLabel) => ({
            ...base,
            zIndex: 9999,
        }),
        menu: (base: CSSObjectWithLabel) => ({
            ...base,
            zIndex: 9999,
        }),
    }), []);

    // 🎯 FETCH MEJORADO CON MANEJO INDEPENDIENTE DE ERRORES

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
                authFetch(urlOperational),
                authFetch(urlScrapped) // 🎯 CAMBIO: Prueba sin el filtro initialTread
            ]);

            if (!resOp || !resScrap) {
                console.error('❌ Error: Respuesta de fetch es null o undefined');
                setError('Error al obtener datos de neumáticos');
                setLoading(false);
                return;
            }

            let operationalData: OperationalTire[] = [];
            let scrappedData: ScrappedTire[] = [];
            const errors: { operational?: string; scrapped?: string } = {};
            // 🎯 PROCESAR RESULTADO OPERACIONAL
            if (
                resOp.status === 'fulfilled' &&
                resOp.value !== null &&
                resOp.value.ok
            ) {
                try {
                    const dataOp = await resOp.value.json();
                    if (Array.isArray(dataOp)) {
                        operationalData = dataOp;
                        console.log('✅ Datos operacionales:', dataOp.length, 'items');

                        // 🎯 DEBUG: Mostrar ejemplo de fechas
                        if (dataOp.length > 0 && dataOp[0]?.lastInspection?.inspectionDate) {
                            console.log('🔍 Ejemplo de fecha operacional:', dataOp[0].lastInspection.inspectionDate);
                            const sampleDate = new Date(dataOp[0].lastInspection.inspectionDate);
                            console.log('🔍 Fecha parseada:', sampleDate);
                            console.log('🔍 Año UTC:', sampleDate.getUTCFullYear());
                            console.log('🔍 Mes UTC:', sampleDate.getUTCMonth() + 1);
                        }
                    } else {
                        console.warn('⚠️ Datos operacionales no son un array:', typeof dataOp);
                    }
                } catch (parseError) {
                    console.error('❌ Error parseando datos operacionales:', parseError);
                    errors.operational = 'Error al procesar datos operacionales';
                }
            } else {
                const status =
                    resOp.status === 'fulfilled' && resOp.value
                        ? resOp.value.status
                        : 'rejected';
                const statusText =
                    resOp.status === 'fulfilled' && resOp.value
                        ? resOp.value.statusText
                        : 'Connection failed';
                console.error('❌ Error fetch operacional:', status, statusText);
                errors.operational = `Error ${status}: ${statusText}`;
            }

            // 🎯 PROCESAR RESULTADO DESECHADOS (NO BLOQUEAR SI FALLA)
            if (
                resScrap.status === 'fulfilled' &&
                resScrap.value !== null &&
                resScrap.value.ok
            ) {
                try {
                    const dataScrap = await resScrap.value.json();
                    if (Array.isArray(dataScrap)) {
                        scrappedData = dataScrap;
                        console.log('✅ Datos desechados:', dataScrap.length, 'items');

                        // 🎯 DEBUG: Mostrar ejemplo real de dados de baja
                        if (dataScrap.length > 0 && dataScrap[0]?.procedures?.[0]?.startDate) {
                            console.log('🔍 === ESTRUCTURA REAL DE DADOS DE BAJA ===');
                            console.log('🔍 Ejemplo de fecha baja:', dataScrap[0].procedures[0].startDate);
                            const sampleDate = new Date(dataScrap[0].procedures[0].startDate);
                            console.log('🔍 Fecha parseada (baja):', sampleDate);
                            console.log('🔍 Año UTC (baja):', sampleDate.getUTCFullYear());
                            console.log('🔍 Mes UTC (baja):', sampleDate.getUTCMonth() + 1);
                            console.log('🔍 Estructura procedures[0]:', {
                                tireHours: dataScrap[0].procedures[0].tireHours,
                                tireKilometres: dataScrap[0].procedures[0].tireKilometres,
                                position: dataScrap[0].procedures[0].position,
                                internalTread: dataScrap[0].procedures[0].internalTread,
                                externalTread: dataScrap[0].procedures[0].externalTread,
                                startDate: dataScrap[0].procedures[0].startDate
                            });
                            console.log('🔍 installedTires está vacío:', dataScrap[0].installedTires.length === 0);
                            console.log('🔍 Tiene retirementReason:', !!dataScrap[0].retirementReason);
                        }
                    } else {
                        console.warn('⚠️ Datos desechados no son un array:', typeof dataScrap);
                    }
                } catch (parseError) {
                    console.error('❌ Error parseando datos desechados:', parseError);
                    errors.scrapped = 'Error al procesar datos desechados';
                }
            } else {
                const status =
                    resScrap.status === 'fulfilled' && resScrap.value
                        ? resScrap.value.status
                        : 'rejected';
                const statusText =
                    resScrap.status === 'fulfilled' && resScrap.value
                        ? resScrap.value.statusText
                        : 'Connection failed';
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
    useEffect(() => {
        if (isMounted) {
            fetchTires();
        }
    }, [isMounted, user]);

    // 🎯 VALIDAR SI HAY DATOS DISPONIBLES PARA EL TIPO SELECCIONADO
    const hasDataForCurrentType = useMemo(() => {
        if (dataType === 'operativo') {
            return Array.isArray(tiresOperational) && tiresOperational.length > 0;
        } else {
            return Array.isArray(tiresScrapped) && tiresScrapped.length > 0;
        }
    }, [dataType, tiresOperational, tiresScrapped]);

    // 🎯 DATOS DEL HISTOGRAMA CON PROTECCIONES MEJORADAS Y ANÁLISIS DE POSICIONES
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

        // 🎯 ANÁLISIS DE POSICIONES - DIAGNÓSTICO DETALLADO DIFERENCIADO POR TIPO
        console.log('📊 === ANÁLISIS DE POSICIONES ===');
        let positionDiscrepancies = 0;
        let positionZeroCount = 0;
        let correctedPositions = 0;
        let validTires = 0;
        let invalidTires = 0;

        const discrepanciesList: Discrepancy[] = [];

        selectedTires.forEach((t, index) => {
            let hasValidStructure = false;

            if (dataType === 'operativo') {
                // 🎯 VALIDACIÓN PARA NEUMÁTICOS OPERATIVOS
                hasValidStructure = t &&
                    typeof t === 'object' &&
                    isOperationalTire(t) &&
                    Array.isArray(t.installedTires) &&
                    t.installedTires.length > 0;
            } else {
                // 🎯 VALIDACIÓN PARA NEUMÁTICOS DADOS DE BAJA
                hasValidStructure = t &&
                    typeof t === 'object' &&
                    isScrappedTire(t);
            }

            if (!hasValidStructure) {
                invalidTires++;
                console.log(`⚠️ Neumático ${index} estructura inválida (${dataType}):`, {
                    code: t?.code || 'Sin código',
                    hasLastInspection: isOperationalTire(t),
                    hasInstalledTires: dataType === 'operativo'
                        ? Array.isArray(t?.installedTires)
                        : (isScrappedTire(t) ? Array.isArray(t.procedures) : false),
                    installedTiresLength: dataType === 'operativo'
                        ? (t?.installedTires?.length || 0)
                        : (isScrappedTire(t) && Array.isArray(t.procedures) ? t.procedures.length : 0),
                    hasStartDate: dataType === 'baja' && isScrappedTire(t) ? !!(getScrappedTireData(t)?.startDate) : 'N/A'
                });
                return;
            }

            if (dataType === 'operativo' && isOperationalTire(t)) {
                // 🎯 LÓGICA PARA OPERATIVOS (usando lastInspection y installedTires)
                const lastInspectionPosition = t.lastInspection.position;
                const installedTiresPosition = t.installedTires?.[0]?.position;

                // Contar neumáticos con lastInspection.position = 0
                if (lastInspectionPosition === 0) {
                    positionZeroCount++;
                }

                // Detectar discrepancias
                if (lastInspectionPosition !== installedTiresPosition) {
                    positionDiscrepancies++;
                    discrepanciesList.push({
                        code: t.code,
                        lastInspectionPosition,
                        installedTiresPosition,
                        inspectionDate: t.lastInspection.inspectionDate,
                        type: 'operativo'
                    });
                }
            } else if (dataType === 'baja' && isScrappedTire(t)) {
                // 🎯 LÓGICA PARA DADOS DE BAJA (usar procedures)
                const scrappedData = getScrappedTireData(t);
                const installedTiresPosition = scrappedData?.position || 0;

                if (installedTiresPosition === 0) {
                    positionZeroCount++;
                }

                // Para dados de baja, registrar info básica
                discrepanciesList.push({
                    code: t.code,
                    position: installedTiresPosition,
                    startDate: scrappedData?.startDate || 'Sin fecha',
                    type: 'baja'
                });
            }

            validTires++;
        });

        console.log(`📊 Análisis de posiciones en ${selectedTires.length} neumáticos (${dataType}):`);
        console.log(`✅ Neumáticos válidos: ${validTires}`);
        console.log(`❌ Neumáticos inválidos: ${invalidTires}`);
        console.log(`📍 Position 0: ${positionZeroCount} neumáticos`);

        if (dataType === 'operativo') {
            console.log(`⚠️ Discrepancias de posición: ${positionDiscrepancies} neumáticos`);
        }

        if (discrepanciesList.length > 0) {
            console.log(`📋 Lista de ${dataType === 'operativo' ? 'discrepancias' : 'neumáticos dados de baja'} (primeros 10):`);
            discrepanciesList.slice(0, 10).forEach((item, i) => {
                if (item.type === 'operativo') {
                    console.log(`${i + 1}. Código: ${item.code} | LastInsp: ${item.lastInspectionPosition} | Installed: ${item.installedTiresPosition} | Fecha: ${item.inspectionDate}`);
                } else {
                    console.log(`${i + 1}. Código: ${item.code} | Posición: ${item.position} | Fecha baja: ${item.startDate}`);
                }
            });

            if (discrepanciesList.length > 10) {
                console.log(`... y ${discrepanciesList.length - 10} más`);
            }
        }

        const processedData = selectedTires
            .filter(t => {
                // 🎯 VALIDACIÓN DIFERENCIADA POR TIPO
                let isValid = false;

                if (dataType === 'operativo') {
                    // Para operativos: necesitan lastInspection e installedTires
                    isValid = t &&
                        typeof t === 'object' &&
                        isOperationalTire(t) &&
                        Array.isArray(t.installedTires) &&
                        t.installedTires.length > 0;
                } else {
                    // Para dados de baja: solo necesitan installedTires con startDate
                    isValid = t &&
                        typeof t === 'object' &&
                        isScrappedTire(t);
                }

                if (!isValid) {
                    console.log(`⚠️ Neumático filtrado por estructura inválida (${dataType}):`, t?.code || 'Sin código');
                }
                return isValid;
            })
            .map(t => {
                if (dataType === 'operativo' && isOperationalTire(t)) {
                    // 🎯 PROCESAMIENTO PARA NEUMÁTICOS OPERATIVOS
                    const inspection = t.lastInspection;

                    // Lógica corregida: Si lastInspection.position === 0, usar installedTires[0].position
                    const correctPosition = inspection.position === 0 && t.installedTires?.[0]?.position
                        ? t.installedTires[0].position
                        : inspection.position;

                    if (inspection.position === 0 && t.installedTires?.[0]?.position) {
                        correctedPositions++;
                    }

                    return {
                        codigo: t.code || 'Sin código',
                        dimension: t.model?.dimensions || 'Desconocida',
                        posicion: correctPosition.toString(),
                        horas: inspection.hours || 0,
                        kilometros: inspection.kilometrage || 0,
                        gomaInterna: inspection.internalTread || 0,
                        gomaExterna: inspection.externalTread || 0,
                        fecha: inspection.inspectionDate
                            ? (() => {
                                try {
                                    const date = new Date(inspection.inspectionDate);
                                    if (isNaN(date.getTime())) {
                                        console.warn('⚠️ Fecha inválida en procesamiento operativo:', inspection.inspectionDate);
                                        return new Date().toISOString().split("T")[0];
                                    }
                                    return date.toISOString().split("T")[0];
                                } catch (error) {
                                    console.warn('⚠️ Error procesando fecha operativo:', inspection.inspectionDate, error);
                                    return new Date().toISOString().split("T")[0];
                                }
                            })()
                            : new Date().toISOString().split("T")[0],
                    };
                } else if (dataType === 'baja' && isScrappedTire(t)) {
                    // 🎯 PROCESAMIENTO PARA NEUMÁTICOS DADOS DE BAJA
                    const scrappedData = getScrappedTireData(t);

                    if (!scrappedData) {
                        console.warn('⚠️ No se pudieron obtener datos de baja para:', t.code);
                        return {
                            codigo: t.code || 'Sin código',
                            dimension: t.model?.dimensions || 'Desconocida',
                            posicion: '0',
                            horas: 0,
                            kilometros: 0,
                            gomaInterna: 0,
                            gomaExterna: 0,
                            fecha: new Date().toISOString().split("T")[0],
                        };
                    }

                    return {
                        codigo: t.code || 'Sin código',
                        dimension: t.model?.dimensions || 'Desconocida',
                        posicion: (scrappedData.position || 0).toString(),
                        horas: scrappedData.tireHours || 0,
                        kilometros: scrappedData.tireKilometers || 0,
                        gomaInterna: scrappedData.internalTread || 0,
                        gomaExterna: scrappedData.externalTread || 0,
                        fecha: scrappedData.startDate
                            ? (() => {
                                try {
                                    const date = new Date(scrappedData.startDate);
                                    if (isNaN(date.getTime())) {
                                        console.warn('⚠️ Fecha inválida en procesamiento baja:', scrappedData.startDate);
                                        return new Date().toISOString().split("T")[0];
                                    }
                                    return date.toISOString().split("T")[0];
                                } catch (error) {
                                    console.warn('⚠️ Error procesando fecha baja:', scrappedData.startDate, error);
                                    return new Date().toISOString().split("T")[0];
                                }
                            })()
                            : new Date().toISOString().split("T")[0],
                    };
                } else {
                    // Fallback - nunca debería llegar aquí debido al filtro anterior
                    console.warn('⚠️ Tipo de neumático no reconocido:', t);
                    return {
                        codigo: t?.code || 'Error',
                        dimension: 'Error',
                        posicion: '0',
                        horas: 0,
                        kilometros: 0,
                        gomaInterna: 0,
                        gomaExterna: 0,
                        fecha: new Date().toISOString().split("T")[0],
                    };
                }
            });

        console.log(`🔄 Correcciones aplicadas: ${correctedPositions} neumáticos usaron installedTires.position`);
        console.log(`✅ Datos procesados: ${processedData.length} neumáticos válidos (antes: ${validTires} filtrados por position=0)`);

        // 🎯 ANÁLISIS DE DISTRIBUCIÓN DE POSICIONES FINAL
        const positionDistribution: { [key: string]: number } = {};
        processedData.forEach(item => {
            positionDistribution[item.posicion] = (positionDistribution[item.posicion] || 0) + 1;
        });

        console.log('📊 Distribución final de posiciones:');
        Object.entries(positionDistribution)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .forEach(([pos, count]) => {
                console.log(`  Posición ${pos}: ${count} neumáticos`);
            });

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

    // 🎯 OPCIONES DE AÑOS - CORREGIDO PARA MANEJAR AMBOS TIPOS DE DATOS CON TYPE GUARDS
    const yearOptions = useMemo(() => {
        // 🎯 Usar TODOS los neumáticos disponibles, no solo los ya filtrados
        const operationalTires = Array.isArray(tiresOperational) ? tiresOperational : [];
        const scrappedTires = Array.isArray(tiresScrapped) ? tiresScrapped : [];
        const allTires = dataType === 'operativo' ? operationalTires : scrappedTires;

        console.log(`📅 Generando opciones de años desde ${allTires.length} neumáticos (${dataType})`);

        const years = Array.from(new Set(
            allTires
                .filter(t => {
                    // 🎯 FILTRO DIFERENCIADO POR TIPO CON TYPE GUARDS
                    if (dataType === 'operativo') {
                        return isOperationalTire(t) && t.lastInspection?.inspectionDate;
                    } else {
                        return isScrappedTire(t) && hasScrappedTireDate(t);
                    }
                })
                .map(t => {
                    try {
                        // 🎯 CORRECCIÓN: Usar campo correcto según el tipo CON TYPE GUARDS
                        let dateStr = '';
                        if (dataType === 'operativo' && isOperationalTire(t)) {
                            dateStr = t.lastInspection.inspectionDate;
                        } else if (dataType === 'baja' && isScrappedTire(t)) {
                            dateStr = getScrappedTireDate(t) || '';
                        } else {
                            return null;
                        }

                        console.log(`🔍 Procesando fecha (${dataType}): ${dateStr}`);

                        // Crear fecha usando UTC para evitar problemas de zona horaria
                        const date = new Date(dateStr);

                        // Verificar que la fecha es válida
                        if (isNaN(date.getTime())) {
                            console.warn('⚠️ Fecha inválida:', dateStr);
                            return null;
                        }

                        // Usar getUTCFullYear para mantener consistencia
                        const year = date.getUTCFullYear().toString();
                        console.log(`✅ Año extraído: ${year} de fecha ${dateStr} (${dataType})`);
                        return year;
                    } catch (error) {
                        console.warn(`⚠️ Error procesando fecha (${dataType}):`, error);
                        return null;
                    }
                })
                .filter((year): year is string => year !== null && year !== 'NaN' && year !== 'Invalid Date')
        ));

        console.log(`📅 Años únicos encontrados (${dataType}): [${years.join(', ')}]`);

        return years
            .sort((a, b) => parseInt(b) - parseInt(a)) // Más reciente primero
            .map(year => ({ value: year, label: year }));
    }, [tiresOperational, tiresScrapped, dataType]);

    // 🎯 OPCIONES DE MESES - CORREGIDO PARA MANEJAR AMBOS TIPOS DE DATOS CON TYPE GUARDS
    const monthOptions = useMemo(() => {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        if (!selectedYear) {
            console.log(`📅 No hay año seleccionado, mostrando todos los meses disponibles (${dataType})`);

            // Si no hay año seleccionado, mostrar todos los meses que tienen datos
            const operationalTires = Array.isArray(tiresOperational) ? tiresOperational : [];
            const scrappedTires = Array.isArray(tiresScrapped) ? tiresScrapped : [];
            const allTires = dataType === 'operativo' ? operationalTires : scrappedTires;

            const allMonths = Array.from(new Set(
                allTires
                    .filter(t => {
                        // 🎯 FILTRO DIFERENCIADO POR TIPO CON TYPE GUARDS
                        if (dataType === 'operativo') {
                            return isOperationalTire(t) && t.lastInspection?.inspectionDate;
                        } else {
                            return isScrappedTire(t) && hasScrappedTireDate(t);
                        }
                    })
                    .map(t => {
                        try {
                            // 🎯 CORRECCIÓN: Usar campo correcto según el tipo CON TYPE GUARDS
                            let dateStr = '';
                            if (dataType === 'operativo' && isOperationalTire(t)) {
                                dateStr = t.lastInspection.inspectionDate;
                            } else if (dataType === 'baja' && isScrappedTire(t)) {
                                dateStr = getScrappedTireDate(t) || '';
                            } else {
                                return null;
                            }

                            const date = new Date(dateStr);

                            if (isNaN(date.getTime())) {
                                console.warn(`⚠️ Fecha inválida para mes (${dataType}):`, dateStr);
                                return null;
                            }

                            // Usar getUTCMonth para mantener consistencia
                            return date.getUTCMonth() + 1; // getUTCMonth() retorna 0-11, necesitamos 1-12
                        } catch (error) {
                            console.warn(`⚠️ Error procesando fecha para mes (${dataType}):`, error);
                            return null;
                        }
                    })
                    .filter((month): month is number => typeof month === 'number' && month > 0 && month <= 12)
            ));

            return allMonths
                .sort((a, b) => b - a) // Más reciente primero
                .map(month => ({
                    value: month.toString(),
                    label: monthNames[month - 1] || `Mes ${month}`
                }));
        }

        // Si hay año seleccionado, mostrar solo meses de ese año
        const operationalTires = Array.isArray(tiresOperational) ? tiresOperational : [];
        const scrappedTires = Array.isArray(tiresScrapped) ? tiresScrapped : [];
        const allTires = dataType === 'operativo' ? operationalTires : scrappedTires;

        const months = Array.from(new Set(
            allTires
                .filter(t => {
                    if (dataType === 'operativo') {
                        if (!isOperationalTire(t) || !t.lastInspection?.inspectionDate) return false;
                    } else {
                        if (!isScrappedTire(t) || !hasScrappedTireDate(t)) return false;
                    }

                    try {
                        // 🎯 CORRECCIÓN: Usar campo correcto según el tipo CON TYPE GUARDS
                        let dateStr = '';
                        if (dataType === 'operativo' && isOperationalTire(t)) {
                            dateStr = t.lastInspection.inspectionDate;
                        } else if (dataType === 'baja' && isScrappedTire(t)) {
                            dateStr = getScrappedTireDate(t) || '';
                        } else {
                            return false;
                        }

                        const date = new Date(dateStr);

                        if (isNaN(date.getTime())) {
                            return false;
                        }

                        // Usar getUTCFullYear para mantener consistencia
                        return date.getUTCFullYear().toString() === selectedYear;
                    } catch (error) {
                        console.warn(`⚠️ Error filtrando fecha por año (${dataType}):`, error);
                        return false;
                    }
                })
                .map(t => {
                    try {
                        // 🎯 CORRECCIÓN: Usar campo correcto según el tipo CON TYPE GUARDS
                        let dateStr = '';
                        if (dataType === 'operativo' && isOperationalTire(t)) {
                            dateStr = t.lastInspection.inspectionDate;
                        } else if (dataType === 'baja' && isScrappedTire(t)) {
                            dateStr = getScrappedTireDate(t) || '';
                        } else {
                            return null;
                        }

                        const date = new Date(dateStr);

                        if (isNaN(date.getTime())) {
                            return null;
                        }

                        // Usar getUTCMonth para mantener consistencia
                        return date.getUTCMonth() + 1; // getUTCMonth() retorna 0-11, necesitamos 1-12
                    } catch (error) {
                        console.warn(`⚠️ Error extrayendo mes (${dataType}):`, error);
                        return null;
                    }
                })
                .filter((month): month is number => typeof month === 'number' && month > 0 && month <= 12)
        ));

        console.log(`📅 Meses encontrados para ${selectedYear} (${dataType}): [${months.join(', ')}]`);

        return months
            .sort((a, b) => b - a) // Más reciente primero
            .map(month => ({
                value: month.toString(),
                label: monthNames[month - 1] || `Mes ${month}`
            }));
    }, [tiresOperational, tiresScrapped, dataType, selectedYear]);

    // 🎯 DATOS FILTRADOS CON PROTECCIONES Y FILTROS DE FECHA
    const filteredData = useMemo(() => {
        if (!Array.isArray(histogramData)) return [];

        const filtered = histogramData.filter(d => {
            if (!d || typeof d !== 'object') return false;

            // Filtro por dimensión
            if (Array.isArray(selectedDims) && selectedDims.length > 0 && !selectedDims.includes(d.dimension)) {
                return false;
            }

            // Filtro por posición
            if (Array.isArray(selectedPositions) && selectedPositions.length > 0 && !selectedPositions.includes(d.posicion)) {
                return false;
            }

            // 🎯 FILTRO POR AÑO - CORREGIDO PARA MANEJAR FORMATO ISO
            if (selectedYear && d.fecha) {
                try {
                    const date = new Date(d.fecha);
                    if (isNaN(date.getTime())) {
                        console.warn('⚠️ Fecha inválida en filtro año:', d.fecha);
                        return false;
                    }
                    // Usar getUTCFullYear para mantener consistencia
                    const itemYear = date.getUTCFullYear().toString();
                    if (itemYear !== selectedYear) {
                        return false;
                    }
                } catch (error) {
                    console.warn('⚠️ Error procesando fecha en filtro año:', d.fecha, error);
                    return false;
                }
            }

            // 🎯 FILTRO POR MES - CORREGIDO PARA MANEJAR FORMATO ISO
            if (selectedMonth && d.fecha) {
                try {
                    const date = new Date(d.fecha);
                    if (isNaN(date.getTime())) {
                        console.warn('⚠️ Fecha inválida en filtro mes:', d.fecha);
                        return false;
                    }
                    // Usar getUTCMonth para mantener consistencia
                    const itemMonth = (date.getUTCMonth() + 1).toString();
                    if (itemMonth !== selectedMonth) {
                        return false;
                    }
                } catch (error) {
                    console.warn('⚠️ Error procesando fecha en filtro mes:', d.fecha, error);
                    return false;
                }
            }

            return true;
        });

        console.log(`🔍 Datos filtrados: ${filtered.length} de ${histogramData.length} neumáticos`);
        return filtered;
    }, [histogramData, selectedDims, selectedPositions, selectedYear, selectedMonth]);

    // 🎯 EVITAR RENDERIZADO HASTA QUE ESTÉ MONTADO
    if (!isMounted) {
        return (
            <section className="">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Inicializando histogramas...</div>
                </div>
            </section>
        );
    }

    // 🎯 MOSTRAR ERROR CRÍTICO SOLO SI NO HAY DATOS
    if (error && tiresOperational.length === 0 && tiresScrapped.length === 0) {
        return (
            <section className="">
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
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
                        📅 Año:
                    </label>
                    <Select
                        instanceId="histogram-year-select"
                        options={yearOptions}
                        value={yearOptions.find(opt => opt.value === selectedYear) || null}
                        onChange={opt => {
                            setSelectedYear(opt?.value || '');
                            setSelectedMonth(''); // Reset mes cuando cambia el año
                        }}
                        placeholder="Todos los años"
                        isClearable
                        className="text-black"
                        classNamePrefix="react-select"
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                        styles={selectStyles}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">
                        📅 Mes:
                    </label>
                    <Select
                        instanceId="histogram-month-select"
                        options={monthOptions}
                        value={monthOptions.find(opt => opt.value === selectedMonth) || null}
                        onChange={opt => setSelectedMonth(opt?.value || '')}
                        placeholder={selectedYear ? "Todos los meses" : "Selecciona año primero"}
                        isClearable
                        isDisabled={!selectedYear}
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

            {/* 🎯 BOTÓN PARA LIMPIAR FILTROS */}
            <div className="mb-4 flex gap-2 flex-wrap">
                <button
                    onClick={() => {
                        setSelectedDims([]);
                        setSelectedPositions([]);
                        setSelectedYear('');
                        setSelectedMonth('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                    🗑️ Limpiar filtros
                </button>
                <button
                    onClick={() => {
                        setSelectedYear('');
                        setSelectedMonth('');
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                    📅 Limpiar fechas
                </button>
                {(selectedYear || selectedMonth || selectedDims.length > 0 || selectedPositions.length > 0) && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        ℹ️ Filtros activos: {
                            [
                                selectedDims.length > 0 && `${selectedDims.length} dimensiones`,
                                selectedPositions.length > 0 && `${selectedPositions.length} posiciones`,
                                selectedYear && `año ${selectedYear}`,
                                selectedMonth && `mes ${monthOptions.find(m => m.value === selectedMonth)?.label}`
                            ].filter(Boolean).join(', ')
                        }
                    </span>
                )}
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
                    <strong>Filtros aplicados:</strong>
                    {selectedDims.length > 0 && ` Dimensiones: ${selectedDims.join(', ')}`}
                    {selectedPositions.length > 0 && ` | Posiciones: ${selectedPositions.join(', ')}`}
                    {selectedYear && ` | Año: ${selectedYear}`}
                    {selectedMonth && ` | Mes: ${monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth}`}
                    {!selectedDims.length && !selectedPositions.length && !selectedYear && !selectedMonth && ' Ninguno'}
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

// 🎯 HELPER: Obtener datos de procedimientos de dados de baja
function getScrappedTireData(tire: ScrappedTire) {
    if (Array.isArray(tire.procedures) && tire.procedures.length > 0) {
        const procedure = tire.procedures[0]; // Usar el primer procedimiento
        return {
            position: procedure.position,
            tireHours: procedure.tireHours,
            tireKilometers: procedure.tireKilometres, // Nota: es "tireKilometres"
            internalTread: procedure.internalTread,
            externalTread: procedure.externalTread,
            startDate: procedure.startDate,
            vehicle: procedure.vehicle
        };
    }
    return null;
}

// 🎯 HELPER: Obtener fecha de dados de baja
function getScrappedTireDate(tire: ScrappedTire): string | null {
    const scrappedData = getScrappedTireData(tire);
    return scrappedData?.startDate || null;
}

// 🎯 HELPER: Verificar si un neumático dado de baja tiene fecha válida
function hasScrappedTireDate(tire: ScrappedTire): boolean {
    const date = getScrappedTireDate(tire);
    return date !== null && date !== undefined;
}
