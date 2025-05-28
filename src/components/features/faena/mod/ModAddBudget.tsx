"use client";
import { useState } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";

interface ModAddBudgetProps {
    visible: boolean;
    siteId: number;
    onClose: () => void;
    onGuardar: () => void;
}

type MesBudget = {
    nombre: string;
    numero: number;
    cantidadNeumaticos: number;
};

type Budget = {
    year: number;
    meses: MesBudget[];
};

const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export default function ModAddBudget({
    visible,
    siteId,
    onClose,
    onGuardar,
}: ModAddBudgetProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [budgetData, setBudgetData] = useState<Budget>({
        year: new Date().getFullYear(),
        meses: MESES.map((nombre, i) => ({
            nombre,
            numero: i + 1,
            cantidadNeumaticos: 0,
        })),
    });

    if (!visible) return null;



    const handleChangeYear = (value: number) => {
        setBudgetData({ ...budgetData, year: value });
    };

    const handleSubmitBudget = async () => {
        setError(null);
        setLoading(true);
        // Comprobar que todos los meses tengan un valor
        const allMonthsValid = budgetData.meses.every(mes => mes.cantidadNeumaticos >= 0);
        if (!allMonthsValid) {
            setError("Todos los meses deben tener un valor mayor o igual a 0.");
            setLoading(false);
            return;
        }
        try {
            for (const mes of budgetData.meses) {
                await axios.post('http://localhost:3002/montyhle-tire-budget/', {
                    siteId: siteId,
                    year: budgetData.year,
                    month: mes.numero,
                    tireCount: mes.cantidadNeumaticos,
                });
            }

            onGuardar();
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80" />
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar Budget Anual</h2>
                <p className="text-sm text-gray-500 mb-2">
                    Ingrese el presupuesto anual de neumáticos para la faena.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Si no se ingresa un valor para un mes, se considerará como 0 unidades.
                </p>

                {error && (
                    <div className="text-red-500 bg-red-50 border border-red-300 p-2 rounded-sm text-sm flex justify-between">
                        {error}
                        <button onClick={() => setError(null)} className="text-red-500 font-bold">X</button>
                    </div>
                )}

                {/* Año */}
                <div className="mt-4">
                    <Label title="Año" isNotEmpty />
                    <input
                        type="number"
                        className="w-full p-2 border rounded-md dark:bg-[#313131] dark:text-white"
                        placeholder="Ingrese el año del presupuesto"
                        value={budgetData.year}
                        onChange={(e) => handleChangeYear(Number(e.target.value))}
                        min={2025}
                    />
                </div>

                {/* Meses */}
                <div className="mt-4">
                    <Label title="Meses" isNotEmpty />
                    <div className="grid grid-cols-3 gap-4">
                        {budgetData.meses.map((mes, index) => (
                            <input
                                key={index}
                                type="number"
                                className="w-full p-2 border rounded-md dark:bg-[#313131] dark:text-white"
                                placeholder={`Mes ${index + 1}`}
                                value={mes.cantidadNeumaticos === 0 ? "" : mes.cantidadNeumaticos}
                                min={0}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    const updatedMeses = [...budgetData.meses];
                                    updatedMeses[index].cantidadNeumaticos = isNaN(value) ? 0 : value;
                                    setBudgetData({ ...budgetData, meses: updatedMeses });
                                }}
                            />
                        ))}

                    </div>
                </div>
                {/* Resumen */}
                <div className="mt-6 bg-green-50 p-4 rounded-md">
                    <h3 className="text-lg font-semibold text-black">Resumen del Budget Anual</h3>
                    <div className="grid grid-cols-3 mt-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="block text-gray-500">Total Anual:</span>
                            <span className="text-xl font-bold text-black">
                                {budgetData.meses.reduce((acc, mes) => acc + mes.cantidadNeumaticos, 0)} unidades
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Promedio Mensual:</span>
                            <span className="text-xl font-bold text-black">
                                {(budgetData.meses.reduce((acc, mes) => acc + mes.cantidadNeumaticos, 0) / 12).toFixed(1)} unidades
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Meses con Budget:</span>
                            <span className="text-xl font-bold text-black">
                                {budgetData.meses.filter(m => m.cantidadNeumaticos > 0).length}/12
                            </span>
                        </div>
                    </div>
                </div>
                {/* Botones */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSubmitBudget}
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
