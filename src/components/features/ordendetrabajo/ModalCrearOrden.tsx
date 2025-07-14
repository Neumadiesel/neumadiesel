"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1DatosGenerales from "./Step1DatosGenerales";
import Step2SeleccionNeumaticos from "./Step2SeleccionNeumaticos";
import Step3Confirmacion from "./Step3Confirmacion";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import PasoStepper from "./components/PasoStepper";
import { VehicleDTO } from "@/types/Vehicle";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Step4Instalacion from "./Step4Instalation";

// Tipos
export type Instalacion = {
    posicion: number;
    nuevoTireId?: number;
    internalTread?: number;
    externalTread?: number;
    presion?: number;
    temperatura?: number;
    finalInternalTread?: number;
    finalExternalTread?: number;
    razonRetiroId?: number;
};

export interface OrdenTrabajoForm {
    code: string;
    vehicleCode: string;
    description: string;
    locationMaintenanceId: number | null;
    type: string;
    status: string;
    dimension?: string;
    entryDate: string;
    dispatchDate: string;
    shift: string;
    responsibleName: string;
    peopleCount: number;
    tool: string;
    toolSerial: string;
    observations?: string;
    siteId: number | null;
    vehicleId: number | null;
    kilometrage?: number;
    hours?: number;
    instalaciones: Instalacion[];
    programasSeleccionados?: number[];
    posicionesSeleccionadas?: number[];
    proceduresListId?: number[];
    vehicle?: VehicleDTO;
}

interface Props {
    onClose: () => void;
}

export default function ModalCrearOrden({ onClose }: Props) {
    const { user } = useAuth();
    const [step, setStep] = useState<number>(1);
    const [datos, setDatos] = useState<OrdenTrabajoForm>({
        code: "",
        vehicleCode: "",
        description: "",
        locationMaintenanceId: null,
        type: "",
        status: "Pendiente", // puedes setear un valor por defecto
        entryDate: "",
        dispatchDate: "",
        shift: "",
        responsibleName: "",
        peopleCount: 1,
        tool: "",
        toolSerial: "",
        observations: "",
        siteId: null,
        vehicleId: null,
        instalaciones: [],
        programasSeleccionados: [],
        posicionesSeleccionadas: [],
        proceduresListId: []
    });

    const router = useRouter();
    const client = useAxiosWithAuth();

    const handleCrearOrden = async () => {

        const payload = {
            code: datos.code,
            description: datos.description,
            locationMaintenanceId: datos.locationMaintenanceId!,
            type: datos.type,
            status: datos.status,
            entryDate: datos.entryDate,
            dispatchDate: datos.dispatchDate,
            shift: datos.shift,
            responsibleName: datos.responsibleName,
            peopleCount: datos.peopleCount,
            tool: datos.tool || "Torquit 3000",
            toolSerial: datos.toolSerial || "SN-123456",
            siteId: datos.siteId! || user?.faena_id,
            vehicleId: datos.vehicleId!,
            observations: datos.observations || "Sin observaciones",
        };

        const camposObligatorios = [
            'code', 'description', 'locationMaintenanceId', 'type',
            'status', 'entryDate', 'dispatchDate', 'shift',
            'responsibleName', 'peopleCount', 'tool', 'toolSerial',
            'vehicleId'
        ];

        for (const campo of camposObligatorios) {
            if (!payload[campo as keyof typeof payload]) {
                console.error(`Falta el campo obligatorio: ${campo}`, payload);
                return;
            }
        }
        try {
            console.log("Datos a enviar:", payload);
            const response = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order`, payload);

            const nuevaOrdenId = response?.data?.workOrder?.id;

            // ✅ Actualizar programas seleccionados si existen
            if (datos.programasSeleccionados && datos.programasSeleccionados.length > 0) {

                await Promise.all(
                    datos.programasSeleccionados.map((programaId) => {

                        client.patch(`/maintenance-program/${programaId}`, {
                            status: "Completada",
                            otId: nuevaOrdenId,
                            workDate: datos.entryDate,
                        })

                        console.log("Actualizando programas seleccionados:", programaId, nuevaOrdenId);
                    }
                    )
                );
            }
            console.log("Procedimientos :", datos.proceduresListId);
            // Actualizar procedimientos de proceduresListId
            if (datos.proceduresListId && datos.proceduresListId.length > 0) {
                await Promise.all(
                    datos.proceduresListId.map((procedureId) =>
                        client.patch(`/procedures/${procedureId}`, {
                            workOrderId: nuevaOrdenId,
                        })
                    )
                );
            }

            router.push(`/mantenimiento/orden-de-trabajo/${nuevaOrdenId}`);
            onClose();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(`err.message: ${err.message}`);
                console.error(err.response?.data || err.message);
            } else if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error(err);
            }
        }
    };

    const handleCancelar = () => {
        setDatos({
            code: "",
            vehicleCode: "",
            description: "",
            locationMaintenanceId: null,
            type: "",
            status: "Pendiente",
            entryDate: "",
            dispatchDate: "",
            shift: "",
            responsibleName: "",
            peopleCount: 1,
            tool: "",
            toolSerial: "",
            observations: "",
            siteId: null,
            vehicleId: null,
            instalaciones: [],
            programasSeleccionados: [],
            posicionesSeleccionadas: [],
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex">
            <div className="absolute inset-0 bg-white dark:bg-neutral-900"></div>
            <div className="relative bg-white dark:bg-[#212121] h-full dark:text-white p-3 rounded-md shadow-lg flex flex-col gap-y-2 items-center w-full overflow-y-auto pb-10">
                <h2 className="text-3xl font-bold mb-4">Crear Orden de Trabajo</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Completa los pasos para crear una nueva orden de trabajo.
                </p>

                <PasoStepper pasoActual={step} />
                <div className="flex justify-center mt-4 w-full ">
                    <button
                        onClick={handleCancelar}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                </div>
                <div className="w-full max-w-5xl h-full">
                    {step === 1 && (
                        <Step1DatosGenerales
                            datos={datos}
                            setDatos={setDatos}
                            onNext={() => setStep(2)}
                        />
                    )}
                    {step === 2 && (
                        <Step2SeleccionNeumaticos
                            datos={datos}
                            setDatos={setDatos}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Confirmacion
                            datos={datos}
                            setDatos={setDatos}
                            onBack={() => setStep(2)}
                            onNext={() => setStep(4)}
                        />
                    )}
                    {step === 4 && (
                        <Step4Instalacion
                            datos={datos}
                            setDatos={setDatos}
                            onBack={() => setStep(3)}
                            onConfirm={handleCrearOrden}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}