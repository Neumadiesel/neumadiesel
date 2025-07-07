"use client"
import { useAuth } from "@/contexts/AuthContext";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { VehicleDTO } from "@/types/Vehicle";
import { useEffect, useState } from "react";

import dayjs from 'dayjs';

interface Procedure {
    id: number;
    tireId: number;
    position: number;
    tireHours: number;
    tireKilometres: number;
    internalTread: number;
    description?: string;
    externalTread: number;
    procedureName: string;
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    vehicleId?: number;
    siteId: number;
    retirementReasonId?: number;
    workOrderId?: number;
}
interface WorkOrderDTO {
    id: number;
    code: string;
    description: string;
    type: string;
    status: string;
    dispatchDate: string; // formato ISO
    entryDate: string; // formato ISO
    siteId: number;
    tool: string;
    toolSerial: string;
    checkInHour: string; // formato HH:mm
    checkOutHour: string; // formato HH:mm
    observations: string;
    responsibleName: string;
    interventionType: string;
    peopleCount: number;
    shift: string;
    locationId: number;
    vehicleId: number;
    vehicle: VehicleDTO;
    createdAt: string; // formato ISO
    updatedAt: string; // formato ISO
    locationMaintenance: {
        id: number;
        description: string;
    };

    procedures: Procedure[]; // Puedes definir un tipo más específico si es necesario
}
export default function OT({ id }: { id: number }) {

    // funcion axios para pedir work order por id
    const client = useAxiosWithAuth()
    const { user } = useAuth();
    const [workOrder, setWorkOrder] = useState<WorkOrderDTO | null>(null);

    const fetchWorkOrder = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/${id}`);
            setWorkOrder(response.data);
            console.log("Órdenes de trabajo:", response.data);
        } catch (error) {
            console.error("Error al obtener órdenes de trabajo:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWorkOrder();
        }
    }, [user]);
    return (
        <div className="flex flex-col p-3 items-center min-h-full bg-gray-100 dark:bg-neutral-800 dark:text-white gap-y-4">
            <div className="bg-gray-900 dark:bg-neutral-800 text-white w-full h-16 flex items-center justify-between  px-3">

                <h1 className="text-2xl font-bold">ORDEN DE TRABAJO NEUMÁTICOS - CMZ</h1>
                <p className="text-xl font-bold bg-white p-2 text-black">
                    {workOrder?.code}
                </p>
            </div>
            {/* Seccion de informacion de trabajo */}
            <section className="flex flex-col w-full  shadow-sm rounded-sm border border-gray-100 p-3 bg-white dark:bg-neutral-900">
                <div className="flex flex-col  gap-y-2">
                    <div className="flex flex-row gap-x-2 items-center">
                        <h2 className="text-2xl uppercase font-bold ">
                            {workOrder?.description || "No hay descripción disponible"}
                        </h2>
                        <p className="flex justify-center items-center border border-green-600 bg-green-50 text-emerald-800 rounded-lg text-sm w-24  font-semibold ">
                            {workOrder?.status || "No disponible"}
                        </p>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 w-full h-full">
                        {/* Ubicacion */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Ubicación de mantenimiento:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.locationMaintenance.description || "No disponible"}
                            </p>
                        </div>
                        {/* Tipo de Mantencion */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Tipo de mantención:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.type || "No disponible"}
                            </p>
                        </div>
                        {/* Codio EQuipo */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Código del equipo:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.vehicle.code || "No disponible"}
                            </p>
                        </div>
                        {/* Modelo del equipo */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Modelo del equipo:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.vehicle.model.brand} {workOrder?.vehicle.model.model || "No disponible"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Fecha del trabajo y personal */}
            <section className="flex flex-col w-full  shadow-sm rounded-sm border border-gray-100 p-3 bg-white dark:bg-neutral-900">
                <div className="flex flex-col  gap-y-2">
                    <div className="flex flex-row gap-x-2 items-center">
                        <h2 className="text-lg text-gray-900 uppercase font-bold ">
                            Fecha de trabajo y Personal asignado
                        </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 w-full h-full">
                        {/* Personal */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Responsable
                            </label>
                            <p className="font-bold ">
                                {workOrder?.responsibleName || "No disponible"}
                            </p>
                        </div>
                        {/* Fecha */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Fecha
                            </label>
                            <p className="font-bold ">
                                {workOrder?.entryDate ? new Date(workOrder.entryDate).toLocaleDateString() : "No disponible"}
                            </p>
                        </div>
                        {/* Hora Ingreso */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Hora de Ingreso:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.entryDate ? new Date(workOrder.entryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No disponible"}
                            </p>
                        </div>
                        {/* Hora Despacho */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Hora de Despacho:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.dispatchDate ? new Date(workOrder.dispatchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No disponible"}
                            </p>
                        </div>
                        {/* Cantidad de Personas */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Cantidad Personas
                            </label>
                            <p className="font-bold ">
                                {workOrder?.peopleCount || "No disponible"}
                            </p>
                        </div>
                        {/* Horas Hombre */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Horas Hombre
                            </label>
                            <p className="font-bold ">
                                {workOrder?.peopleCount && workOrder?.entryDate && workOrder?.dispatchDate
                                    ? (workOrder.peopleCount * dayjs(workOrder.dispatchDate).diff(dayjs(workOrder.entryDate), 'hour', true)).toFixed(2)
                                    : "No disponible"}
                            </p>
                        </div>
                        {/* Turno */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Turno
                            </label>
                            <p className="font-bold ">
                                {workOrder?.shift || "No disponible"}
                            </p>
                        </div>
                        {/* Personal */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Personal Asignado:
                            </label>
                            <p className="font-bold ">
                                Neumadiesel
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Registro de Torque */}
            <section className="flex flex-col w-full  shadow-sm rounded-sm border border-gray-100 p-3 bg-white dark:bg-neutral-900">
                <div className="flex flex-col  gap-y-2">
                    <div className="flex flex-row gap-x-2 items-center">
                        <h2 className="text-lg text-gray-900 uppercase font-bold ">
                            Registro de Torque Aplicado
                        </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-x-2 w-full h-full">
                        {/* Personal */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Torquit Utilizado:
                            </label>
                            <p className="font-bold ">
                                {workOrder?.tool}
                            </p>
                        </div>
                        {/* Fecha */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Serie Torquit
                            </label>
                            <p className="font-bold ">
                                {workOrder?.toolSerial || "No disponible"}
                            </p>
                        </div>
                        {/* Hora Ingreso */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                Torque Aplicado
                            </label>
                            <p className="font-bold ">
                                850 lb/pie
                            </p>
                        </div>
                        {/* Hora Despacho */}
                        <div className="flex flex-col  p-2">
                            <label className="text-sm   text-gray-700">
                                1ra Verif. Torque
                            </label>
                            <p className="font-bold ">
                                {workOrder?.dispatchDate ? new Date(workOrder.dispatchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "No disponible"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Sección neumáticos desinstalados */}
            <section className="flex flex-col w-full border border-gray-200 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Desinstalados</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-800 dark:bg-black text-white dark:text-white">
                            <tr>
                                <th className="px-4 py-2">Pos</th>
                                <th className="px-4 py-2">Serie</th>
                                <th className="px-4 py-2">Sensor</th>
                                <th className="px-4 py-2">Aro</th>
                                <th className="px-4 py-2">Medidas</th>
                                <th className="px-4 py-2">Fabricante</th>
                                <th className="px-4 py-2">Remanente Final</th>
                                <th className="px-4 py-2">Razón de Retiro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(6)].map((_, idx) => {
                                // Buscar el neumático desinstalado en la posición correspondiente (position = idx + 1)
                                const neumatico = workOrder?.vehicle.installedTires
                                    ?.find(t => t.position === idx + 1);

                                return (
                                    <tr key={idx} className="border-t border-gray-200 dark:border-neutral-700">
                                        <td className="px-4 py-2">{idx + 1}</td>
                                        <td className="px-4 py-2">{neumatico?.tire?.code ?? '-'}</td>
                                        <td className="px-4 py-2">{'-'}</td>
                                        <td className="px-4 py-2">{'-'}</td>
                                        <td className="px-4 py-2">{neumatico?.tire?.model?.dimensions ?? '-'}</td>
                                        <td className="px-4 py-2">{neumatico?.tire?.model?.brand ?? '-'}</td>
                                        <td className="px-4 py-2">
                                            {neumatico?.tire?.lastInspection
                                                ? `${neumatico.tire.lastInspection.internalTread} / ${neumatico.tire.lastInspection.externalTread}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2">{neumatico?.tire?.code ?? '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Seccion neumatico instalado,*/}
            <section className="flex flex-col w-full border border-gray-200 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Instalados</h2>
                <div className="overflow-x-auto ">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-800 dark:bg-black text-white dark:text-white">
                            <tr>
                                <th className="px-4 py-2">Pos</th>
                                <th className="px-4 py-2">Serie</th>
                                <th className="px-4 py-2">Sensor</th>
                                <th className="px-4 py-2">Aro</th>
                                <th className="px-4 py-2">Medidas</th>
                                <th className="px-4 py-2">Fabricante</th>
                                <th className="px-4 py-2">Remanente</th>
                                <th className="px-4 py-2">Presión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrder?.vehicle.installedTires
                                .slice() // create a shallow copy to avoid mutating original array
                                .sort((a, b) => a.position - b.position)
                                .map((neumatico) => (
                                    <tr key={neumatico.id} className="border-t border-gray-200 dark:border-neutral-700">
                                        <td className="px-4 py-2 ">{neumatico.position}</td>
                                        <td className="px-4 py-2 ">{neumatico.tire.code}</td>
                                        <td className="px-4 py-2 ">{'-'}</td>
                                        <td className="px-4 py-2 ">{'-'}</td>
                                        <td className="px-4 py-2 ">{neumatico.tire?.model?.dimensions || ''}</td>
                                        <td className="px-4 py-2 ">{neumatico.tire?.model?.brand || ''}</td>
                                        <td className="px-4 py-2 ">{neumatico.tire.lastInspection && `${neumatico.tire.lastInspection.internalTread} / ${neumatico.tire.lastInspection.externalTread}`}</td>
                                        <td className="px-4 py-2 ">
                                            {neumatico.tire.lastInspection?.pressure ? `${neumatico.tire.lastInspection.pressure} PSI` : '-'}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
