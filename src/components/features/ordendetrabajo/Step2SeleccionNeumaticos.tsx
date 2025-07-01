"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import dayjs from "dayjs";
import { OrderFormData, ProgramasDTO, VehicleDTO } from "@/types/ordenTrabajoTypes";

interface Props {
    datos: OrderFormData;
    setDatos: (fn: (prev: OrderFormData) => OrderFormData) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2SeleccionNeumaticos({ datos, setDatos, onNext, onBack }: Props) {
    const axios = useAxiosWithAuth();
    const [vehicleCode, setVehicleCode] = useState<string>("");
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);
    const [programas, setProgramas] = useState<ProgramasDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const buscarEquipoYProgramas = async () => {
        try {
            const veh = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1/${vehicleCode}`);
            setVehicle(veh.data);
            setDatos((prev) => ({ ...prev, equipoId: veh.data.id, vehicle: veh.data, vehicleCode }));

            const hoy = dayjs().startOf("day");
            const fin = hoy.add(6, "day");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/time-period/${hoy.toISOString()}/${fin.toISOString()}`
            );
            const data = res.data as ProgramasDTO[];

            const seleccionados = data
                .filter((p) => p.vehicle.code === vehicleCode)
                .map((p) => p.id);
            setDatos((prev) => ({ ...prev, programasSeleccionados: seleccionados }));

            setProgramas(data);
        } catch (err) {
            console.error("Error al buscar equipo o programas", err);
        }
    };

    const togglePrograma = (id: number) => {
        setDatos((prev) => {
            const seleccionados = prev.programasSeleccionados.includes(id)
                ? prev.programasSeleccionados.filter((pid) => pid !== id)
                : [...prev.programasSeleccionados, id];
            return { ...prev, programasSeleccionados: seleccionados };
        });
    };

    const togglePosicion = (pos: number) => {
        setDatos((prev) => {
            const posiciones = prev.posicionesSeleccionadas.includes(pos)
                ? prev.posicionesSeleccionadas.filter((p) => p !== pos)
                : [...prev.posicionesSeleccionadas, pos];
            return { ...prev, posicionesSeleccionadas: posiciones };
        });
    };

    return (
        <div className="space-y-6">
            <section className="border rounded-xl p-6 bg-white dark:bg-neutral-800 dark:border-neutral-700 shadow-sm">
                <h3 className="text-xl font-bold mb-4">🔧 Selección de Programas y Equipo</h3>

                <div className="flex gap-2 mb-4">
                    <input
                        placeholder="Código del equipo"
                        value={vehicleCode}
                        onChange={(e) => setVehicleCode(e.target.value.toUpperCase())}
                        className="flex-1 border rounded-lg px-3 py-2 dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors"
                    />
                    <Button onClick={buscarEquipoYProgramas}>Buscar</Button>
                </div>

                {vehicle && (
                    <>
                        <div className="mb-2 text-sm text-gray-700 dark:text-white">
                            Equipo encontrado: <strong>{vehicle.model.brand} {vehicle.model.model}</strong> con <strong>{vehicle.model.wheelCount}</strong> posiciones
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
                                    placeholder="Ej: 546000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Horas actuales</label>
                                <input
                                    type="number"
                                    value={datos.horas || ""}
                                    onChange={(e) =>
                                        setDatos((prev) => ({
                                            ...prev,
                                            horas: Number(e.target.value),
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Ej: 70000"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="space-y-2">
                    <h4 className="text-xl font-semibold mb-2">Programas de Mantenimiento:</h4>
                    {programas.map((program) => (
                        <label key={program.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={datos.programasSeleccionados?.includes(program.id)}
                                onChange={() => togglePrograma(program.id)}
                                className=" accent-amber-300 h-4 w-4"
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
                                    className=" accent-amber-300 h-4 w-4"
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
                <Button onClick={onNext}>Siguiente</Button>
            </div>
        </div>
    );
}
