"use client";
import { useState, useEffect } from "react";
import axios from "axios";


interface ModeloNeumatico {
    id: number;
    marca: string;
    dimension: string;
    tipo: string;
    profundidad: number;
    TKPH: number;
}
interface Neumatico {

    codigo: string;
    modeloId: number;
    remanente: number;
    kilometraje: number;
}

interface ModalCrearNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: (neumatico: Neumatico) => void;
    onSuccess?: () => void;
}

export default function ModalCrearNeumatico({
    visible,
    onClose,
    onGuardar,
    onSuccess,
}: ModalCrearNeumaticoProps) {

    const modeloNeumatico = [
        {
            id: 1,
            marca: "Bridgestone",
            dimension: "46/90R57",
            tipo: "VREV E3A E4 **",
            profundidad: 97,
            TKPH: 1230,
        }
    ]

    const [codigo, setCodigo] = useState<string>("");
    const [modelo, setModelo] = useState<ModeloNeumatico | null>(null);
    const [remanente, setRemanente] = useState<number>(0);
    const [kilometraje, setKilometraje] = useState<number>(0);

    useEffect(() => {
        setRemanente(modelo ? modelo.profundidad : 0);
    }, [modelo]);

    const [error, setError] = useState<string>("");

    if (!visible) return null;

    const handleSubmit = async () => {
        try {

            if (!codigo || !modelo?.id || !remanente || !kilometraje) {
                setError("Por favor, complete todos los campos requeridos.");
                return;
            }

            onGuardar({
                codigo,
                modeloId: modelo.id,
                remanente,
                kilometraje,

            });
            onClose();
            setCodigo("");

            // Llamar a onSuccess si está definido
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error("Error en handleSubmit:", err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err instanceof Error ? err.message : "Error al registrar el usuario");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">
                    Crear nuevo Neumatico
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Complete los campos requeridos para registrar un nuevo neumatico al stock.
                </p>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <div className="space-y-3">
                    <label className="text-sm font-semibold">
                        Codigo Interno<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Codigo"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)}
                    />
                    <label className="text-sm font-semibold">
                        Modelo<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={modelo ? modelo.id : ""}
                        onChange={e => {
                            setModelo(modeloNeumatico.find(modelo => modelo.id === Number(e.target.value)) || null);

                        }}
                    >
                        <option value="">Seleccione un modelo</option>
                        {modeloNeumatico.length > 0 ? (
                            modeloNeumatico.map(modelo => (
                                <option key={modelo.id} value={modelo.id}>
                                    {modelo.marca} - {modelo.dimension} - {modelo.TKPH}
                                </option>
                            ))
                        ) : (
                            <option value="">Cargando modelos...</option>
                        )}
                    </select>

                    <label className="text-sm font-semibold">
                        Remanente<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Remanente"
                        disabled={modelo ? false : true}
                        className={`w-full p-2 border border-gray-300 rounded ${modelo ? "" : "text-gray-200"}`}
                        value={remanente}
                        onChange={e => setRemanente(Number(e.target.value))}
                    />
                    <label className="text-sm font-semibold">
                        Kilometraje inicial<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        disabled={modelo ? false : true}
                        placeholder="Kilometraje"
                        className={`w-full p-2 border border-gray-300 rounded ${modelo ? "" : "text-gray-200"}`}
                        value={kilometraje}
                        onChange={e => setKilometraje(
                            Number(e.target.value)
                        )}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">

                    <button
                        onClick={handleSubmit}
                        className="bg-amber-300 hover:bg-amber-400 text-black px-4 py-2 rounded font-bold"
                    >
                        Registrar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-black font-semibold px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
