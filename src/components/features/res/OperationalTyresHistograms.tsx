"use client";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import Select from "react-select";

// Tipos de datos

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
    if (values.length === 0) return [];
    const max = Math.max(...values);
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

        const count = values.filter(v => v >= binStart && v < binEnd).length;
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
    const values = data.map(d => Number(d[dataKey])).filter(v => !isNaN(v));
    const histogramData = createFixedHistogram(values, binSize, dataType);

    let xAxisLabel = "";
    if (dataType === "horas") xAxisLabel = "Horas Acumuladas";
    else if (dataType === "kilometros") xAxisLabel = "Kilómetros Recorridos";
    else if (dataType === "goma") xAxisLabel = "Goma Remanente (mm)";

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
                        label={{ value: xAxisLabel, position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#666', fontSize: '12px', fontWeight: 'bold' } }}
                    />
                    <YAxis
                        stroke="#888"
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Frecuencia (cantidad de neumáticos)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666', fontSize: '12px', fontWeight: 'bold' } }}
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
    const [selectedDims, setSelectedDims] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [dataType, setDataType] = useState<'operativo' | 'baja'>('operativo');

    useEffect(() => {
        const fetchTires = async () => {
            setLoading(true);
            try {
                const [resOp, resScrap] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1/initialTread/97`)
                ]);
                const dataOp = await resOp.json();
                const dataScrap = await resScrap.json();
                setTiresOperational(dataOp);
                setTiresScrapped(dataScrap);
            } catch (error) {
                console.error("Error cargando neumáticos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTires();
    }, []);

    const histogramData: HistData[] = [
        ...(dataType === 'operativo' ? tiresOperational : []),
        ...(dataType === 'baja' ? tiresScrapped : [])
    ]
        .filter(t => t?.lastInspection?.position !== 0)
        .map(t => {
            const inspection = t.lastInspection;
            return {
                codigo: t.code,
                dimension: t.model?.dimensions || 'Desconocida',
                posicion: inspection.position.toString(),
                horas: inspection.hours,
                kilometros: inspection.kilometrage,
                gomaInterna: inspection.internalTread,
                gomaExterna: inspection.externalTread,
                fecha: new Date(inspection.inspectionDate).toISOString().split("T")[0],
            };
        });

    const dimensionOptions = Array.from(new Set(histogramData.map(d => d.dimension))).sort().map(dim => ({ value: dim, label: dim }));
    const posicionOptions = Array.from(new Set(histogramData.map(d => d.posicion))).sort((a, b) => parseInt(a) - parseInt(b)).map(pos => ({ value: pos, label: `Posición ${pos}` }));

    const filteredData = histogramData.filter(d => {
        if (selectedDims.length > 0 && !selectedDims.includes(d.dimension)) return false;
        if (selectedPositions.length > 0 && !selectedPositions.includes(d.posicion)) return false;
        return true;
    });

    return (
        <section className="my-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Histogramas de Frecuencia</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">Dimensión:</label>
                    <Select
                        isMulti
                        options={dimensionOptions}
                        value={dimensionOptions.filter(opt => selectedDims.includes(opt.value))}
                        onChange={opts => setSelectedDims(opts?.map(o => o.value) || [])}
                        placeholder="Todas las dimensiones"
                        className="text-black"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">Posición:</label>
                    <Select
                        isMulti
                        options={posicionOptions}
                        value={posicionOptions.filter(opt => selectedPositions.includes(opt.value))}
                        onChange={opts => setSelectedPositions(opts?.map(o => o.value) || [])}
                        placeholder="Todas las posiciones"
                        className="text-black"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">Tipo de neumático:</label>
                    <select
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value as 'operativo' | 'baja')}
                        className="p-2 rounded text-sm bg-white border dark:bg-neutral-800 dark:text-white dark:border-neutral-600 w-full"
                    >
                        <option value="operativo">Operativos</option>
                        <option value="baja">Dados de baja</option>
                    </select>
                </div>
            </div>

            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Datos analizados:</strong> {filteredData.length} neumáticos.
                </p>
            </div>

            {loading ? (
                <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
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
