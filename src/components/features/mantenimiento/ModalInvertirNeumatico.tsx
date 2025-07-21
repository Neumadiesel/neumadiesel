"use client";

import { useState, useEffect } from "react";

import { installedTiresDTO } from "@/types/Tire";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import axios from "axios";
// Extender con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);



interface ModalInvertirNuematicoProps {
    visible: boolean;
    onClose: () => void;
    tire: installedTiresDTO | null;
    onGuardar: () => void;
}

export default function ModalInvertirNuematico({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalInvertirNuematicoProps) {
    const client = useAxiosWithAuth();
    const [tireDesmonted, setTireDesmonted] = useState({
        code: "",
        tireId: null as number | null,
        externalTread: 0,
        internalTread: 0,
    });
    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [endDate, setEndDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (tire) {
            if (tire.tire.lastInspection) {
                console.log("tireId", tire.tire.id);
                setTireDesmonted({
                    code: tire.tire.code,
                    tireId: tire.tire.id,
                    externalTread: tire.tire.lastInspection.externalTread,
                    internalTread: tire.tire?.lastInspection.internalTread,
                });
            } else {
                console.log("tireId", tire.tire.id);
                setTireDesmonted({
                    code: tire.tire.code,
                    tireId: tire.tire.id,
                    externalTread: tire.tire.initialTread,
                    internalTread: tire.tire?.initialTread,
                });
            }

        }
    }, [tire]);

    if (!visible || !tire) return null;

    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        const { tireId, internalTread, externalTread } = tireDesmonted;
        if (!tireId || !internalTread || !externalTread || !actionDate) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }
        try {
            const response = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/procedures/flip-tire`, {
                tireId,
                executionDate: actionDate.toISOString(),
                executionFinal: endDate.toISOString(),
                internalTread: externalTread,
                externalTread: internalTread
            }

            );
            console.log("Response from server:", response.data);
            onGuardar();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                console.error("Error al invertir Nuemático:", message);
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            handleCancel();
            setLoading(false);
        }
    };



    const handleCancel = () => {
        setTireDesmonted({
            code: "",
            tireId: null,
            externalTread: 0,
            internalTread: 0,
        });
        setActionDate(dayjs().tz('America/Santiago'));
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] dark:text-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Invertir Neumático {tireDesmonted.code}</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                {/* Informacion actual del neumatico */}
                <div className="mb-4 bg-teal-100 border border-gray-200 grid grid-cols-1 dark:bg-[#414141] p-4 rounded">
                    <p className="text-sm">Condiciones Actuales del Neumático</p>
                    <div className="grid grid-cols-2">
                        <p><strong>Remanente Interior:</strong> {tire.tire.lastInspection.internalTread} mm</p>
                        <p><strong>Remanente Exterior:</strong> {tire.tire.lastInspection.externalTread} mm</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Fecha de accion con hora */}
                    <label className="text-sm mt-2 font-semibold mb-2">Fecha de Detención</label>
                    <input
                        type="datetime-local"
                        name="Fecha de Detención"
                        value={actionDate ? actionDate.format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => {
                            // Asumimos que lo que el usuario selecciona es en hora chilena
                            const newDate = dayjs.tz(e.target.value, 'America/Santiago');
                            setActionDate(newDate);
                        }}
                        placeholder="Fecha de Detención"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Fecha de termino con hora */}
                    <label className="text-sm mt-2 font-semibold mb-2">Fecha de Despacho</label>
                    <input
                        type="datetime-local"
                        name="Fecha de Despacho"
                        value={endDate ? endDate.format('YYYY-MM-DDTHH:mm') : ''}
                        onChange={(e) => {
                            // Asumimos que lo que el usuario selecciona es en hora chilena
                            const newDate = dayjs.tz(e.target.value, 'America/Santiago');
                            setEndDate(newDate);
                        }}
                        placeholder="Fecha de Despacho"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <div className="col-span-2 border border-teal-600 bg-teal-100 w-full py-2 px-4 rounded">
                        <h2 className="text-sm font-semibold text-teal-800">
                            Ingrese Nuevas Medidas del Neumático
                        </h2>
                    </div>
                    {/* Remanente interior */}
                    <label className="text-sm mt-2 font-semibold mb-2">Nuevo Remanente Interior</label>
                    <input
                        type="number"
                        name="Nuevo Remanente Interior"
                        min={0}
                        value={tireDesmonted.internalTread}
                        onChange={
                            (e) => setTireDesmonted({ ...tireDesmonted, internalTread: parseFloat(e.target.value) })
                        }
                        placeholder="Nuevo Remanente Interior"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Remanente exterior */}
                    <label className="text-sm mt-2 font-semibold mb-2">Nuevo Remanente Exterior</label>
                    <input
                        type="number"
                        name="Nuevo Remanente Exterior"
                        min={0}
                        value={tireDesmonted.externalTread}
                        onChange={

                            (e) => setTireDesmonted({ ...tireDesmonted, externalTread: parseFloat(e.target.value) })
                        }
                        placeholder="Nuevo Remanente Exterior"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
                <LoadingSpinner isOpen={loading} />
            </div>
        </div>
    );
}
