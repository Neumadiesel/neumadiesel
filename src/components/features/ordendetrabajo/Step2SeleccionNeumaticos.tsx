"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import dayjs from "dayjs";
import { OrdenTrabajoForm } from "./ModalCrearOrden";
import { ProgramasDTO, VehicleDTO } from "@/types/ordenTrabajoTypes";
import QuickProgramForm from "./QuickProgramForm";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    datos: OrdenTrabajoForm;
    setDatos: (fn: (prev: OrdenTrabajoForm) => OrdenTrabajoForm) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2SeleccionNeumaticos({ datos, setDatos, onNext, onBack }: Props) {
    const axios = useAxiosWithAuth();
    const { siteId } = useAuth();
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);
    const [programas, setProgramas] = useState<ProgramasDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errorKms, setErrorKms] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const buscarEquipoYProgramas = async () => {
        try {
            // Buscar vehículo por código


            const veh = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/${siteId}/${datos.vehicleCode}`);
            const vehiculo = veh.data;

            setVehicle(vehiculo);
            setDatos((prev) => ({
                ...prev,
                vehicleId: vehiculo.id,
                siteId: vehiculo.siteId,
                vehicle: vehiculo,
                code: `OT-${vehiculo.code}-${dayjs().format("YYYYMMDD-HHmm")}`,
            }));

            // Calcular fecha desde 10 días antes hasta 10 días después
            const hoy = dayjs().startOf("day");
            const inicio = hoy.subtract(10, "day");
            const fin = hoy.add(10, "day");

            // Obtener programas dentro del rango
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/time-period/${inicio.toISOString()}/${fin.toISOString()}`
            );
            const data = res.data as ProgramasDTO[];

            // Filtrar por código de vehículo y estado distinto de "completado"
            const filtrados = data.filter(
                (p) =>
                    p.vehicle.code === datos.vehicleCode &&
                    p.status.toLowerCase() !== "completada"
            );

            // Guardar los IDs seleccionados
            const seleccionados = filtrados.map((p) => p.id);

            setDatos((prev) => ({
                ...prev,
                programasSeleccionados: seleccionados,
            }));

            setProgramas(filtrados);
        } catch (err) {
            console.error("Error al buscar equipo o programas", err);
        }
    };

    const togglePrograma = (id: number) => {
        setDatos((prev) => {
            const seleccionados = (prev.programasSeleccionados ?? []).includes(id)
                ? (prev.programasSeleccionados ?? []).filter((pid) => pid !== id)
                : [...(prev.programasSeleccionados ?? []), id];
            return { ...prev, programasSeleccionados: seleccionados };
        });
    };

    const togglePosicion = (pos: number) => {
        setDatos((prev) => {
            const posiciones = (prev.posicionesSeleccionadas ?? []).includes(pos)
                ? (prev.posicionesSeleccionadas ?? []).filter((p) => p !== pos)
                : [...(prev.posicionesSeleccionadas ?? []), pos];
            return { ...prev, posicionesSeleccionadas: posiciones };
        });
    };

    const handleSaveKms = async () => {
        setErrorKms(null);
        setSuccess(false);

        if (!vehicle || datos.hours == null || datos.kilometrage == null) {
            setErrorKms("Por favor, completa todos los campos.");
            return;
        }

        const isInvalid = (val: number | null) =>
            val === null ||
            isNaN(val) ||
            typeof val !== "number" ||
            val < 0 ||
            val.toString().includes("-") ||
            val.toString().startsWith("000") ||
            val.toString().endsWith(".");

        if (isInvalid(datos.kilometrage) || isInvalid(datos.hours)) {
            setErrorKms("Formato inválido. Se restauraron los valores originales.");
            setDatos(prev => ({
                ...prev,
                kilometrage: vehicle.kilometrage,
                hours: vehicle.hours,
            }));
            return;
        }

        if (datos.kilometrage < vehicle.kilometrage) {
            setErrorKms("El kilometraje no puede ser menor al actual.");
            setDatos(prev => ({ ...prev, kilometrage: vehicle.kilometrage }));
            return;
        }

        if (datos.hours < vehicle.hours) {
            setErrorKms("Las horas no pueden ser menores a las actuales.");
            setDatos(prev => ({ ...prev, hours: vehicle.hours }));
            return;
        }

        setLoading(true);
        try {
            await axios.patch(`/vehicles/updateKms/${vehicle.id}`, {
                hours: datos.hours,
                kilometrage: datos.kilometrage,
                hoursAdded: datos.hours - vehicle.hours,
                kilometrageAdded: datos.kilometrage - vehicle.kilometrage,
            });
            setSuccess(true);
        } catch (err) {
            console.error("Error al actualizar vehículo:", err);
            setErrorKms("Error al actualizar. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (datos.vehicleCode) {
            buscarEquipoYProgramas();
        }
    }, [datos.vehicleCode, siteId]);

    const handleNext = () => {
        const errores: string[] = [];

        if (!datos.vehicleId) {
            errores.push("Debes buscar y seleccionar un equipo antes de continuar.");
        }

        if (datos.kilometrage == null || isNaN(datos.kilometrage)) {
            errores.push("Debes ingresar un kilometraje válido.");
        }

        if (datos.hours == null || isNaN(datos.hours)) {
            errores.push("Debes ingresar una cantidad de horas válida.");
        }

        if (!datos.posicionesSeleccionadas || datos.posicionesSeleccionadas.length === 0) {
            errores.push("Debes seleccionar al menos una posición de neumático.");
        }

        // Si programas son obligatorios:
        // if (!datos.programasSeleccionados || datos.programasSeleccionados.length === 0) {
        //     errores.push("Debes seleccionar al menos un programa de mantenimiento.");
        // }

        if (errores.length > 0) {
            setError(errores.join("\n"));
            return;
        }

        onNext();
    };

    return (
        <div className="space-y-6">
            <section className="border rounded-xl p-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">

                    <h3 className="text-xl font-bold ">🔧 Selección de Programas y Equipo</h3>
                    <div className="max-w-1/2">
                        {
                            error && (
                                <div className="text-red-500 text-sm mb-2 bg-red-50 border border-red-500 p-2 rounded-md">
                                    {error}
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        placeholder="Código del equipo"
                        value={datos.vehicleCode || ""}
                        onChange={(e) =>
                            setDatos((prev) => ({
                                ...prev,
                                vehicleCode: e.target.value.toUpperCase(),
                            }))
                        }
                        className="flex-1 border rounded-lg px-3 py-2 dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors"
                    />
                    <Button onClick={buscarEquipoYProgramas}>Buscar</Button>
                </div>

                {vehicle && (
                    <>
                        <div className="mb-2 text-sm text-gray-700 dark:text-white">
                            Equipo encontrado: <strong>{vehicle.model.brand} {vehicle.model.model}</strong> con <strong>{vehicle.model.wheelCount}</strong> posiciones, km actual: <strong>{vehicle.kilometrage || 0}</strong> y horas actuales: <strong>{vehicle.hours || 0}</strong>.
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kilometraje actual</label>
                                <input
                                    type="number"
                                    value={datos.kilometrage || ""}
                                    onChange={(e) =>
                                        setDatos((prev) => ({
                                            ...prev,
                                            kilometrage: e.target.value === "" ? 0 : Number(e.target.value),
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder={`Original: ${vehicle.kilometrage || 0}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Horas actuales</label>
                                <input
                                    type="number"
                                    value={datos.hours || ""}
                                    onChange={(e) =>
                                        setDatos((prev) => ({
                                            ...prev,
                                            hours: e.target.value === "" ? 0 : Number(e.target.value),
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder={`Ej: ${vehicle.hours || 0}`}
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-between mb-4">

                            <Button
                                onClick={handleSaveKms}
                                disabled={loading || !vehicle || datos.kilometrage == null || datos.hours == null}
                                className={`bg-amber-300 text-black font-semibold px-4 py-2 rounded ${loading || !vehicle || datos.kilometrage == null || datos.hours == null ? 'opacity-50' : 'hover:bg-amber-400'
                                    }`}
                            >
                                {loading ? "Guardando..." : "Guardar cambios de KMs/Horas"}
                            </Button>
                            {/* Div de error  */}
                            <div>

                                {success && (
                                    <div className="text-black font-bold text-sm mb-2 bg-emerald-50 border border-emerald-500 p-2 rounded-md">
                                        Kilometraje y horas actualizados correctamente.
                                    </div>

                                )}
                                {
                                    errorKms && (
                                        <div className="text-red-500 text-sm mb-2 bg-red-50 border border-red-500 p-2 rounded-md">
                                            {errorKms}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )}

                {vehicle && (
                    <QuickProgramForm
                        vehicleCode={vehicle.code}
                        siteId={vehicle.siteId}
                        onCreated={buscarEquipoYProgramas} // recargar programas al crear uno nuevo
                    />
                )}

                <div className="space-y-2">
                    <h4 className="text-xl font-semibold mb-2">Programas de Mantenimiento:</h4>
                    {programas.map((program) => (
                        <label key={program.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={datos.programasSeleccionados?.includes(program.id)}
                                onChange={() => togglePrograma(program.id)}
                                className="accent-amber-300 h-4 w-4"
                            />
                            {program.description} - {dayjs(program.scheduledDate).format("DD/MM/YYYY")} ({program.vehicle.code})
                        </label>
                    ))}
                </div>
            </section>

            {vehicle && (
                <section className="border rounded-xl p-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">🚛 Selecciona posiciones</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Selecciona las posiciones de neumáticos para el equipo {vehicle.model.brand} {vehicle.model.model}.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: vehicle.model.wheelCount }, (_, i) => i + 1).map((pos) => (
                            <label key={pos} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={datos.posicionesSeleccionadas?.includes(pos)}
                                    onChange={() => togglePosicion(pos)}
                                    className="accent-amber-300 h-4 w-4"
                                />
                                Posición {pos}
                            </label>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={onBack}>
                    Atrás
                </Button>
                <Button onClick={handleNext}>Siguiente</Button>
            </div>
        </div>
    );
}