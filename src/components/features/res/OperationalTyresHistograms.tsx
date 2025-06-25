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

// Definición de los tipos de datos que se reciben del backend
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

// Tipo para cada bin del histograma
type HistogramBin = {
    bin: string;
    count: number;
    binStart: number;
    binEnd: number;
};

// Tooltip personalizado para los histogramas
const CustomHistogramTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm text-black dark:text-white">
                <p><strong>Rango:</strong> {data.bin}</p>
                <p><strong>Frecuencia:</strong> {data.count}</p>
            </div>
        );
    }
    return null;
};

// Función para generar datos de histograma a partir de un arreglo de números
function createHistogram(values: number[], numBins: number = 10): HistogramBin[] {
    if (values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / numBins || 1; // evitar division por cero
    const bins: HistogramBin[] = [];

    for (let i = 0; i < numBins; i++) {
        const binStart = min + i * binSize;
        // En el último bin, incluimos el máximo
        const binEnd = (i === numBins - 1) ? max : binStart + binSize;
        const label = `${binStart.toFixed(1)} - ${binEnd.toFixed(1)}`;
        const count = values.filter(v => {
            // Incluir el valor máximo solo en el último bin
            if (i === numBins - 1) return v >= binStart && v <= binEnd;
            return v >= binStart && v < binEnd;
        }).length;
        bins.push({ bin: label, count, binStart, binEnd });
    }
    return bins;
}

// Función para renderizar un histograma dado el campo (dataKey), etiqueta, color y datos filtrados
const renderHistogram = (
    data: HistData[],
    dataKey: keyof HistData,
    label: string,
    color: string
) => {
    // Extraer los valores numéricos correspondientes al dataKey
    const values: number[] = data.map(d => Number(d[dataKey]));
    const histogramData = createHistogram(values, 10);

    return (
        <div className="w-full h-[300px] bg-white dark:bg-[#313131] p-4 rounded-md shadow">
            <h3 className="text-md font-semibold dark:text-white mb-2">{label}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" stroke="#888" />
                    <YAxis stroke="#888" allowDecimals={false} />
                    <Tooltip content={<CustomHistogramTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill={color} name={label} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function OperationalTyresHistograms() {
    const [tires, setTires] = useState<OperationalTire[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDims, setSelectedDims] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

    useEffect(() => {
        const fetchTires = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`);
                const data = await res.json();
                setTires(data);
            } catch (error) {
                console.error("Error cargando neumáticos operativos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTires();
    }, []);

    // Transformamos los datos a un formato más manejable para las gráficas
    const histogramData: HistData[] = tires.map(t => ({
        codigo: t.code,
        dimension: t.model.dimensions,
        posicion: t.lastInspection.position.toString(),
        horas: t.lastInspection.hours,
        kilometros: t.lastInspection.kilometrage,
        gomaInterna: t.lastInspection.internalTread,
        gomaExterna: t.lastInspection.externalTread,
        fecha: new Date(t.lastInspection.inspectionDate).toISOString().split("T")[0],
    }));

    // Opciones de filtro para dimensión y posición
    const dimensionOptions = Array.from(new Set(histogramData.map(d => d.dimension)))
        .map(dim => ({ value: dim, label: dim }));
    const posicionOptions = Array.from(new Set(histogramData.map(d => d.posicion)))
        .map(pos => ({ value: pos, label: `Posición ${pos}` }));

    const filteredData = histogramData.filter(d =>
        (selectedDims.length === 0 || selectedDims.includes(d.dimension)) &&
        (selectedPositions.length === 0 || selectedPositions.includes(d.posicion))
    );

    return (
        <section className="my-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Histogramas de Últimos Chequeos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">
                        Filtrar por Dimensión:
                    </label>
                    <Select
                        isMulti
                        options={dimensionOptions}
                        value={dimensionOptions.filter(opt => selectedDims.includes(opt.value))}
                        onChange={opts => setSelectedDims(opts.map(o => o.value))}
                        placeholder="Selecciona dimensiones..."
                        className="text-black"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-sm dark:text-white">
                        Filtrar por Posición:
                    </label>
                    <Select
                        isMulti
                        options={posicionOptions}
                        value={posicionOptions.filter(opt => selectedPositions.includes(opt.value))}
                        onChange={opts => setSelectedPositions(opts.map(o => o.value))}
                        placeholder="Selecciona posiciones..."
                        className="text-black"
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-gray-600 dark:text-gray-300">Cargando datos...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderHistogram(filteredData, "horas", "Duración en Horas", "#4F46E5")}
                    {renderHistogram(filteredData, "kilometros", "Kilómetros Recorridos", "#10B981")}
                    {renderHistogram(filteredData, "gomaInterna", "Goma Remanente Interna (mm)", "#F59E0B")}
                    {renderHistogram(filteredData, "gomaExterna", "Goma Remanente Externa (mm)", "#EF4444")}
                </div>
            )}
        </section>
    );
}
