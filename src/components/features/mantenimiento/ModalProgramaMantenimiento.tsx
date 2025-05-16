"use client";
import { useState } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";

interface ProgramDTO {
    code: string;
    date: string;
    description: string;
}

interface ModalProgramaMantenimientoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalProgramaMantenimiento({
    visible,
    onClose,
    onGuardar,
}: ModalProgramaMantenimientoProps) {
    const [newProgram, setNewProgram] = useState<ProgramDTO>({
        code: "",
        date: "",
        description: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { code, date, description } = newProgram;
        if (
            !code ||
            !date ||
            !description
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `https://inventory-service-emva.onrender.com/maintenance-program/`,
                {
                    vehicleCode: code,
                    scheduledDate: date,
                    description: description,
                },
            );

            setNewProgram({
                code: "",
                date: "",
                description: ""
            });
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };


    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white h-[55dvh] dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Programar Nuevo Mantenimiento</h2>
                <p className="text-sm text-gray-500 mb-4">Completa los campos para programar un nuevo mantenimiento.</p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo */}
                    <Label title="Codigo Equipo" isNotEmpty={true} />
                    <input
                        name="Codigo Equipo"
                        value={newProgram.code}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo"
                        className="border border-gray-300 p-2 rounded"
                    />

                    {/* Fecha de Mantenimiento */}
                    <Label title="Fecha de Mantenimiento" isNotEmpty={true} />
                    <input
                        name="fechaMantenimiento"
                        type="date"
                        value={newProgram.date}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, date: e.target.value })
                        }
                        placeholder="Fecha de Mantenimiento"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Descripcion del trabajo */}
                    <Label title="Descripcion del trabajo" isNotEmpty={true} />
                    <textarea
                        name="descripcionTrabajo"
                        value={newProgram.description}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, description: e.target.value.toUpperCase() })
                        }
                        placeholder="Descripcion del trabajo"
                        className="border border-gray-300 h-[20dvh] p-2 rounded"
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
