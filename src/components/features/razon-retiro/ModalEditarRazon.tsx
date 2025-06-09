"use client";

import { useState, useEffect } from "react";
import axios from "axios";


interface RazonDto {
    id: number;
    name: string;
    description: string;
}

interface ModalEditarRazonProps {
    visible: boolean;
    onClose: () => void;
    razon: RazonDto | null;
    onGuardar: () => void;
}

export default function ModalEditarRazon({
    visible,
    onClose,
    razon,
    onGuardar,
}: ModalEditarRazonProps) {
    const [razonEditada, setRazonEditada] = useState({
        name: "",
        description: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (razon) {
            setRazonEditada({
                name: razon.name,
                description: razon.description,
            });
        }
    }, [razon]);



    if (!visible || !razon) return null;

    const updateRetirementReason = async () => {
        setError("");
        setLoading(true);

        const { name, description } = razonEditada;

        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/retirement-reason/${razon.id}`, {
                name,
                description,
            });
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar la faena");
            throw error;
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Faena</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">Nombre de la Faena</label>
                    <input
                        name="nombre"
                        value={razonEditada.name}
                        onChange={
                            (e) => setRazonEditada({ ...razonEditada, name: e.target.value })
                        }
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Región</label>
                    <input
                        name="region"
                        value={razonEditada.description}
                        onChange={
                            (e) => setRazonEditada({ ...razonEditada, description: e.target.value })
                        }
                        placeholder="Región"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={updateRetirementReason}
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
