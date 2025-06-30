"use client";

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
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const [tires, setTires] = useState<Tire[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    // Cargar neumáticos desde el endpoint operacional
    authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
      .then(res => res.json())
      .then(setTires)
      .catch(err => console.error("Error cargando neumáticos:", err));
  }, []);

  useEffect(() => {
    // Cargar neumáticos desde el endpoint operacional
    authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
      .then(res => res.json())
      .then(setTires)
      .catch(err => console.error("Error cargando neumáticos:", err));
  }, [user]);

  // Función para obtener color por posición
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

  // Función para obtener nombre de posición
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

  const criticos = processedData.filter(t => t.status === "Crítico").length;
  const desgasteIrregular = processedData.filter(t => t.treadDiff > 6).length;

  // Análisis de temperatura
  const temperaturaAlta = processedData.filter(t => t.temperature >= 75).length;
  const temperaturaBaja = processedData.filter(t => t.temperature > 0 && t.temperature < 40).length;

  // Análisis de presión separado por alta y baja
  const presionAlta = processedData.filter(t => {
    if (t.pressure <= 0) return false;
    const position = t.position;
    if (position === 1 || position === 2) { // Delanteras
      return t.pressure > 150;
    } else { // Traseras
      return t.pressure > 140;
    }
  }).length;

  const presionBaja = processedData.filter(t => {
    if (t.pressure <= 0) return false;
    const position = t.position;
    if (position === 1 || position === 2) { // Delanteras
      return t.pressure < 116;
    } else { // Traseras
      return t.pressure < 105;
    }
  }).length;

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

  // Crear listas específicas para cada tarjeta - REDISEÑADAS
  const neumaticosEspecificos = useMemo(() => {
    return {
      criticos: processedData.filter(t => t.status === "Crítico").map(t => ({
        code: t.code,
        motivo: t.action,
        positionName: t.positionName,
        priority: 'Crítico'
      })),
      desgasteIrregular: processedData.filter(t => t.treadDiff > 6).map(t => ({
        code: t.code,
        motivo: `Diferencia: ${t.treadDiff.toFixed(1)}mm`,
        positionName: t.positionName,
        details: `${t.internalTread}mm / ${t.externalTread}mm`
      })),
      temperaturaAlta: processedData.filter(t => t.temperature >= 75).map(t => ({
        code: t.code,
        motivo: `${t.temperature}°C`,
        positionName: t.positionName,
        type: 'Alta'
      })),
      temperaturaBaja: processedData.filter(t => t.temperature > 0 && t.temperature < 40).map(t => ({
        code: t.code,
        motivo: `${t.temperature}°C`,
        positionName: t.positionName,
        type: 'Baja'
      })),
      presionAlta: processedData.filter(t => {
        if (t.pressure <= 0) return false;
        const position = t.position;
        if (position === 1 || position === 2) {
          return t.pressure > 150;
        } else {
          return t.pressure > 140;
        }
      }).map(t => ({
        code: t.code,
        motivo: `${t.pressure} PSI`,
        positionName: t.positionName,
        type: 'Alta'
      })),
      presionBaja: processedData.filter(t => {
        if (t.pressure <= 0) return false;
        const position = t.position;
        if (position === 1 || position === 2) {
          return t.pressure < 116;
        } else {
          return t.pressure < 105;
        }
      }).map(t => ({
        code: t.code,
        motivo: `${t.pressure} PSI`,
        positionName: t.positionName,
        type: 'Baja'
      }))
    };
  }, [processedData]);

  const uniqueDimensions = Array.from(new Set(tires.map(t => t.model.dimensions)));

  const uniquePositions = Array.from(new Set(tires.flatMap(t => t.installedTires.map(i => i.position)))).sort((a, b) => a - b);

  return (
    <section className="space-y-6 mt-6 bg-white dark:bg-[#212121] min-h-screen">

      {/* KPIs Rediseñados - Vista más elegante */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Neumáticos Críticos */}
        <div
          className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'criticos' ? null : 'criticos')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🚨</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{criticos}</div>
                <div className="text-xs opacity-90">Críticos</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Estado Crítico</h3>
            <p className="text-xs opacity-80">Acción inmediata</p>
          </div>
        </div>

        {/* Desgaste Irregular */}
        <div
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'desgaste' ? null : 'desgaste')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">⚖️</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{desgasteIrregular}</div>
                <div className="text-xs opacity-90">Irregulares</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Desgaste Irregular</h3>
            <p className="text-xs opacity-80">Diferencia {'>'} 6mm</p>
          </div>
        </div>

        {/* Temperatura Alta */}
        <div
          className="bg-gradient-to-br from-red-400 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'temp-alta' ? null : 'temp-alta')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">🔥</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{temperaturaAlta}</div>
                <div className="text-xs opacity-90">Temp. Alta</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Temperatura Alta</h3>
            <p className="text-xs opacity-80">≥75°C</p>
          </div>
        </div>

        {/* Temperatura Baja */}
        <div
          className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'temp-baja' ? null : 'temp-baja')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">❄️</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{temperaturaBaja}</div>
                <div className="text-xs opacity-90">Temp. Baja</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Temperatura Baja</h3>
            <p className="text-xs opacity-80">{'<'}40°C</p>
          </div>
        </div>

        {/* Presión Alta */}
        <div
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'presion-alta' ? null : 'presion-alta')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">📈</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{presionAlta}</div>
                <div className="text-xs opacity-90">Presión Alta</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Presión Alta</h3>
            <p className="text-xs opacity-80">Sobre límite</p>
          </div>
        </div>

        {/* Presión Baja */}
        <div
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'presion-baja' ? null : 'presion-baja')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">�</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{presionBaja}</div>
                <div className="text-xs opacity-90">Presión Baja</div>
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1">Presión Baja</h3>
            <p className="text-xs opacity-80">Bajo límite</p>
          </div>
        </div>
      </div>

      {/* Modal para mostrar detalles */}
      {expandedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {expandedCard === 'criticos' && '🚨 Neumáticos Críticos'}
                  {expandedCard === 'desgaste' && '⚖️ Desgaste Irregular'}
                  {expandedCard === 'temp-alta' && '🔥 Temperatura Alta'}
                  {expandedCard === 'temp-baja' && '❄️ Temperatura Baja'}
                  {expandedCard === 'presion-alta' && '� Presión Alta'}
                  {expandedCard === 'presion-baja' && '📉 Presión Baja'}
                </h3>
                <button
                  onClick={() => setExpandedCard(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {expandedCard === 'criticos' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.criticos.length > 0 ? (
                    neumaticosEspecificos.criticos.map((neumatico, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-red-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.priority}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">{neumatico.motivo}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay neumáticos críticos
                    </div>
                  )}
                </div>
              )}

              {expandedCard === 'desgaste' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.desgasteIrregular.length > 0 ? (
                    neumaticosEspecificos.desgasteIrregular.map((neumatico, index) => (
                      <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-orange-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.motivo}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">Gomas: {neumatico.details}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay desgaste irregular
                    </div>
                  )}
                </div>
              )}

              {expandedCard === 'temp-alta' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.temperaturaAlta.length > 0 ? (
                    neumaticosEspecificos.temperaturaAlta.map((neumatico, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-red-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.motivo}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">Temperatura crítica - Revisar inmediatamente</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay temperaturas altas
                    </div>
                  )}
                </div>
              )}

              {expandedCard === 'temp-baja' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.temperaturaBaja.length > 0 ? (
                    neumaticosEspecificos.temperaturaBaja.map((neumatico, index) => (
                      <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-blue-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.motivo}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">Temperatura anormalmente baja</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay temperaturas bajas anómalas
                    </div>
                  )}
                </div>
              )}

              {expandedCard === 'presion-alta' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.presionAlta.length > 0 ? (
                    neumaticosEspecificos.presionAlta.map((neumatico, index) => (
                      <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-yellow-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.motivo}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">Presión sobre el rango recomendado</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay presiones altas
                    </div>
                  )}
                </div>
              )}

              {expandedCard === 'presion-baja' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.presionBaja.length > 0 ? (
                    neumaticosEspecificos.presionBaja.map((neumatico, index) => (
                      <div key={index} className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-purple-700">{neumatico.code}</div>
                            <div className="text-sm text-gray-600 dark:text-white">{neumatico.positionName}</div>
                          </div>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            {neumatico.motivo}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 dark:text-white">Presión bajo el rango recomendado</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No hay presiones bajas
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-neutral-700 border-gray-200 dark:text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-gray-700 rounded-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Panel de Salud de Neumáticos OTR
            </h2>
            <p className="text-gray-600 dark:text-white">
              Monitoreo en tiempo real del estado de neumáticos con análisis detallado
            </p>
          </div>
        </div>

        {/* Filtros mejorados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
              📏 Dimensión del neumático:
            </label>
            <Select
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
              className="react-select-container text-black "
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-2">
              📍 Posición en vehículo:
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
              className="react-select-container text-black"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </main>


      {/* Gráficos Mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Temperatura vs Presión por Posición */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌡️</span>
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

        {/* Scatter Desgaste Interno vs Externo por Posición */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Desgaste Interno vs Externo por Posición
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 80, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="internalTread"
                name="Goma Interna"
                unit=" mm"
                label={{
                  value: 'Goma Interna (mm)',
                  position: 'insideBottom',
                  offset: -20,
                  style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
                }}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis
                type="number"
                dataKey="externalTread"
                name="Goma Externa"
                unit=" mm"
                label={{
                  value: 'Goma Externa (mm)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 20,
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

              {/* Líneas de alerta para desgaste crítico */}
              <ReferenceLine x={15} stroke="#f97316" strokeDasharray="5 5" />
              <ReferenceLine y={15} stroke="#f97316" strokeDasharray="5 5" />
              <ReferenceLine x={8} stroke="#ef4444" strokeDasharray="5 5" />
              <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="5 5" />

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
        </div>
      </div>

      {/* Tabla de Neumáticos Críticos y en Alerta (comentada) */}
      {/*
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🚨 Neumáticos que Requieren Atención
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold">Código</th>
                <th className="p-3 text-left font-semibold">Dimensión</th>
                <th className="p-3 text-left font-semibold">Modelo</th>
                <th className="p-3 text-left font-semibold">Posición</th>
                <th className="p-3 text-left font-semibold">Presión</th>
                <th className="p-3 text-left font-semibold">Temp.</th>
                <th className="p-3 text-left font-semibold">Diff. Goma</th>
                <th className="p-3 text-left font-semibold">Min. Goma</th>
                <th className="p-3 text-left font-semibold">Estado</th>
                <th className="p-3 text-left font-semibold">Acción Requerida</th>
              </tr>
            </thead>
            <tbody>
              {processedData
                .filter(t => t.status === "Crítico" || t.status === "Alerta")
                .sort((a, b) => b.priority - a.priority)
                .map(t => (
                <tr key={t.code} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono font-semibold">{t.code}</td>
                  <td className="p-3">{t.dimension}</td>
                  <td className="p-3">{t.model}</td>
                  <td className="p-3">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: t.positionColor }}
                    ></span>
                    {t.positionName}
                  </td>
                  <td className="p-3">{t.pressure > 0 ? `${t.pressure} PSI` : "-"}</td>
                  <td className="p-3">{t.temperature > 0 ? `${t.temperature}°C` : "-"}</td>
                  <td className="p-3">
                    <span className={t.treadDiff > 10 ? "text-red-600 font-semibold" : t.treadDiff > 6 ? "text-yellow-600" : ""}>
                      {t.treadDiff.toFixed(1)} mm
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={t.minTread <= 8 ? "text-red-600 font-semibold" : t.minTread <= 15 ? "text-yellow-600" : ""}>
                      {t.minTread.toFixed(1)} mm
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status === "Crítico" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{t.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {processedData.filter(t => t.status === "Crítico" || t.status === "Alerta").length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ✅ ¡Excelente! No hay neumáticos que requieran atención inmediata.
          </div>
        )}
      </div>
      */}
    </section>
  );
}