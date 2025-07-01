"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { OrdenTrabajoForm } from "./ModalCrearOrden";
import {
    RetirementReasonDTO,
    InstalledTireDTO,
    InstallationData,
} from "@/types/ordenTrabajoTypes";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    datos: OrdenTrabajoForm;
    setDatos: (fn: (prev: OrdenTrabajoForm) => OrdenTrabajoForm) => void;
    onBack: () => void;
    onNext: () => void;
}

export default function Step3Desinstalacion({ datos, setDatos, onBack, onNext }: Props) {
    const axios = useAxiosWithAuth();
    const { user } = useAuth();
    const [razonesRetiro, setRazonesRetiro] = useState<RetirementReasonDTO[]>([]);

    const handleDesmontaje = async () => {
        const instalaciones = datos.instalaciones || [];

        for (const ins of instalaciones) {
            const instalado = getTireInstalado(ins.posicion);
            if (!instalado) continue;

            const tireId = instalado.tire.id;
            const { finalInternalTread, finalExternalTread, razonRetiroId } = ins;

            if (
                !tireId ||
                finalInternalTread === undefined ||
                finalExternalTread === undefined ||
                !razonRetiroId
            ) continue;

            try {
                await axios.post("/procedures/uninstall-tire", {
                    tireId,
                    retirementReasonId: razonRetiroId,
                    executionDate: new Date().toISOString(),
                    executionFinal: new Date().toISOString(),
                    internalTread: finalInternalTread,
                    externalTread: finalExternalTread,
                });
            } catch (error) {
                console.error("Error al desmontar neumático:", error);
            }
        }
    };

    useEffect(() => {
        const fetchRazones = async () => {
            try {
                const res = await axios.get(`/retirement-reason`);
                setRazonesRetiro(res.data || []);
            } catch (error) {
                console.error("Error cargando razones de retiro:", error);
            }
        };

        fetchRazones();
    }, [axios]);

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

    const getTireInstalado = (posicion: number): InstalledTireDTO | undefined => {
        return datos.vehicle?.installedTires?.find((i) => i.position === posicion);
    };

    return (
        <div className="space-y-2 w-full">
            <h3 className="text-lg font-semibold mb-4">Desinstalación de Neumáticos</h3>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(datos.posicionesSeleccionadas ?? []).map((pos) => {
                    const instalado = getTireInstalado(pos);
                    const actual: InstallationData = datos.instalaciones.find((i) => i.posicion === pos) ?? { posicion: pos };

                    return (
                        <section key={pos} className="border p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
                            <h4 className="font-bold mb-3">Posición {pos}</h4>

                            {instalado ? (
                                <div className="bg-gray-100 dark:bg-neutral-700 p-3 rounded">
                                    <p className="font-semibold text-sm mb-2">Neumático actual: {instalado.tire.code}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-medium mb-1">Remanente Final Interno</label>
                                            <input
                                                type="number"
                                                value={actual.finalInternalTread || ""}
                                                placeholder={instalado?.tire?.lastInspection.internalTread?.toString() || ""}
                                                onChange={(e) => handleChange(pos, "finalInternalTread", Number(e.target.value))}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium mb-1">Remanente Final Externo</label>
                                            <input
                                                type="number"
                                                value={actual.finalExternalTread || ""}
                                                placeholder={instalado?.tire.lastInspection?.externalTread?.toString() || ""}
                                                onChange={(e) => handleChange(pos, "finalExternalTread", Number(e.target.value))}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block font-medium mb-1">Razón de Desinstalación</label>
                                            <select
                                                value={actual.razonRetiroId || ""}
                                                onChange={(e) => handleChange(pos, "razonRetiroId", Number(e.target.value))}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="">Seleccionar razón</option>
                                                {razonesRetiro.map((r) => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.description}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm italic text-gray-500 dark:text-gray-300">No hay neumático instalado en esta posición.</p>
                            )}
                        </section>
                    );
                })}
            </main>

            <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={onBack}>Atrás</Button>
                <Button onClick={async () => {
                    await handleDesmontaje();
                    onNext();
                }}>Siguiente</Button>
            </div>
        </div>
    );
}