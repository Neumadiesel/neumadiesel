"use client";

import { useState, useEffect } from "react";
import axios from "axios";


interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract?: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
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
        name: "",
        region: "",
        startDate: "",
        endDate: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (faena) {
            console.log("faena", faena);
            setFaenaeditada({
                name: faena.name,
                region: faena.region,
                startDate: faena.contract?.startDate ? faena.contract.startDate.split("T")[0] : "",
                endDate: faena.contract?.endDate ? faena.contract.endDate.split("T")[0] : "",
            });
        }
    }, [faena]);



    if (!visible || !faena) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { name, region, startDate, endDate } = faenaEditada;
        if (!name || !region || !startDate || !endDate) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("La fecha de inicio no puede ser mayor que la fecha de fin");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.patch(
                `http://localhost:3002/sites/${faena.id}`,
                {
                    name,
                    region,
                    contract: {
                        startDate: new Date(startDate).toISOString(),
                        endDate: new Date(endDate).toISOString(),
                    },
                },
            );

            if (response.status !== 200) {
                throw new Error("Error al actualizar la faena");
            }

            onGuardar();
            onClose();
            return response.data;
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
                        value={faenaEditada.name}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, name: e.target.value })
                        }
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Región</label>
                    <input
                        name="region"
                        value={faenaEditada.region}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, region: e.target.value })
                        }
                        placeholder="Region"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Fechas</label>
                    <input
                        name="inicio"
                        type="date"
                        value={faenaEditada.startDate}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, startDate: e.target.value })
                        }
                        placeholder="Fecha Inicio"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Fecha Final</label>
                    <input
                        name="fin"
                        type="date"
                        value={faenaEditada.endDate}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, endDate: e.target.value })
                        }
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
