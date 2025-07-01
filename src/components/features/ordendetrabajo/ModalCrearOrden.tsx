"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1DatosGenerales from "./Step1DatosGenerales";
import Step2SeleccionNeumaticos from "./Step2SeleccionNeumaticos";
import Step3Confirmacion from "./Step3Confirmacion";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import PasoStepper from "./components/PasoStepper";

// Tipos
export type Instalacion = {
    posicion: number;
    nuevoTireId?: number;
    remanente?: number;
    presion?: number;
    temperatura?: number;
    remanenteFinal?: number;
    razonRetiroId?: number;
};

export interface OrdenTrabajoForm {
    fecha: string | null;
    fechaDespacho: string;
    observaciones: string;
    locationId: number | null;
    tipoIntervencion: string;
    cantidadPersonas: string;
    horaIngreso: string;
    horaDespacho: string;
    equipoId: number | null;
    vehicleCode: string;
    vehicle: any; // Se puede mejorar con un tipo específico
    programasSeleccionados: number[];
    posicionesSeleccionadas: number[];
    kilometrage: number;
    horas: number;
    instalaciones: Instalacion[];
    tecnico: string;
}

interface Props {
    onClose: () => void;
}

export default function ModalCrearOrden({ onClose }: Props) {
    const [step, setStep] = useState<number>(1);
    const [datos, setDatos] = useState<OrdenTrabajoForm>({
        fecha: null,
        fechaDespacho: "",
        observaciones: "",
        locationId: null,
        tipoIntervencion: "",
        cantidadPersonas: "",
        horaIngreso: "",
        horaDespacho: "",
        equipoId: null,
        vehicleCode: "",
        vehicle: null,
        programasSeleccionados: [],
        posicionesSeleccionadas: [],
        kilometrage: 0,
        horas: 0,
        instalaciones: [],
        tecnico: "",
    });

    const router = useRouter();
    const client = useAxiosWithAuth();

    const handleCrearOrden = async () => {
        try {
            const response = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order`, {
                equipoId: datos.equipoId,
                tecnico: datos.tecnico,
                fecha: datos.fecha,
                observaciones: datos.observaciones,
                neumaticos: datos.instalaciones.map((inst) => ({
                    posicion: inst.posicion,
                    nuevoTireId: inst.nuevoTireId,
                    remanente: inst.remanente,
                    presion: inst.presion,
                    temperatura: inst.temperatura,
                    remanenteFinal: inst.remanenteFinal,
                    razonRetiroId: inst.razonRetiroId,
                })),
            });

            const nuevaOrdenId = response?.data?.id;
            router.push(`/ordenes/${nuevaOrdenId}`);
            onClose();
        } catch (error) {
            console.error("Error creando orden:", error);
        }
    };
    const handleCancelar = () => {
        setDatos({
            fecha: null,
            fechaDespacho: "",
            observaciones: "",
            locationId: null,
            tipoIntervencion: "",
            cantidadPersonas: "",
            horaIngreso: "",
            horaDespacho: "",
            equipoId: null,
            vehicleCode: "",
            vehicle: null,
            programasSeleccionados: [],
            posicionesSeleccionadas: [],
            kilometrage: 0,
            horas: 0,
            instalaciones: [],
            tecnico: "",
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
                <div className="w-full max-w-5xl h-full ">
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
                            onConfirm={handleCrearOrden}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}