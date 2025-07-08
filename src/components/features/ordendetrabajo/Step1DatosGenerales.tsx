"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuth } from "@/contexts/AuthContext";
import { OrdenTrabajoForm } from "./ModalCrearOrden";
import { LocationDTO } from "@/types/ordenTrabajoTypes";

interface Props {
    datos: OrdenTrabajoForm;
    setDatos: (fn: (prev: OrdenTrabajoForm) => OrdenTrabajoForm) => void;
    onNext: () => void;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Step1DatosGenerales({ datos, setDatos, onNext }: Props) {
    const client = useAxiosWithAuth();
    const { user } = useAuth();
    const [locations, setLocations] = useState<LocationDTO[]>([]);

    const [error, setError] = useState<string | null>(null);

    const fetchLocations = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/location-maintenance/`);
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };
    useEffect(() => {
        if (user) {
            fetchLocations();
        }

        // Solo setear responsable una vez al cargar (no si lo borra manualmente)
        if (user && datos.responsibleName === undefined) {
            setDatos((prev) => ({
                ...prev,
                responsibleName: `${user.name ?? ""} ${user.last_name ?? ""}`.trim(),
            }));
        }
    }, [user]);

    const handleNext = () => {
        const errores: string[] = [];

        if (!datos.entryDate || !datos.dispatchDate) {
            errores.push("Debes ingresar ambas fechas.");
        } else if (dayjs(datos.dispatchDate).isBefore(dayjs(datos.entryDate))) {
            errores.push("La fecha de despacho no puede ser anterior a la de ingreso.");
        }

        if (!datos.responsibleName?.trim()) errores.push("Debes ingresar el nombre del responsable.");
        if (!datos.description?.trim()) errores.push("Debes ingresar la descripción del trabajo.");
        if (!datos.locationMaintenanceId) errores.push("Debes seleccionar una ubicación.");
        if (!datos.type) errores.push("Debes seleccionar el tipo de intervención.");
        if (!datos.shift) errores.push("Debes seleccionar un turno.");
        if (!datos.peopleCount || datos.peopleCount < 1) errores.push("Cantidad de personas inválida.");

        if (errores.length > 0) {
            setError(errores.join("\n"));
            return;
        }

        onNext();
    };
    return (
        <div className="space-y-6">
            <section className="border rounded-xl p-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <span>📅</span> Información General
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Ingresa los datos básicos de la orden de trabajo
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Fecha y Hora de Ingreso</label>
                        <input
                            type="datetime-local"
                            value={
                                datos.entryDate ? dayjs(datos.entryDate).tz("America/Santiago").format("YYYY-MM-DDTHH:mm") : ""
                            }
                            onChange={(e) => {
                                const newDate = dayjs.tz(e.target.value, "America/Santiago");
                                setDatos((prev) => ({ ...prev, entryDate: newDate.toISOString() }));
                            }}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fecha y hora de Despacho</label>
                        <input
                            type="datetime-local"
                            value={
                                datos.dispatchDate
                                    ? dayjs(datos.dispatchDate).tz("America/Santiago").format("YYYY-MM-DDTHH:mm")
                                    : ""
                            }
                            onChange={(e) => {
                                const newDate = dayjs.tz(e.target.value, "America/Santiago");
                                setDatos((prev) => ({ ...prev, dispatchDate: newDate.toISOString() }));
                            }}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Responsable</label>
                        <input
                            type="text"
                            value={datos.responsibleName}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, responsibleName: e.target.value }))
                            }
                            placeholder="Nombre del responsable"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        {
                            error && (
                                <div className="text-red-500 text-sm mb-2 bg-red-50 border border-red-500 p-2 rounded-md">
                                    {error}
                                </div>
                            )
                        }
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Descripción</label>
                        <textarea
                            value={datos.description}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Describe el trabajo a realizar…"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Ubicación</label>
                        <select
                            value={datos.locationMaintenanceId || ""}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, locationMaintenanceId: Number(e.target.value) }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Selecciona una ubicación</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Tipo de Intervención</label>
                        <select
                            value={datos.type}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, type: e.target.value }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Selecciona el tipo</option>
                            <option value="imprevisto">Imprevisto</option>
                            <option value="correctiva">Correctiva</option>
                            <option value="programada">Programada</option>
                            <option value="apoyo">Apoyo Mecánico</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Cantidad de Personas</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={datos.peopleCount}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, peopleCount: Number(e.target.value) }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Turno</label>
                        <select
                            value={datos.shift}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, shift: e.target.value }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Selecciona un turno</option>
                            <option value="diurno">Diurno</option>
                            <option value="nocturno">Nocturno</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="flex justify-end">
                <Button onClick={handleNext}>Siguiente</Button>
            </div>
        </div>
    );
}