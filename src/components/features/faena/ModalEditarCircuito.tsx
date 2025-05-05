"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface CircuitoDTO {
    id: number;
    nombreCircuito: string;
    distancia: number;
    velocidad: number;
    TKPH: number;
}


interface ModalEditarFaenaProps {
    visible: boolean;
    onClose: () => void;
    circuito: CircuitoDTO | null;
    onGuardar: () => void;
}

export default function ModalEditarFaena({
    visible,
    onClose,
    circuito,
    onGuardar,
}: ModalEditarFaenaProps) {
    const [circuitoEditado, setCircuitoeditado] = useState({
        nombreCircuito: "",
        distancia: 0,
        velocidad: 0,
        TKPH: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (circuito) {
            setCircuitoeditado({
                nombreCircuito: circuito.nombreCircuito,
                distancia: circuito.distancia,
                velocidad: circuito.velocidad,
                TKPH: circuito.TKPH,
            });
        }
    }, [circuito]);



    if (!visible || !circuito) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCircuitoeditado(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/faena/${circuito.id}`,
                {
                    nombreCircuito: circuitoEditado.nombreCircuito,
                    distancia: circuitoEditado.distancia,
                    velocidad: circuitoEditado.velocidad,
                    TKPH: circuitoEditado.TKPH,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error("Error al actualizar la faena");
            }

            onGuardar();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar la faena");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Circuito</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError(null)} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold">Nombre Circuito:</label>
                    <input
                        name="nombre"
                        value={circuitoEditado.nombreCircuito}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold">Distancia:</label>
                    <input
                        name="distancia"
                        type="number"
                        value={circuitoEditado.distancia}
                        onChange={handleChange}
                        placeholder="Distancia"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold">Velocidad:</label>
                    <input
                        name="velocidad"
                        type="number"
                        value={circuitoEditado.velocidad}
                        onChange={handleChange}
                        placeholder="Velocidad promedio"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold">TKPH:</label>
                    <input
                        name="TKPH"
                        type="number"
                        value={circuitoEditado.TKPH}
                        onChange={handleChange}
                        placeholder="TKPH"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : "Guardar Cambios"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
