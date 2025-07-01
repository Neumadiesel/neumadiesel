"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuth } from "@/contexts/AuthContext";
import { OrderFormData, LocationDTO } from "@/types/ordenTrabajoTypes";

interface Props {
    datos: OrderFormData;
    setDatos: (fn: (prev: OrderFormData) => OrderFormData) => void;
    onNext: () => void;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Step1DatosGenerales({ datos, setDatos, onNext }: Props) {
    const client = useAxiosWithAuth();
    const { user } = useAuth();
    const [locations, setLocations] = useState<LocationDTO[]>([]);

    const fetchLocations = async () => {
        try {
            const response = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/location-maintenance/`);
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchLocations();
    }, [user]);

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
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={
                                    datos.fecha ? dayjs(datos.fecha).tz("America/Santiago").format("YYYY-MM-DDTHH:mm") : ""
                                }
                                onChange={(e) => {
                                    const newDate = dayjs.tz(e.target.value, "America/Santiago");
                                    setDatos((prev) => ({ ...prev, fecha: newDate.toISOString() }));
                                }}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fecha y hora de Despacho</label>
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={
                                    datos.fechaDespacho
                                        ? dayjs(datos.fechaDespacho).tz("America/Santiago").format("YYYY-MM-DDTHH:mm")
                                        : ""
                                }
                                onChange={(e) => {
                                    const newDate = dayjs.tz(e.target.value, "America/Santiago");
                                    setDatos((prev) => ({ ...prev, fechaDespacho: newDate.toISOString() }));
                                }}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Responsable</label>
                        <input
                            type="text"
                            value={datos.tecnico || (user ? `${user.name ?? ""} ${user.last_name ?? ""}` : "")}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, tecnico: e.target.value }))
                            }
                            placeholder="Nombre del responsable"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-medium mb-1">Descripción</label>
                        <textarea
                            value={datos.observaciones}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, observaciones: e.target.value }))
                            }
                            placeholder="Describe el trabajo a realizar…"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Ubicación</label>
                        <select
                            value={datos.locationId || ""}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, locationId: Number(e.target.value) }))
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
                            value={datos.tipoIntervencion || ""}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, tipoIntervencion: e.target.value }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="">Selecciona el tipo</option>
                            <option value="preventiva">Preventiva</option>
                            <option value="correctiva">Correctiva</option>
                            <option value="programada">Programada</option>
                            <option value="apoyo">Apoyo Mecanico</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Cantidad de Personas</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={datos.cantidadPersonas || ""}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, cantidadPersonas: e.target.value }))
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Turno</label>
                        <select
                            value={datos.turno || ""}
                            onChange={(e) =>
                                setDatos((prev) => ({ ...prev, turno: e.target.value }))
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
                <Button onClick={onNext}>Siguiente</Button>
            </div>
        </div>
    );
}
