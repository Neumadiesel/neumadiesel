"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { OrdenTrabajoForm } from "./ModalCrearOrden";
import { TireDTO, InstallationData } from "@/types/ordenTrabajoTypes";
import { useAuth } from "@/contexts/AuthContext";
import dayjs from "dayjs";
import ModalRegistrarNeumatico from "../neumatico/mod/tire/ModalRegistrarNeumatico";

interface Props {
    datos: OrdenTrabajoForm;
    setDatos: (fn: (prev: OrdenTrabajoForm) => OrdenTrabajoForm) => void;
    onBack: () => void;
    onConfirm: () => Promise<void>;
}

export default function Step4Instalacion({ datos, setDatos, onBack, onConfirm }: Props) {
    const client = useAxiosWithAuth();
    const { user, siteId } = useAuth();
    const [neumaticosDisponibles, setNeumaticosDisponibles] = useState<TireDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [filtrosPorPosicion, setFiltrosPorPosicion] = useState<Record<number, { codigo: string; dimension: string }>>({});



    const setFiltro = (pos: number, campo: "codigo" | "dimension", valor: string) => {
        setFiltrosPorPosicion(prev => ({
            ...prev,
            [pos]: {
                ...prev[pos],
                [campo]: valor,
            },
        }));
    };


    useEffect(() => {
        if (user) fetchNeumaticos();
    }, [user]);

    const fetchNeumaticos = async () => {
        try {
            const res = await client.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/site/${siteId}`);
            const filtered = (res.data || []).filter((n: TireDTO) => n.locationId === 10 || n.locationId === 2);
            console.log("Neumáticos disponibles:", filtered);
            setNeumaticosDisponibles(filtered);
        } catch (error) {
            console.error("Error cargando neumáticos disponibles:", error);
        }
    };

    const handleChange = (
        posicion: number,
        field: keyof InstallationData,
        value: number | string | undefined
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
                const { nuevoTireId, posicion, internalTread, externalTread } = instalacion;
                if (!nuevoTireId || !posicion || internalTread === undefined || externalTread === undefined) continue;

                const response = await client.post(`/procedures/install-tire`, {
                    tireId: nuevoTireId,
                    vehicleId,
                    position: posicion,
                    executionDate,
                    executionFinal,
                    internalTread,
                    externalTread,
                });

                console.log("Respuesta de instalación:", response.data);

                setDatos(prev => ({
                    ...prev,
                    proceduresListId: [...(prev.proceduresListId || []), response.data.procedure.id]
                }));
                console.log("Procedimientos Instalacion", datos.proceduresListId)
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
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Aquí puedes ingresar los datos de los neumáticos que serán instalados. Asegúrate de completar todos los campos requeridos.
            </p>

            <Button onClick={() => setOpenRegisterModal(true)} className="mb-4">
                Crear Neumático
            </Button>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(datos.posicionesSeleccionadas ?? []).map((pos) => {
                    const actual: InstallationData = datos.instalaciones.find(i => i.posicion === pos) ?? { posicion: pos };
                    const codigoFiltro = filtrosPorPosicion[pos]?.codigo || "";
                    const dimensionFiltro = filtrosPorPosicion[pos]?.dimension || datos.dimension || "";


                    const idsSeleccionados = (datos.instalaciones ?? [])
                        .filter(i => i.nuevoTireId && i.posicion !== pos)
                        .map(i => i.nuevoTireId!);

                    const neumaticosFiltrados = neumaticosDisponibles
                        .filter(n => !idsSeleccionados.includes(n.id))
                        .filter(n => !dimensionFiltro || n.model?.dimensions === dimensionFiltro)
                        .filter(n => n.code.toLowerCase().includes(codigoFiltro.toLowerCase()))
                        .sort((a, b) => {
                            // Primero los de locationId == 2
                            if (a.locationId === 2 && b.locationId !== 2) return -1;
                            if (a.locationId !== 2 && b.locationId === 2) return 1;
                            // Luego por suma de remanente
                            const aTread = (a.lastInspection?.internalTread ?? 0) + (a.lastInspection?.externalTread ?? 0);
                            const bTread = (b.lastInspection?.internalTread ?? 0) + (b.lastInspection?.externalTread ?? 0);
                            return bTread - aTread;
                        });

                    return (
                        <section key={pos} className="border p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
                            <h4 className="font-bold mb-4">Posición {pos}</h4>

                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Filtrar por código"
                                    className="w-full mb-2 border rounded px-2 py-1"
                                    value={codigoFiltro}

                                    onChange={(e) => setFiltro(pos, "codigo", e.target.value)}
                                />
                                <select
                                    className="w-full mb-3 border rounded px-2 py-1"
                                    value={dimensionFiltro}
                                    onChange={(e) => setFiltro(pos, "dimension", e.target.value)}

                                >
                                    <option value="">Todas las dimensiones</option>
                                    {[...new Set(neumaticosDisponibles.map(n => n.model?.dimensions))].map(dim => (
                                        <option key={dim} value={dim}>{dim}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="block font-medium mb-1">Neumático a instalar</label>
                                <select
                                    value={actual.nuevoTireId || ""}
                                    onChange={(e) => handleChange(pos, "nuevoTireId", Number(e.target.value))}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Seleccionar neumático</option>
                                    {neumaticosFiltrados.map((t) => (
                                        <option key={t.id} value={t.id} className="bg-emerald-200">
                                            {t.locationId === 2 ? "(Nuevo)" : "(Stock)"} | {t.code} ({t.model?.dimensions}) - ext: {t.lastInspection?.externalTread ?? "-"}mm - int: {t.lastInspection?.internalTread ?? "-"}mm
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-1">Remanente interno</label>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Remanente interno"
                                        value={actual.internalTread ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleChange(pos, "internalTread", val === "" ? undefined : Number(val));
                                        }}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Remanente externo</label>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Remanente externo"
                                        value={actual.externalTread ?? ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            handleChange(pos, "externalTread", val === "" ? undefined : Number(val));
                                        }}
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

            {/* Modal para crear neumático */}
            <ModalRegistrarNeumatico
                visible={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onGuardar={() => {
                    setOpenRegisterModal(false);
                    fetchNeumaticos(); // Refresca lista tras crear
                }}
            />
        </div>
    );
}
