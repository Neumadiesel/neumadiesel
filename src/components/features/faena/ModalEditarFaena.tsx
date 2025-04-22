"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";


interface FaenaDTO {
    id: number;
    nombre: string;
    region: string;
    inicio: Date;
    fin: Date;
}

interface ModalEditarFaenaProps {
    visible: boolean;
    onClose: () => void;
    faena: FaenaDTO | null;
    onGuardar: () => void;
}

export default function ModalEditarFaena({
    visible,
    onClose,
    faena,
    onGuardar,
}: ModalEditarFaenaProps) {
    const [faenaEditada, setFaenaeditada] = useState({
        nombre: "",
        region: "",
        inicio: "",
        fin: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (faena) {
            setFaenaeditada({
                nombre: faena.nombre,
                region: faena.region,
                inicio: faena.inicio.toString(),
                fin: faena.fin.toString(),
            });
        }
    }, [faena]);



    if (!visible || !faena) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFaenaeditada(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/faena/${faena.id}`,
                {
                    nombre: faenaEditada.nombre,
                    region: faenaEditada.region,
                    inicio: faenaEditada.inicio,
                    fin: faenaEditada.fin,
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
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div className="flex flex-col gap-4">
                    <input
                        name="nombre"
                        value={faenaEditada.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        name="region"
                        value={faenaEditada.region}
                        onChange={handleChange}
                        placeholder="Region"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        name="inicio"
                        type="date"
                        value={faenaEditada.inicio}
                        onChange={handleChange}
                        placeholder="Fecha Inicio"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        name="fin"
                        type="date"
                        value={faenaEditada.fin}
                        onChange={handleChange}
                        placeholder="Fecha Final"
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
