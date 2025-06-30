"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TireDTO } from "@/types/Tire";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuthFetch } from "@/utils/AuthFetch";
interface LocationDTO {
    id: number;
    name: string;
}

interface ModalStockDisponibleProps {
    visible: boolean;
    onClose: () => void;
    tire: TireDTO | null;
    onGuardar: () => void;
}

export default function ModalStockDisponible({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalStockDisponibleProps) {
    const [tireEdited, setTireEdited] = useState({
        code: "",
        locationId: null as number | null,
        usedHours: "",
        usedKilometrage: "",
        date: "",
        internalTread: tire?.lastInspection.internalTread || null,
        externalTread: tire?.lastInspection.externalTread || null,
    });
    const client = useAxiosWithAuth();

    const authFetch = useAuthFetch();
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations`);
            const data = await response.json();
            setLoading(false);
            setLocations(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    useEffect(() => {
        if (tire) {
            setTireEdited({
                code: tire.code,
                locationId: tire.location.id,
                usedHours: tire.usedHours?.toString() ?? "",
                usedKilometrage: tire.lastInspection.kilometrage?.toString() ?? "",
                date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
                internalTread: tire.lastInspection.internalTread,
                externalTread: tire.lastInspection.externalTread,
            });
        }
    }, [tire]);

    useEffect(() => {
        fetchLocations();
    }, []);

    if (!visible || !tire) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        const { code, locationId, usedHours, usedKilometrage } = tireEdited;

        if (
            !code ||
            usedHours === "" ||
            usedKilometrage === ""
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }
        console.log("Nueva Ubicacion:", locationId);
        try {
            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance/available/`,
                {
                    tireId: tire.id,
                    maintenanceReasonId: 2,
                    executionDate: tireEdited.date,
                    executionTime: 0,
                    externalTread: tireEdited.externalTread,
                    internalTread: tireEdited.internalTread,
                    hours: Number(usedHours),
                    kilometrage: Number(usedKilometrage),
                },
            );

            onGuardar();
            onClose();
            return response.data;
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
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:text-white border-l-10 border-l-emerald-300 dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">
                    Disponer Neumático para Stock
                </h2>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo Neumatico */}
                    <Label title="Código Neumático" isNotEmpty={true} />
                    <input
                        disabled={true}
                        name="Codigo Neumatico"
                        value={tireEdited.code}
                        onChange={
                            (e) => setTireEdited({ ...tireEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Código Neumático"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Ubicacion */}
                    <Label title="Ubicación" isNotEmpty={true} />
                    <select
                        disabled={true}
                        value={tireEdited.locationId ?? ""}
                        onChange={(e) => setTireEdited({ ...tireEdited, locationId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        {locations
                            .filter((location) => location.name === "Stock Disponibles")
                            .map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                    </select>
                    {/* Input de fecha de modificacion */}
                    <Label title="Fecha de Modificación" isNotEmpty={true} />
                    <input
                        type="date"
                        value={tireEdited.date}
                        onChange={(e) => setTireEdited({ ...tireEdited, date: e.target.value })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas Usadas */}
                    <Label title="Horas Usadas" isNotEmpty={true} />
                    <input
                        name="Horas Usadas"
                        type="number"
                        min="0"
                        value={tireEdited.usedHours}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // solo dígitos
                                setTireEdited({ ...tireEdited, usedHours: value });
                            }
                        }}
                        onBlur={() => {
                            if (tireEdited.usedHours === "") {
                                setTireEdited({ ...tireEdited, usedHours: "0" });
                            }
                        }}
                        placeholder="Horas Usadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje Usado */}
                    <Label title="Kilometraje Usado" isNotEmpty={true} />
                    <input
                        name="Kilometraje Usado"
                        type="number"
                        min="0"
                        value={tireEdited.usedKilometrage}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setTireEdited({ ...tireEdited, usedKilometrage: value });
                            }
                        }}
                        onBlur={() => {
                            if (tireEdited.usedKilometrage === "") {
                                setTireEdited({ ...tireEdited, usedKilometrage: "0" });
                            }
                        }}
                        placeholder="Kilometraje Usado"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Remantente externo */}
                    <Label title="Remanente Externo" isNotEmpty={true} />
                    <input
                        name="Remanente Externo"
                        type="number"
                        min="0"
                        placeholder="Remanente Externo"
                        className="border border-gray-300 p-2 rounded"
                        value={tireEdited.externalTread === null ? "" : tireEdited.externalTread}
                        onChange={(e) => {
                            setTireEdited({
                                ...tireEdited,
                                externalTread: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}
                    />

                    {/* Remanente interno */}
                    <Label title="Remanente Interno" isNotEmpty={true} />
                    <input
                        name="Remanente Interno"
                        type="number"
                        min="0"
                        placeholder="Remanente Interno"
                        className="border border-gray-300 p-2 rounded"
                        value={tireEdited.internalTread === null ? "" : tireEdited.internalTread}
                        onChange={(e) => {
                            setTireEdited({
                                ...tireEdited,
                                internalTread: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }
                        }
                    />

                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
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
