"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { OrdenTrabajoForm } from "./ModalCrearOrden";
import { TireDTO, InstallationData } from "@/types/ordenTrabajoTypes";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";

interface Props {
    datos: OrdenTrabajoForm;
    setDatos: (fn: (prev: OrdenTrabajoForm) => OrdenTrabajoForm) => void;
    onBack: () => void;
    onConfirm: () => Promise<void>;
}

export default function Step4Instalacion({ datos, setDatos, onBack, onConfirm }: Props) {
    const axios = useAxiosWithAuth();
    const { user } = useAuth();
    const [neumaticosDisponibles, setNeumaticosDisponibles] = useState<TireDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNeumaticos = async () => {
            try {
                const res = await axios.get(`/tires/available/site/${user?.faena_id}`);
                setNeumaticosDisponibles(res.data || []);
            } catch (error) {
                console.error("Error cargando neumáticos disponibles:", error);
            }
        };

        fetchNeumaticos();
    }, [axios, user]);

    const handleChange = (
        posicion: number,
        field: keyof InstallationData,
        value: number | string
    ) => {
        setDatos((prev) => {
            const nuevas = [...(prev.instalaciones || [])];
            const index = nuevas.findIndex((i) => i.posicion === posicion);
            if (index !== -1) {
                nuevas[index] = { ...nuevas[index], [field]: value };
            } else {
                nuevas.push({ posicion, [field]: value });
            }
            return { ...prev, instalaciones: nuevas };
        });
    };

    const handleSubmitInstalacion = async () => {
        setLoading(true);
        setError(null);

        try {
            const executionDate = dayjs(new Date(datos.entryDate!)).toISOString();
            const executionFinal = dayjs(new Date(datos.dispatchDate!)).toISOString();
            const vehicleId = datos.vehicleId!;

            for (const instalacion of datos.instalaciones) {
                const {
                    nuevoTireId,
                    posicion,
                    internalTread,
                    externalTread,
                } = instalacion;

                if (!nuevoTireId || !posicion || internalTread === undefined || externalTread === undefined) {
                    continue; // Ignora los incompletos
                }

                console.log("datos", nuevoTireId, posicion, internalTread, externalTread, vehicleId, executionDate, executionFinal);
                await axios.post(`/procedures/install-tire`, {
                    tireId: nuevoTireId,
                    vehicleId,
                    position: posicion,
                    executionDate,
                    executionFinal,
                    internalTread,
                    externalTread,
                });
            }

            await onConfirm();
        } catch (err) {
            console.error("Error al instalar neumáticos:", err);
            setError("Ocurrió un error al instalar los neumáticos.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="space-y-2 w-full">
            <h3 className="text-lg font-semibold mb-4">Instalación de Nuevos Neumáticos</h3>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(datos.posicionesSeleccionadas ?? []).map((pos) => {
                    const actual: InstallationData = datos.instalaciones.find((i) => i.posicion === pos) ?? { posicion: pos };

                    return (
                        <section key={pos} className="border p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
                            <h4 className="font-bold mb-4">Posición {pos}</h4>

                            <div className="mb-3">
                                <label className="block font-medium mb-1">Neumático a instalar</label>
                                <select
                                    value={actual.nuevoTireId || ""}
                                    onChange={(e) => handleChange(pos, "nuevoTireId", Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Seleccionar neumático</option>
                                    {neumaticosDisponibles.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.code} ({t.model?.dimensions}) -  ext: {t.lastInspection.externalTread}mm - int: {t.lastInspection.internalTread}mm
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {actual.nuevoTire && (
                                <div className="mt-2 p-3 rounded-md bg-gray-100 dark:bg-neutral-700 text-sm">
                                    <p><strong>Código:</strong> {actual.nuevoTire.code}</p>
                                    <p><strong>Marca:</strong> {actual.nuevoTire.model.brand || "N/A"}</p>
                                    <p><strong>Modelo:</strong> {actual.nuevoTire.model?.code || "N/A"}</p>
                                    <p><strong>Dimensiones:</strong> {actual.nuevoTire.model?.dimensions || "N/A"}</p>
                                    <p><strong>Remanente original:</strong> {actual.nuevoTire.model?.originalTread ?? "N/A"}</p>
                                    {/* Agrega más campos si lo deseas */}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-1">Remanente interno</label>
                                    <input
                                        type="number"
                                        value={actual.internalTread ?? ""}
                                        placeholder={actual.internalTread?.toString()}
                                        onChange={(e) =>
                                            handleChange(pos, "internalTread", Number(e.target.value))
                                        }
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Remanente externo</label>
                                    <input
                                        type="number"
                                        value={actual.externalTread ?? ""}
                                        onChange={(e) =>
                                            handleChange(pos, "externalTread", Number(e.target.value))
                                        }
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>


                            </div>
                        </section>
                    );
                })}
            </main>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={onBack}>Atrás</Button>
                <Button disabled={loading} onClick={handleSubmitInstalacion}>
                    {loading ? "Guardando..." : "Confirmar Orden"}
                </Button>
            </div>
        </div>
    );
}