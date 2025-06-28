"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, PieChart, Pie, Cell } from "recharts";

interface Tire {
  id: number;
  code: string;
  model: {
    dimensions: string;
    pattern: string;
  };
  lastInspection: {
    pressure: number | null;
    temperature: number | null;
    internalTread: number;
    externalTread: number;
  };
  modelId: number;
  installedTires: {
    vehicle: {
      modelId: number;
      model?: { model: string };
    };
    position: number;
  }[];
}

const colors = {
  normal: "#10B981",
  alerta: "#F59E0B",
  critico: "#EF4444",
};

const posiciones = {
  1: "Delantera Izq.",
  2: "Delantera Der.",
  3: "Trasera Izq.",
  4: "Trasera Der.",
  5: "Centro Izq.",
  6: "Centro Der.",
};

export default function OperationalTiresDiagnostics() {
  const [tires, setTires] = useState<Tire[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [minTread, setMinTread] = useState<number>(20);

  // Umbrales editables
  const [thresholds, setThresholds] = useState({
    minPressure: 110,
    maxPressure: 160,
    maxTemp: 79,
    maxTreadDiff: 5,
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
      .then(res => res.json())
      .then(setTires)
      .catch(err => console.error("Error cargando neumáticos:", err));
  }, []);

  const processedData = useMemo(() => {
    return tires
      .filter(t =>
        (!selectedDimension || t.model?.dimensions === selectedDimension) &&
        (!selectedModel || t.installedTires.some(i => i.vehicle.model?.model === selectedModel))
      )
      .map(t => {
        const treadDiff = Math.abs(t.lastInspection.internalTread - t.lastInspection.externalTread);
        const treadAvg = (t.lastInspection.internalTread + t.lastInspection.externalTread) / 2;
        const status = [];

        if (t.lastInspection.pressure !== null) {
          if (t.lastInspection.pressure < thresholds.minPressure) status.push("Subpresión");
          if (t.lastInspection.pressure > thresholds.maxPressure) status.push("Sobrepresión");
        }

        if (t.lastInspection.temperature !== null && t.lastInspection.temperature > thresholds.maxTemp) {
          status.push("Temperatura Alta");
        }

        if (treadDiff > thresholds.maxTreadDiff) {
          status.push("Desgaste Desparejo");
        }

        if (treadAvg < minTread) {
          status.push("Goma Baja");
        }

        const criticality =
          status.includes("Goma Baja") || status.includes("Temperatura Alta") ? "Crítico" :
            status.length > 0 ? "Alerta" :
              "Normal";

        return {
          code: t.code,
          dimension: t.model?.dimensions,
          model: t.installedTires[0]?.vehicle.model?.model || "Desconocido",
          pressure: t.lastInspection.pressure,
          temperature: t.lastInspection.temperature,
          treadAvg,
          treadDiff,
          criticality,
          status: status.join(", ") || "Sin alertas",
        };
      });
  }, [tires, selectedDimension, selectedModel, thresholds, minTread]);

  const grouped = useMemo(() => {
    const counts = { Normal: 0, Alerta: 0, Crítico: 0 };
    processedData.forEach(t => counts[t.criticality as keyof typeof counts]++);
    return [
      { name: "Normal", value: counts.Normal },
      { name: "Alerta", value: counts.Alerta },
      { name: "Crítico", value: counts.Crítico },
    ];
  }, [processedData]);

  const uniqueDimensions = Array.from(new Set(tires.map(t => t.model?.dimensions).filter(Boolean)));
  const uniqueModels = Array.from(new Set(tires.flatMap(t => t.installedTires.map(i => i.vehicle.model?.model)).filter(Boolean)));

  return (
    <section className="p-4 space-y-6">
      <h2 className="text-xl font-bold">🔍 Diagnóstico Avanzado de Neumáticos Operativos</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold">Dimensión:</label>
          <Select
            options={uniqueDimensions.map(d => ({ value: d, label: d }))}
            isClearable
            placeholder="Todas"
            onChange={e => setSelectedDimension(e?.value || null)}
            className="text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Modelo Vehículo:</label>
          <Select
            options={uniqueModels.map(m => ({ value: m, label: m }))}
            isClearable
            placeholder="Todos"
            onChange={e => setSelectedModel(e?.value || null)}
            className="text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Mínimo Goma (mm):</label>
          <input
            type="number"
            value={minTread}
            onChange={e => setMinTread(Number(e.target.value))}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Temperatura Máx. °C:</label>
          <input
            type="number"
            value={thresholds.maxTemp}
            onChange={e => setThresholds({ ...thresholds, maxTemp: Number(e.target.value) })}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="treadDiff" fill="#3B82F6" name="Diferencia Goma (mm)">
              <LabelList dataKey="code" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={grouped} dataKey="value" nameKey="name" outerRadius={100} label>
              {grouped.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.name.toLowerCase() as keyof typeof colors]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Código</th>
              <th className="p-2">Dimensión</th>
              <th className="p-2">Modelo</th>
              <th className="p-2">Presión</th>
              <th className="p-2">Temp.</th>
              <th className="p-2">Prom. Goma</th>
              <th className="p-2">Diff. Goma</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map(t => (
              <tr key={t.code} className="border-t">
                <td className="p-2">{t.code}</td>
                <td className="p-2">{t.dimension}</td>
                <td className="p-2">{t.model}</td>
                <td className="p-2">{t.pressure ?? "-"}</td>
                <td className="p-2">{t.temperature ?? "-"}</td>
                <td className="p-2">{t.treadAvg.toFixed(1)}</td>
                <td className="p-2">{t.treadDiff.toFixed(1)}</td>
                <td className={`p-2 font-semibold ${t.criticality === "Crítico" ? "text-red-600" : t.criticality === "Alerta" ? "text-yellow-600" : "text-green-600"}`}>
                  {t.criticality}
                </td>
                <td className="p-2">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
