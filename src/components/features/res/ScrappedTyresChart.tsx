"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import Select from "react-select";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

interface Procedure {
  endDate: string;
  tireHours: number;
  tireKilometres: number;
  vehicle?: {
    model: {
      brand: string;
      model: string;
    };
  };
}

interface ScrappedTire {
  id: number;
  model: {
    dimensions: string;
    pattern: string;
  };
  procedures: Procedure[];
}

interface ChartPoint {
  mes: string;
  promedioKm: number;
  promedioHrs: number;
  count: number;
}

type ViewType = "km" | "hrs" | "both";

interface Filters {
  year: number;
  dimension: string | null;
  pattern: string | null;
  fleet: string | null;
  view: ViewType;
}

// 🎯 TOOLTIP MEJORADO
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as ChartPoint;

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-3 rounded shadow text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
        {label}
      </p>
      <div className="space-y-1">
        <p className="text-blue-600 dark:text-blue-400">
          <span className="font-medium">Km promedio:</span> {data.promedioKm.toLocaleString()}
        </p>
        <p className="text-orange-600 dark:text-orange-400">
          <span className="font-medium">Horas promedio:</span> {data.promedioHrs.toLocaleString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">Neumáticos:</span> {data.count}
        </p>
        <p className="text-green-600 dark:text-green-400">
          <span className="font-medium">Km/Hora:</span> {(data.promedioKm / data.promedioHrs).toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default function ScrappedTyresChart() {
  const [tires, setTires] = useState<ScrappedTire[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    year: new Date().getFullYear(),
    dimension: null,
    pattern: null,
    fleet: null,
    view: "both",
  });
  const [metaKm, setMetaKm] = useState<number | null>(null);
  const [metaHrs, setMetaHrs] = useState<number | null>(null);

  // 🎯 FETCH CON LOADING
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/scrapped/site/1`);
        const data = await response.json();
        setTires(data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 DATOS FILTRADOS PRIMERO (para opciones inteligentes)
  const filteredTires = useMemo(() => {
    return tires.filter((tire) => {
      const lastProc = tire.procedures?.[tire.procedures.length - 1];
      if (!lastProc || !lastProc.endDate) return false;

      const year = new Date(lastProc.endDate).getFullYear();
      if (year !== filters.year) return false;

      if (filters.dimension && tire.model.dimensions !== filters.dimension) return false;
      if (filters.pattern && tire.model.pattern !== filters.pattern) return false;

      const brand = lastProc.vehicle?.model?.brand;
      const model = lastProc.vehicle?.model?.model;
      const fleet = brand && model ? `${brand} ${model}` : null;
      if (filters.fleet && fleet !== filters.fleet) return false;

      return true;
    });
  }, [tires, filters]);

  // 🎯 DATOS DEL GRÁFICO
  const chartData: ChartPoint[] = useMemo(() => {
    const result: Record<string, { km: number; hrs: number; count: number }> = {};

    filteredTires.forEach((tire) => {
      const lastProc = tire.procedures?.[tire.procedures.length - 1];
      if (!lastProc || !lastProc.endDate) return;

      const mesKey = dayjs(lastProc.endDate).format("MMMM");

      if (!result[mesKey]) result[mesKey] = { km: 0, hrs: 0, count: 0 };

      result[mesKey].km += lastProc.tireKilometres || 0;
      result[mesKey].hrs += lastProc.tireHours || 0;
      result[mesKey].count++;
    });

    return Object.entries(result)
      .map(([mes, val]) => ({
        mes: mes.charAt(0).toUpperCase() + mes.slice(1),
        promedioKm: val.count ? Math.round(val.km / val.count) : 0,
        promedioHrs: val.count ? Math.round(val.hrs / val.count) : 0,
        count: val.count,
      }))
      .sort((a, b) => {
        const months = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const monthA = months.findIndex(m => m.toLowerCase() === a.mes.toLowerCase());
        const monthB = months.findIndex(m => m.toLowerCase() === b.mes.toLowerCase());
        return monthA - monthB;
      });
  }, [filteredTires]);

  // 🎯 OPCIONES INTELIGENTES (solo valores que generan datos)
  const options = useMemo(() => {
    const years = new Set<number>();
    const dimensions = new Set<string>();
    const patterns = new Set<string>();
    const fleets = new Set<string>();

    // Solo incluir valores que generan datos en el año seleccionado
    tires.forEach((tire) => {
      const lastProc = tire.procedures?.[tire.procedures.length - 1];
      if (!lastProc || !lastProc.endDate) return;

      const year = new Date(lastProc.endDate).getFullYear();

      // Siempre incluir años
      years.add(year);

      // Solo incluir otros filtros si coinciden con el año actual
      if (year === filters.year) {
        if (tire.model?.dimensions) dimensions.add(tire.model.dimensions);
        if (tire.model?.pattern) patterns.add(tire.model.pattern);

        const brand = lastProc.vehicle?.model?.brand;
        const model = lastProc.vehicle?.model?.model;
        if (brand && model) fleets.add(`${brand} ${model}`);
      }
    });

    // Filtrar además por los filtros ya aplicados
    const availableDimensions = new Set<string>();
    const availablePatterns = new Set<string>();
    const availableFleets = new Set<string>();

    tires.forEach((tire) => {
      const lastProc = tire.procedures?.[tire.procedures.length - 1];
      if (!lastProc || !lastProc.endDate) return;

      const year = new Date(lastProc.endDate).getFullYear();
      if (year !== filters.year) return;

      // Aplicar filtros progresivamente
      let include = true;
      if (filters.dimension && tire.model.dimensions !== filters.dimension) include = false;
      if (filters.pattern && tire.model.pattern !== filters.pattern) include = false;

      const brand = lastProc.vehicle?.model?.brand;
      const model = lastProc.vehicle?.model?.model;
      const fleet = brand && model ? `${brand} ${model}` : null;
      if (filters.fleet && fleet !== filters.fleet) include = false;

      if (include) {
        if (tire.model?.dimensions) availableDimensions.add(tire.model.dimensions);
        if (tire.model?.pattern) availablePatterns.add(tire.model.pattern);
        if (fleet) availableFleets.add(fleet);
      }
    });

    return {
      years: [...years].sort((a, b) => b - a), // Más recientes primero
      dimensions: [...(filters.dimension ? dimensions : availableDimensions)].sort(),
      patterns: [...(filters.pattern ? patterns : availablePatterns)].sort(),
      fleets: [...(filters.fleet ? fleets : availableFleets)].sort(),
    };
  }, [tires, filters]);

  // 🎯 FUNCIÓN PARA RENDERIZAR GRÁFICO
  const renderChart = (config: {
    yKey: "promedioKm" | "promedioHrs";
    yLabel: string;
    barColor: string;
    meta: number | null;
  }) => (
    <div className="bg-white dark:bg-[#313131] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-center dark:text-white">
        {config.yLabel}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="mes"
            stroke="#6B7280"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
            label={{
              value: 'Mes',
              position: 'insideBottom',
              offset: -5,
              style: { textAnchor: 'middle', fill: '#6B7280', fontSize: '12px' }
            }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
            label={{
              value: config.yLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#6B7280", fontSize: "12px", fontWeight: "bold" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey={config.yKey} fill={config.barColor} radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="count"
              position="top"
              fill="#6B7280"
              fontSize={10}
              formatter={(value: number) => `(${value})`}
            />
          </Bar>
          {config.meta && (
            <ReferenceLine
              y={config.meta}
              stroke="#EF4444"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                position: "top",
                value: `Meta: ${config.meta.toLocaleString()}`,
                fill: "#EF4444",
                fontSize: 12,
                fontWeight: "bold"
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (loading) {
    return (
      <section className="my-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  const totalTires = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="my-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">
        Rendimiento de Neumáticos Dados de Baja
      </h2>

      {/* 🎯 FILTROS INTELIGENTES */}
      <div className="bg-white dark:bg-[#313131] p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block mb-2 text-sm font-semibold dark:text-white">Año:</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters((f) => ({ ...f, year: +e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {options.years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            {/* 🎯 REMOVIDO: {options.dimensions.length > 0 && `(${options.dimensions.length})`} */}
            <label className="block mb-2 text-sm font-semibold dark:text-white">
              Dimensión:
            </label>
            <Select
              options={options.dimensions.map((d) => ({ value: d, label: d }))}
              isClearable
              value={filters.dimension ? { value: filters.dimension, label: filters.dimension } : null}
              onChange={(e) => setFilters((f) => ({ ...f, dimension: e?.value ?? null }))}
              placeholder={options.dimensions.length > 0 ? "Todas" : "Sin opciones"}
              isDisabled={options.dimensions.length === 0}
              className="text-black"
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
              }}
            />
          </div>

          <div>
            {/* 🎯 REMOVIDO: {options.patterns.length > 0 && `(${options.patterns.length})`} */}
            <label className="block mb-2 text-sm font-semibold dark:text-white">
              Patrón:
            </label>
            <Select
              options={options.patterns.map((p) => ({ value: p, label: p }))}
              isClearable
              value={filters.pattern ? { value: filters.pattern, label: filters.pattern } : null}
              onChange={(e) => setFilters((f) => ({ ...f, pattern: e?.value ?? null }))}
              placeholder={options.patterns.length > 0 ? "Todos" : "Sin opciones"}
              isDisabled={options.patterns.length === 0}
              className="text-black"
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
              }}
            />
          </div>

          <div>
            {/* 🎯 REMOVIDO: {options.fleets.length > 0 && `(${options.fleets.length})`} */}
            <label className="block mb-2 text-sm font-semibold dark:text-white">
              Flota:
            </label>
            <Select
              options={options.fleets.map((f) => ({ value: f, label: f }))}
              isClearable
              value={filters.fleet ? { value: filters.fleet, label: filters.fleet } : null}
              onChange={(e) => setFilters((f) => ({ ...f, fleet: e?.value ?? null }))}
              placeholder={options.fleets.length > 0 ? "Todas" : "Sin opciones"}
              isDisabled={options.fleets.length === 0}
              className="text-black"
              styles={{
                control: (base) => ({ ...base, minHeight: '48px' }),
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold dark:text-white">Vista:</label>
            <select
              value={filters.view}
              onChange={(e) => setFilters((f) => ({ ...f, view: e.target.value as ViewType }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">Ambos Gráficos</option>
              <option value="km">Solo Kilómetros</option>
              <option value="hrs">Solo Horas</option>
            </select>
          </div>
        </div>

        {/* 🎯 METAS CONDICIONALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(filters.view === "both" || filters.view === "km") && (
            <div>
              <label className="block mb-2 text-sm font-semibold dark:text-white">
                Meta Kilómetros:
              </label>
              <input
                type="number"
                value={metaKm ?? ""}
                onChange={(e) => setMetaKm(Number(e.target.value) || null)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 75000"
              />
            </div>
          )}

          {(filters.view === "both" || filters.view === "hrs") && (
            <div>
              <label className="block mb-2 text-sm font-semibold dark:text-white">
                Meta Horas:
              </label>
              <input
                type="number"
                value={metaHrs ?? ""}
                onChange={(e) => setMetaHrs(Number(e.target.value) || null)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 5200"
              />
            </div>
          )}
        </div>

        {/* 🎯 INFO DE DATOS */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Analizando:</span> {totalTires} neumáticos en {filters.year}
            </div>
            <div className="text-blue-600 dark:text-blue-300">
              {filters.dimension && `• ${filters.dimension} `}
              {filters.pattern && `• ${filters.pattern} `}
              {filters.fleet && `• ${filters.fleet}`}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 GRÁFICOS CON ANCHO DINÁMICO */}
      {totalTires > 0 ? (
        <div className={`grid gap-6 ${filters.view === "both"
          ? "grid-cols-1 lg:grid-cols-2"
          : "grid-cols-1"  // 🎯 Una sola columna = ancho completo
          }`}>
          {(filters.view === "both" || filters.view === "km") &&
            renderChart({
              yKey: "promedioKm",
              yLabel: "Rendimiento Promedio (Kilómetros)",
              barColor: "#3B82F6",
              meta: metaKm,
            })}
          {(filters.view === "both" || filters.view === "hrs") &&
            renderChart({
              yKey: "promedioHrs",
              yLabel: "Rendimiento Promedio (Horas)",
              barColor: "#F59E0B",
              meta: metaHrs,
            })}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No hay datos disponibles para los filtros seleccionados 📊
          </p>
        </div>
      )}
    </section>
  );
}
