"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/utils/AuthFetch";
import { Info, Siren, Waves } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function TireHealthDashboard() {
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const [tires, setTires] = useState<Tire[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  ;

  useEffect(() => {
    if (user) {
      authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/operational/site/1`)
        .then(res => {
          if (!res) {
            console.error("No se pudo obtener la respuesta del backend.");
            return;
          }
          return res.json();
        })
        .then(data => {
          if (data) setTires(data);
        })
        .catch(err => console.error("Error cargando neumáticos:", err));
    }
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
  }, [tires]);

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


  // Crear listas específicas para cada tarjeta - REDISEÑADAS
  const neumaticosEspecificos = useMemo(() => {
    return {
      criticos: processedData.filter(t => t.status === "Crítico").map(t => ({
        code: t.code,
        id: t.id,
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

  return (
    <section className="space-y-6 mt-6 bg-white dark:bg-[#212121] ">

      {/* KPIs Rediseñados - Vista más elegante */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Neumáticos Críticos */}
        <div
          className="bg-gradient-to-br from-red-50 to-red-100 text-red-500  border border-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'criticos' ? null : 'criticos')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">
                <Siren size={35} />
              </div>
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
          className="bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border border-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          onClick={() => setExpandedCard(expandedCard === 'desgaste' ? null : 'desgaste')}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">
                <Waves size={35} />
              </div>
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
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
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

            {/* Lista de Nuemáticos Criticos */}
            <div className="p-6 overflow-y-auto max-h-96">
              {expandedCard === 'criticos' && (
                <div className="space-y-3">
                  {neumaticosEspecificos.criticos.length > 0 ? (
                    neumaticosEspecificos.criticos.map((neumatico, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-bold text-lg text-red-700">{neumatico.code}</div>
                            <Link href={`/neumaticos/${neumatico.id}`} className="text-sm text-blue-600 hover:underline">
                              <Info size={16} className="inline mr-1" />
                            </Link>
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
    </section>
  );
}