"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TireDTO } from "@/types/Tire";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
interface LocationDTO {
    id: number;
    name: string;
}

interface ModalEditarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    tire: TireDTO | null;
    onGuardar: () => void;
}

export default function ModalEditarNeumatico({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalEditarNeumaticoProps) {
    const [tireEdited, setTireEdited] = useState({
        code: "",
        locationId: null as number | null,
        usedHours: "",
        usedKilometrage: "",
    });
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory.neumasystem.site/locations");
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

        try {
            const response = await axios.patch(
                `https://inventory.neumasystem.site/tires/${tire.id}`,
                {
                    code,
                    locationId,
                    usedHours: Number(usedHours),
                    usedKilometrage: Number(usedKilometrage),
                },
            );

            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:text-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Información del Neumatico</h2>

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
                        value={tireEdited.locationId ?? ""}
                        onChange={(e) => setTireEdited({ ...tireEdited, locationId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Ubicación</option>
                        {locations
                            .filter((location) => location.name !== "Operativo" && location.name !== "Baja")
                            .map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                    </select>
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
