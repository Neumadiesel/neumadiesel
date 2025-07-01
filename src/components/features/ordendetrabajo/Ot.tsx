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


    // "entryDate": "2025-07-01T16:00:00.000Z",
    // "dispatchDate": "2025-07-01T17:00:00.000Z",
    dispatchDate: string; // formato ISO
    entryDate: string; // formato ISO
    siteId: number;
    checkInHour: string; // formato HH:mm
    checkOutHour: string; // formato HH:mm
    observations: string;
    responsibleName: string;
    interventionType: string;
    peopleCount: number;
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


    const neumaticos = [
        {
            posicion: "1",
            nroSerie: "ABC123456",
            sensor: "SN-001",
            nroAro: "AR-123",
            tipoAro: "Aluminio",
            medida: "295/80R22.5",
            fabricante: "Michelin",
            diseno: "X Works",
            gomaRemanente: "12 mm",
            razonDesmontaje: "Desgaste irregular",
            destino: "Recauchado",
        },
        {
            posicion: "2",
            nroSerie: "DEF789012",
            sensor: "SN-002",
            nroAro: "AR-124",
            tipoAro: "Acero",
            medida: "295/80R22.5",
            fabricante: "Bridgestone",
            diseno: "M840",
            gomaRemanente: "9 mm",
            razonDesmontaje: "Pinchazo",
            destino: "Desecho",
        },
        {
            posicion: "3",
            nroSerie: "MNO567890",
            sensor: "SN-005",
            nroAro: "AR-127",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "4",
            nroSerie: "PQR123456",
            sensor: "SN-006",
            nroAro: "AR-128",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "5",
            nroSerie: "STU567890",
            sensor: "SN-007",
            nroAro: "AR-129",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "6",
            nroSerie: "VWX123456",
            sensor: "SN-008",
            nroAro: "AR-130",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
    ];

    const campos = [
        { label: "Posición", key: "posicion" },
        { label: "N° Serie", key: "nroSerie" },
        { label: "N° Sensor", key: "sensor" },
        { label: "N° Aro", key: "nroAro" },
        { label: "Tipo Aro", key: "tipoAro" },
        { label: "Medida", key: "medida" },
        { label: "Fabricante", key: "fabricante" },
        { label: "Diseño", key: "diseno" },
        { label: "Goma Remanente", key: "gomaRemanente" },
        { label: "Razón Desmontaje", key: "razonDesmontaje" },
        { label: "Destino", key: "destino" },
    ];

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
        <div className="flex flex-col p-3 items-center min-h-full bg-amber-200 dark:bg-neutral-800 dark:text-white gap-y-4">
            <h1 className="text-2xl font-bold">Orden de Trabajo de Neumaticos {workOrder?.code}</h1>
            {/* Seccion de informacion de trabajo */}
            <section className="flex flex-col w-full h-[15%] border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="flex flex-col w-full h-full gap-y-2">
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        {/* Descripcion del trabajo */}
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-64 border-r border-gray-500">
                            Descripcion del trabajo
                        </label>
                        <input
                            disabled
                            type="text"
                            value={workOrder?.description || ""}
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Zona donde se desarrolla y tipo de intervencion */}
                    <section className="flex flex-row w-full h-full gap-x-2">
                        {/* Zona de trabajo */}
                        <div className="flex flex-row w-[50%] h-10 border border-gray-500">
                            <label className="text-md font-bold bg-amber-300 text-black p-2 w-[54%] border-r border-gray-500">
                                Zona de trabajo
                            </label>
                            <input
                                disabled
                                type="text"
                                value={workOrder?.locationMaintenance.description || ""}
                                className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                            />
                        </div>
                        {/* Tipo de intervencion */}
                        <div className="flex flex-row w-[50%] h-10 border border-gray-500 ">
                            <label className="text-md font-bold bg-amber-300 text-black p-2 w-[60%] border-r border-gray-500">
                                Tipo de intervencion
                            </label>
                            <input
                                disabled
                                type="text"
                                value={workOrder?.type || ""}
                                className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                            />
                        </div>
                    </section>
                </div>
            </section>
            {/* Modelo del equipo */}
            <section className="flex items-center  w-full h-[10%] border border-gray-500 rounded-sm p-3 gap-x-2 bg-white dark:bg-neutral-900">
                <div className="flex flex-row w-full h-10 border border-gray-500 ">
                    <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                        Modelo del equipo
                    </label>
                    <input
                        type="text"
                        disabled
                        value={`${workOrder?.vehicle.model.brand} ${workOrder?.vehicle.model.model}` || ""}

                        className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                    />
                </div>
                {/* Codigo del equipo */}
                <div className="flex flex-row w-full h-10 border border-gray-500 ">
                    <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                        Codigo del equipo
                    </label>
                    <input
                        type="text"
                        disabled
                        value={workOrder?.vehicle.code || ""}
                        placeholder="H-41"
                        className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                    />
                </div>
            </section>
            {/* Infomracion registro de detencion */}
            <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="grid grid-cols-2  gap-x-2 w-full h-full">
                    {/* Fecha */}
                    <div className="flex flex-row w-full h-10 border border-gray-500 ">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Fecha
                        </label>
                        <input
                            disabled
                            value={workOrder?.entryDate ? new Date(workOrder.entryDate).toISOString().split("T")[0] : ""}
                            type="date"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Hora de detencion */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Hora de Detencion
                        </label>
                        <input
                            type="time"
                            disabled
                            value={workOrder?.entryDate ? new Date(workOrder.entryDate).toISOString().split("T")[1].slice(0, 5) : ""}
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Personal ejecutor */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Responsable
                        </label>
                        <input
                            type="text"
                            disabled
                            value={workOrder?.responsibleName || ""}
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Hora Entrega de Despacho */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Hora Entrega Despacho
                        </label>
                        <input
                            disabled
                            value={workOrder?.dispatchDate ? new Date(workOrder.dispatchDate).toISOString().split("T")[1].slice(0, 5) : ""}

                            type="time"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Cantidad de personas */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Cantidad de personas
                        </label>
                        <input
                            type="number"
                            disabled
                            value={workOrder?.peopleCount || ""}
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Horas Hombre */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Horas Hombre
                        </label>
                        <input
                            type="number"
                            disabled
                            value={
                                workOrder?.peopleCount && workOrder?.entryDate && workOrder?.dispatchDate
                                    ? (workOrder.peopleCount * dayjs(workOrder.dispatchDate).diff(dayjs(workOrder.entryDate), 'hour', true)).toFixed(2)
                                    : ""
                            }
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                </div>
            </section>
            {/* Seccion de registro torque utilizado */}
            {/* <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="grid grid-cols-2  gap-x-2 w-full h-full">
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Torque aplicado
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Torquit utilizado
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            1ra verif. torque
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Serie torquit
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            2da verif. torque
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                </div>
            </section> */}
            {/* Seccion neumatico desintalado,*/}
            <section className="flex flex-col w-full h-[80%] border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Desinstalados</h2>
                <div className="overflow-x-auto rounded-sm shadow">
                    <table className="border min-w-full text-sm text-left">
                        <tbody>
                            {campos.map((campo, index) => (
                                <tr key={index} className="border-b">
                                    <th className="bg-gray-100 dark:bg-[#000] dark:text-white text-gray-700 px-4 py-2 font-semibold w-48">
                                        {campo.label}
                                    </th>
                                    {neumaticos.map((neumatico, idx) => (
                                        <td key={idx} className="px-4 py-2">
                                            {neumatico[campo.key as keyof typeof neumatico]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Seccion neumatico instalado,*/}
            <section className="flex flex-col w-full border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Instalados</h2>
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-100 dark:bg-black text-gray-700 dark:text-white">
                            <tr>
                                <th className="px-4 py-2 border">Pos</th>
                                <th className="px-4 py-2 border">Código</th>
                                <th className="px-4 py-2 border">Medidas</th>
                                <th className="px-4 py-2 border">Fabricante</th>
                                <th className="px-4 py-2 border">Remanente</th>
                                <th className="px-4 py-2 border">Presión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workOrder?.vehicle.installedTires.map((neumatico) => (
                                <tr key={neumatico.id} className="border-t">
                                    <td className="px-4 py-2 border">{neumatico.position}</td>
                                    <td className="px-4 py-2 border">{neumatico.tire.code}</td>
                                    <td className="px-4 py-2 border">{neumatico.tire?.model?.dimensions || ''}</td>
                                    <td className="px-4 py-2 border">{neumatico.tire?.model?.brand || ''}</td>

                                    <td className="px-4 py-2 border">{neumatico.tire.lastInspection && `${neumatico.tire.lastInspection.internalTread} / ${neumatico.tire.lastInspection.externalTread}`}</td>
                                    <td className="px-4 py-2 border">
                                        {neumatico.tire.lastInspection.pressure ? `${neumatico.tire.lastInspection.pressure} PSI` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Seccion comentarios/observaciones */}
            <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-800">
                <div className="flex flex-col w-full  border border-gray-500">
                    <label className="text-md font-bold border-b border-gray-500 bg-amber-300 text-black p-2 text-center w-full ">
                        Comentarios/Observaciones del trabajo realizado
                    </label>
                    <input
                        type="text"
                        disabled
                        value={workOrder?.observations || ""}
                        className="w-full p-2 px-4 font-bold   min-h-20 outline-amber-300 focus:outline-amber-300"
                    />
                </div>
            </section>
        </div>
    );
}
