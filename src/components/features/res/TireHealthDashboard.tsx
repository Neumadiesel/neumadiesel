"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis } from "recharts";

interface Tire {
  code: string;
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

export default function TireHealthDashboard() {
  const [tires, setTires] = useState<Tire[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
      .then(res => res.json())
      .then(setTires)
      .catch(err => console.error("Error cargando neumáticos:", err));
  }, []);

  const processedData = useMemo(() => {
    return tires
      .filter(t =>
        (!selectedDimension || t.model.dimensions === selectedDimension) &&
        (!selectedModel || t.installedTires.some(i => i.vehicle.model === selectedModel)) &&
        (!selectedPosition || t.installedTires.some(i => i.position === selectedPosition))
      )
      .map(t => {
        const { pressure, temperature, internalTread, externalTread } = t.lastInspection;
        const position = t.installedTires[0]?.position;

        const treadDiff = Math.abs(internalTread - externalTread);
        const minTread = Math.min(internalTread, externalTread);

        let status = "Normal";
        let action = "Sin acción";

        if (treadDiff > 10) {
          status = "Crítico";
          action = "Reemplazo inmediato";
        } else if (treadDiff > 6) {
          status = "Alerta";
          action = "Rotar neumático";
        }

        if (minTread <= 10) {
          status = "Crítico";
          action = "Reemplazo por desgaste";
        } else if (minTread <= 20 && status !== "Crítico") {
          status = "Alerta";
          action = "Planificar cambio";
        }

        if (pressure !== null) {
          if (position === 1 || position === 2) {
            if (pressure < 116 || pressure > 150) {
              if (status !== "Crítico") {
                status = "Alerta";
                action = "Verificar presión";
              }
            }
          } else {
            if (pressure < 105 || pressure > 140) {
              if (status !== "Crítico") {
                status = "Alerta";
                action = "Verificar presión";
              }
            }
          }
        }

        if (temperature !== null) {
          if (temperature >= 85) {
            status = "Crítico";
            action = "Reemplazo por sobrecalentamiento";
          } else if (temperature >= 75 && status !== "Crítico") {
            status = "Alerta";
            action = "Revisar temperatura";
          }
        }

        return {
          code: t.code,
          dimension: t.model.dimensions,
          model: t.installedTires[0]?.vehicle.model || "Desconocido",
          position,
          pressure,
          temperature,
          treadDiff,
          minTread,
          status,
          action,
          internalTread,
          externalTread,
        };
      });
  }, [tires, selectedDimension, selectedModel, selectedPosition]);

  const criticos = processedData.filter(t => t.status === "Crítico").length;
  const diferenciaGomaAlta = processedData.filter(t => t.treadDiff > 6).length;

  const desgastePorPosicion: { [pos: number]: number[] } = {};
  processedData.forEach(t => {
    if (!desgastePorPosicion[t.position]) desgastePorPosicion[t.position] = [];
    desgastePorPosicion[t.position].push(t.minTread);
  });

  const promedioPorPosicion = Object.entries(desgastePorPosicion).map(([pos, values]) => ({
    posicion: pos,
    promedio: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }));

  const uniqueDimensions = Array.from(new Set(tires.map(t => t.model.dimensions)));
  const uniqueModels = Array.from(new Set(tires.flatMap(t => t.installedTires.map(i => i.vehicle.model))));
  const uniquePositions = Array.from(new Set(tires.flatMap(t => t.installedTires.map(i => i.position))));

  return (
    <section className="space-y-6 p-4">
      <h2 className="text-xl font-bold">📊 Panel de Salud de Neumáticos Operativos OTR</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm">Dimensión:</label>
          <Select
            options={uniqueDimensions.map(d => ({ value: d, label: d }))}
            isClearable
            onChange={e => setSelectedDimension(e?.value || null)}
          />
        </div>
        <div>
          <label className="block text-sm">Modelo vehículo:</label>
          <Select
            options={uniqueModels.map(m => ({ value: m, label: m }))}
            isClearable
            onChange={e => setSelectedModel(e?.value || null)}
          />
        </div>
        <div>
          <label className="block text-sm">Posición:</label>
          <Select
            options={uniquePositions.map(p => ({ value: p, label: `Posición ${p}` }))}
            isClearable
            onChange={e => setSelectedPosition(e?.value || null)}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-emerald-500 text-white rounded">
          <h3>Diferencia Goma {'>'}6mm</h3>
          <p className="text-2xl">{diferenciaGomaAlta}</p>
        </div>
        <div className="p-4 bg-red-500 text-white rounded">
          <h3>Neumáticos Críticos</h3>
          <p className="text-2xl">{criticos}</p>
        </div>
        <div className="p-4 bg-indigo-500 text-white rounded">
          <h3>Desgaste Promedio por Posición</h3>
          {promedioPorPosicion.map(d => (
            <p key={d.posicion}>Posición {d.posicion}: {d.promedio} mm</p>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Scatter Temperatura vs Presión */}
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="pressure" name="Presión" unit="psi" />
            <YAxis type="number" dataKey="temperature" name="Temperatura" unit="°C" />
            <Tooltip
              formatter={(value) => (value ?? "Sin dato")}
              labelFormatter={(label, payload) =>
                payload[0] ? `Código: ${payload[0].payload.code}` : ""
              }
            />
            <Scatter
              data={processedData}
              fill="#3B82F6"
              name="Temperatura / Presión"
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Scatter Desgaste Interno vs Externo */}
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="internalTread" name="Goma Interna" unit="mm" />
            <YAxis type="number" dataKey="externalTread" name="Goma Externa" unit="mm" />
            <Tooltip
              formatter={(value) => (value ?? "Sin dato")}
              labelFormatter={(label, payload) =>
                payload[0] ? `Código: ${payload[0].payload.code}` : ""
              }
            />
            <Scatter
              data={processedData}
              fill="#6366F1"
              name="Desgaste"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla (comentada) */}
      {/*
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Código</th>
              <th className="p-2">Dimensión</th>
              <th className="p-2">Modelo</th>
              <th className="p-2">Posición</th>
              <th className="p-2">Presión</th>
              <th className="p-2">Temp.</th>
              <th className="p-2">Diff. Goma</th>
              <th className="p-2">Min. Goma</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {processedData.filter(t => t.status === "Crítico").map(t => (
              <tr key={t.code} className="border-t">
                <td className="p-2">{t.code}</td>
                <td className="p-2">{t.dimension}</td>
                <td className="p-2">{t.model}</td>
                <td className="p-2">{t.position}</td>
                <td className="p-2">{t.pressure ?? "-"}</td>
                <td className="p-2">{t.temperature ?? "-"}</td>
                <td className="p-2">{t.treadDiff}</td>
                <td className="p-2">{t.minTread}</td>
                <td className={`p-2 font-semibold ${t.status === "Crítico" ? "text-red-600" : "text-yellow-600"}`}>
                  {t.status}
                </td>
                <td className="p-2">{t.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      */}
    </section>
  );
}