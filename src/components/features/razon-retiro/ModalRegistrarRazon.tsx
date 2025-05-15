"use client";

import { useState } from "react";
import axios from "axios";

interface ModalRegistrarRazonProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarRazon({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarRazonProps) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!visible) return null;

    const registerRetirementReason = async () => {
        setError("");
        setLoading(true);
        if (name === "" || description === "") {
            setError("Por favor complete todos los campos");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('https://inventory-service-emva.onrender.com/retirement-reason', {
                name,
                description,
            });

            console.log('Retirement Reason Created:', response.data);
            setName("");
            setDescription("");
            onGuardar();
            onClose();
            return response.data; // Devuelve los datos del objeto creado
        } catch (error) {
            console.error('Error creating Retirement Reason:', error);
            throw error; // Lanza el error para manejarlo en el componente


        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-xl w-full">
                <h2 className="text-xl font-bold">Registar Razon de Retiro</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Complete los campos para registrar una nueva razon de retiro.
                </p>
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">Razon de retiro</label>
                    <input
                        name="razon"
                        value={name}
                        onChange={
                            (e) => setName(e.target.value)
                        }
                        placeholder="Razon"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Descripción</label>
                    <input
                        name="descripcion"
                        value={description}
                        onChange={
                            (e) => setDescription(e.target.value)
                        }
                        placeholder="Descripción"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={registerRetirementReason}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : "Registrar Razon"}
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
