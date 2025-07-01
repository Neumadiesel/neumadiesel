"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import {
    OrderFormData,
    TireDTO,
    RetirementReasonDTO,
    InstalledTireDTO,
    InstallationData,
} from "@/types/ordenTrabajoTypes";

interface Props {
    datos: OrderFormData;
    setDatos: (fn: (prev: OrderFormData) => OrderFormData) => void;
    onBack: () => void;
    onConfirm: () => Promise<void>;
}

export default function Step3Confirmacion({ datos, setDatos, onBack, onConfirm }: Props) {
    const axios = useAxiosWithAuth();
    const [neumaticosDisponibles, setNeumaticosDisponibles] = useState<TireDTO[]>([]);
    const [razonesRetiro, setRazonesRetiro] = useState<RetirementReasonDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const siteId = datos?.vehicle?.siteId;
                if (!siteId) return;

                const [tiresRes, razonesRes] = await Promise.all([
                    axios.get(`/tires/available/site/${siteId}`),
                    axios.get(`/retirement-reason`)
                ]);

                setNeumaticosDisponibles(tiresRes.data || []);
                setRazonesRetiro(razonesRes.data || []);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };

        fetchData();
    }, [axios, datos?.vehicle]);

    const handleChange = (posicion: number, field: keyof OrderFormData["instalaciones"][0], value: any) => {
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
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Instalación de Neumáticos</h3>

            {datos.posicionesSeleccionadas.map((pos: number) => {
                const instalado = getTireInstalado(pos);
                const actual: InstallationData = datos.instalaciones.find((i: InstallationData) => i.posicion === pos) ?? { posicion: pos };
                return (
                    <section key={pos} className="border p-4 rounded-xl shadow bg-white dark:bg-neutral-800">
                        <h4 className="font-bold mb-2">Posición {pos}</h4>

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
                                        {t.code} ({t.model?.dimensions})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            {["remanente", "presion", "temperatura"].map((field) => (
                                <div key={field}>
                                    <label className="block font-medium mb-1 capitalize">{field}</label>
                                    <input
                                        type="number"
                                        value={(actual as any)[field] || ""}
                                        onChange={(e) =>
                                            handleChange(pos, field as keyof typeof actual, Number(e.target.value))
                                        }
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            ))}
                        </div>

                        {instalado && (
                            <div className="bg-gray-100 dark:bg-neutral-700 p-3 rounded">
                                <p className="font-semibold text-sm mb-2">Neumático actual: {instalado.tire.code}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-medium mb-1">Remanente Final</label>
                                        <input
                                            type="number"
                                            value={actual.remanenteFinal || ""}
                                            onChange={(e) => handleChange(pos, "remanenteFinal", Number(e.target.value))}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-1">Razón de Desinstalación</label>
                                        <select
                                            value={actual.razonRetiroId || ""}
                                            onChange={(e) => handleChange(pos, "razonRetiroId", Number(e.target.value))}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="">Seleccionar razón</option>
                                            {razonesRetiro.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                );
            })}

            <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={onBack}>Atrás</Button>
                <Button onClick={onConfirm}>Confirmar</Button>
            </div>
        </div>
    );
}