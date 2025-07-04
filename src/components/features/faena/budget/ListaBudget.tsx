'use client';
import { useEffect, useState } from "react";
import { BudgetChart } from "./BudgetChart";
import Button from "@/components/common/button/Button";
import ModAddBudget from "../mod/ModAddBudget";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import { Check, Pencil } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/utils/AuthFetch";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";

interface BudgetData {
    id: number;
    month: number;
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    }
    siteId: number;
    tireCount: number;
    year: number;
}

interface BudgetProps {
    siteId: number;
}

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Budget({ siteId }: BudgetProps) {
    const { isDemo, user } = useAuth();
    const [budget, setBudget] = useState<BudgetData[]>([]);
    const [budgetByYear, setBudgetByYear] = useState<BudgetData[]>([]);
    const [editedBudgetByYear, setEditedBudgetByYear] = useState<BudgetData[]>([]);
    const [loading, setLoading] = useState(true);
    const [modAddBudget, setModAddBudget] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editedBudgets, setEditedBudgets] = useState<{ [id: number]: string }>({});
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const authFetch = useAuthFetch();


    const client = useAxiosWithAuth();
    const fetchBudget = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/montyhle-tire-budget/site/${siteId}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            if (!response.ok) throw new Error("Error al obtener el presupuesto");
            const data = await response.json();

            setBudget(data);
        } catch (error) {
            console.error("Error al obtener el presupuesto:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgetByYear = async (year: number) => {
        setSelectedYear(year);
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/montyhle-tire-budget/site/${siteId}/year/${year}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            if (!response.ok) throw new Error("Error al obtener el presupuesto por año");
            const data = await response.json();

            setBudgetByYear(data);
            setEditedBudgetByYear(JSON.parse(JSON.stringify(data))); // Clonar
        } catch (error) {
            console.error("Error al obtener el presupuesto por año:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleSaveAll = async () => {
        setLoading(true);
        try {
            const updatePromises = Object.entries(editedBudgets).map(([budgetId, tireCountStr]) => {
                const tireCount = parseInt(tireCountStr);
                return client.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/montyhle-tire-budget/${budgetId}`, {
                    siteId,
                    tireCount: isNaN(tireCount) ? 0 : tireCount,
                });
            });
            await Promise.all(updatePromises);
            setEditedBudgets({});
            fetchBudgetByYear(budgetByYear[0]?.year);
        } catch (error) {
            console.error("Error al guardar los presupuestos:", error);
        } finally {
            setLoading(false);
            setIsEdit(false);
        }
    }

    useEffect(() => {
        fetchBudget();
        fetchBudgetByYear(selectedYear); // Cargar el presupuesto del año 2025 por defecto
    }, []);

    useEffect(() => {
        fetchBudget();
        fetchBudgetByYear(selectedYear); // Cargar el presupuesto del año 2025 por defecto
    }, [user]);

    return (
        <div className="p-6 bg-white h-auto min-h-screen dark:bg-[#212121] shadow-md rounded-lg">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center  w-full lg:w-2/3 pb-3">
                    <h2 className="text-2xl font-bold mt-4">Control de Budget - Neumáticos</h2>
                    <Button text="Ingresar Nuevo Budget" onClick={() => { setModAddBudget(true); fetchBudget() }} />
                </div>
                <div className="flex gap-2">
                    <div className="overflow-x-auto mt-2 w-1/2">
                        {budget.length > 0 && (
                            <div className="flex justify-between items-center">
                                <div className="flex flex-wrap gap-2 mb-2 w-full mr-2 bg-gray-50 dark:bg-[#2b2b2b] p-1 rounded-md">
                                    {Array.from(new Set(budget.map(item => item.year))).map(year => (
                                        <Button
                                            key={year}
                                            text={`Año ${year}`}
                                            onClick={() => fetchBudgetByYear(year)}
                                            className="bg-blue-600 text-black hover:bg-blue-700 rounded-md px-4 py-2"
                                        />
                                    ))}
                                </div>
                                {!isEdit ? (
                                    <ToolTipCustom content="Editar Neumáticos">
                                        <button
                                            disabled={isDemo}
                                            onClick={() => setIsEdit(true)}
                                            className="p-2 mb-2 px-2 text-green-500 hover:text-green-600 bg-green-50 dark:bg-neutral-800 border border-green-300 rounded-md flex items-center justify-center"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </ToolTipCustom>
                                ) : (
                                    <ToolTipCustom content="Guardar Cambios">
                                        <button
                                            onClick={handleSaveAll}
                                            className="p-2 mb-2 px-2 text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-neutral-800 border border-blue-300 rounded-md flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </ToolTipCustom>
                                )}
                            </div>
                        )}

                        <div className="mt-2">
                            {loading ? (
                                <div className="text-center text-gray-500 p-4">Cargando datos de presupuesto...</div>
                            ) : budgetByYear.length === 0 ? (
                                <div className="text-center text-gray-500 p-4">No hay datos de presupuesto disponibles.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {editedBudgetByYear.map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-100 dark:bg-[#2b2b2b] p-4 rounded-lg shadow-sm transition-shadow"
                                        >
                                            <div className="text-sm mb-2">
                                                Mes <span className="font-semibold">{monthNames[item.month - 1]}</span>
                                            </div>
                                            <div className="text-md w-40 h-10">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-sm">Neumáticos:</label>
                                                    <input
                                                        disabled={!isEdit}
                                                        type="number"
                                                        value={
                                                            isEdit
                                                                ? (editedBudgets[item.id] ?? item.tireCount.toString())
                                                                : item.tireCount.toString()
                                                        }
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            // Permitimos valores vacíos mientras el usuario escribe
                                                            if (/^\d*$/.test(newValue)) {
                                                                setEditedBudgets((prev) => ({
                                                                    ...prev,
                                                                    [item.id]: newValue,
                                                                }));
                                                            }
                                                        }}
                                                        className={"w-16 p-1 border rounded-md dark:bg-[#313131] dark:text-white font-bold" + (isEdit ? " bg-white" : "border-gray-50 bg-gray-100")}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 mt-4">
                        <BudgetChart year={selectedYear} siteId={siteId} />
                    </div>
                </div>
            </div>

            <ModAddBudget
                siteId={siteId}
                visible={modAddBudget}
                onClose={() => setModAddBudget(false)}
                onGuardar={() => setModAddBudget(false)}
            />
        </div>
    );
}
