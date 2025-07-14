"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    Line,
    LabelList,
} from "recharts";
import Select from "react-select";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { toPng } from "html-to-image";
dayjs.locale("es");

interface MaintenanceProgram {
    id: number;
    vehicleId: number;
    tyreId: number | null;
    status: "Programada" | "Completada" | "Imprevisto" | "Apoyo";
    otId: number;
    description: string;
    scheduledDate: string;
    scheduledTime: number | null;
    workDate: string | null;
}

interface CumplimientoDTO {
    periodo: string;
    programado: number;
    realizado: number;
    imprevistos: number;
    apoyo: number;
}

export default function GraficoCumplimientoPrograma() {
    const { user, siteId } = useAuth();
    const authFetch = useAuthFetch();

    const [mes, setMes] = useState<number>(new Date().getMonth());
    const [anio, setAnio] = useState<number>(new Date().getFullYear());

    const [dataSemanal, setDataSemanal] = useState<CumplimientoDTO[]>([]);
    const [dataMensual, setDataMensual] = useState<CumplimientoDTO[]>([]);

    const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const calcularAcumulado = (data: CumplimientoDTO[]): CumplimientoDTO => {
        return data.reduce((acc, item) => {
            acc.programado += item.programado;
            acc.realizado += item.realizado;
            acc.imprevistos += item.imprevistos;
            acc.apoyo += item.apoyo;
            return acc;
        }, {
            periodo: "Acumulado",
            programado: 0,
            realizado: 0,
            imprevistos: 0,
            apoyo: 0,
        });
    };

    const agruparPorSemana = (data: MaintenanceProgram[]): CumplimientoDTO[] => {
        const semanas: Record<string, CumplimientoDTO> = {};

        data.forEach(item => {
            const fecha = dayjs(item.scheduledDate);
            const semana = `${fecha.startOf('week').format("DD/MM")} - ${fecha.endOf('week').format("DD/MM")}`;

            if (!semanas[semana]) {
                semanas[semana] = {
                    periodo: semana,
                    programado: 0,
                    realizado: 0,
                    imprevistos: 0,
                    apoyo: 0,
                };
            }

            switch (item.status) {
                case "Programada":
                    semanas[semana].programado++;
                    break;
                case "Completada":
                    semanas[semana].realizado++;
                    break;
                case "Imprevisto":
                    semanas[semana].imprevistos++;
                    break;
                case "Apoyo":
                    semanas[semana].apoyo++;
                    break;
            }
        });

        const resultado = Object.values(semanas);
        resultado.push(calcularAcumulado(resultado));
        return resultado;
    };

    const agruparPorMes = (data: MaintenanceProgram[]): CumplimientoDTO[] => {
        const mesesAgrupados: Record<string, CumplimientoDTO> = {};

        data.forEach(item => {
            const fecha = dayjs(item.scheduledDate);
            const mesClave = `${fecha.format("MMM-YY")}`;

            if (!mesesAgrupados[mesClave]) {
                mesesAgrupados[mesClave] = {
                    periodo: mesClave,
                    programado: 0,
                    realizado: 0,
                    imprevistos: 0,
                    apoyo: 0,
                };
            }

            switch (item.status) {
                case "Programada":
                    mesesAgrupados[mesClave].programado++;
                    break;
                case "Completada":
                    mesesAgrupados[mesClave].realizado++;
                    break;
                case "Imprevisto":
                    mesesAgrupados[mesClave].imprevistos++;
                    break;
                case "Apoyo":
                    mesesAgrupados[mesClave].apoyo++;
                    break;
            }
        });

        const resultado = Object.values(mesesAgrupados);
        resultado.push(calcularAcumulado(resultado));
        return resultado;
    };

    const fetchCumplimiento = async () => {
        try {
            const res = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/site/${siteId}`);
            if (!res) return;

            const data: MaintenanceProgram[] = await res.json();
            const dataArray = Array.isArray(data) ? data : [];

            const dataFiltrada = dataArray.filter(p => {
                const fecha = dayjs(p.scheduledDate);
                return fecha.year() === anio && fecha.month() === mes;
            });

            const dataAnual = dataArray.filter(p => dayjs(p.scheduledDate).year() === anio);

            setDataSemanal(agruparPorSemana(dataFiltrada));
            setDataMensual(agruparPorMes(dataAnual));
        } catch (error) {
            console.error("Error al cargar datos de cumplimiento:", error);
        }
    };

    useEffect(() => {
        if (user) fetchCumplimiento();
    }, [mes, anio, user, siteId]);

    const calcularPorcentaje = (p: CumplimientoDTO) => {
        const total = p.realizado + p.imprevistos + p.apoyo;
        return total === 0 ? 0 : Math.round((p.realizado / total) * 100);
    };

    const optionsMes = meses.map((m, i) => ({ label: m, value: i }));
    const optionsAnio = [2024, 2025].map(a => ({ label: String(a), value: a }));

    const dataSemanalWithPct = dataSemanal.map(entry => ({
        ...entry,
        porcentaje: calcularPorcentaje(entry),
    }));

    const dataMensualWithPct = dataMensual.map(entry => ({
        ...entry,
        porcentaje: calcularPorcentaje(entry),
    }));

    const downloadChartAsImage = async () => {
        const node = document.getElementById("grafico-cumplimiento");
        if (!node) return;
        console.log("exportando")

        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `grafico-cumplimiento-programa.png`;
        link.click();
    };


    return (
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-2 dark:text-white" style={{ textAlign: "center" }}
            >
                Cumplimiento del Programa
            </h2>
            <div className="flex items-center gap-4 mb-4 justify-center">
                <p className="text-lg font-semibold dark:text-white">
                    Seleccionar Mes y Año:
                </p>
                <Select
                    options={optionsMes}
                    value={{ label: meses[mes], value: mes }}
                    onChange={(opt) => setMes(opt?.value ?? mes)}
                    className="text-black w-40"
                />
                <Select
                    options={optionsAnio}
                    value={{ label: anio.toString(), value: anio }}
                    onChange={(opt) => setAnio(opt?.value ?? anio)}
                    className="text-black w-32"
                />
                <button
                    onClick={downloadChartAsImage}
                    className="px-4 py-2 bg-blue-600 font-semibold text-white rounded "
                >
                    Exportar como Imagen
                </button>
            </div>

            <div id="grafico-cumplimiento" className="w-full h-full bg-white dark:bg-neutral-800 p-3 m-2">

                {/* Gráfico semanal */}
                <div className="mb-10">
                    <h3 className="font-semibold mb-2 dark:text-white">Cumplimiento semanal - {meses[mes]} {anio}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataSemanalWithPct} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="periodo" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="programado" fill="#8884d8" name="Programado" yAxisId="left">
                                <LabelList dataKey="programado" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="realizado" fill="#82ca9d" name="Realizado" yAxisId="left" >
                                <LabelList dataKey="realizado" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="imprevistos" fill="#ffc658" name="Imprevistos" yAxisId="left" >
                                <LabelList dataKey="imprevistos" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="apoyo" fill="#a6a6a6" name="Apoyo Mec." yAxisId="left" >
                                <LabelList dataKey="apoyo" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Line
                                type="monotone"
                                dataKey="porcentaje"
                                stroke="#0000FF"
                                yAxisId="right"
                                name="% Cumplimiento"
                                dot={false}
                            >
                                <LabelList
                                    dataKey="porcentaje"
                                    position="top"
                                    fill="#f5b041" fontWeight={"bold"}
                                    formatter={(value: number) => `${value}%`}
                                />
                            </Line>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico mensual */}
                <div>
                    <h3 className="font-semibold mb-2 dark:text-white">Cumplimiento mensual - Año {anio}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataMensualWithPct} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="periodo" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="programado" fill="#8884d8" name="Programado" yAxisId="left" >
                                <LabelList dataKey="programado" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="realizado" fill="#82ca9d" name="Realizado" yAxisId="left" >
                                <LabelList dataKey="realizado" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="imprevistos" fill="#ffc658" name="Imprevistos" yAxisId="left" >
                                <LabelList dataKey="imprevistos" position="top" fill="#f5b041" fontWeight={"bold"} />
                            </Bar>
                            <Bar dataKey="apoyo" fill="#a6a6a6" name="Apoyo Mec." yAxisId="left" />
                            <Line
                                type="monotone"
                                dataKey="porcentaje"
                                stroke="#0000FF"
                                yAxisId="right"
                                name="% Cumplimiento"
                                dot={false}
                            >
                                <LabelList
                                    dataKey="porcentaje"
                                    position="top"
                                    fill="#f5b041" fontWeight={"bold"}
                                    formatter={(value: number) => `${value}%`}
                                />
                            </Line>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
