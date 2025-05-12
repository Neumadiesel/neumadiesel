"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import { TireDTO } from "@/types/Tire";
import Label from "@/components/common/forms/Label";
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
        usedHours: null as number | null,
        usedKilometrage: null as number | null,
    });
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/locations");
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
                usedHours: tire.usedHours,
                usedKilometrage: tire.usedKilometrage,
            });
        }
    }, [tire]);

    useEffect(() => {
        fetchLocations();
    }
        , []);


    if (!visible || !tire) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        const { code, locationId, usedHours, usedKilometrage } = tireEdited;

        if (
            !code ||
            locationId === null ||
            usedHours === null ||
            usedKilometrage === null
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        try {
            const response = await axios.patch(
                `http://localhost:3002/tires/${tire.id}`,
                {
                    code,
                    locationId,
                    usedHours,
                    usedKilometrage,
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
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Modelo de Neumatico</h2>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo Neumatico */}
                    <Label title="Codigo Neumatico" isNotEmpty={true} />
                    <input
                        name="Codigo Neumatico"
                        value={tireEdited.code}
                        onChange={
                            (e) => setTireEdited({ ...tireEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo Neumatico"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Ubicacion */}
                    <Label title="Ubicacion" isNotEmpty={true} />
                    <select
                        value={tireEdited.locationId ?? ""}
                        onChange={(e) => setTireEdited({ ...tireEdited, locationId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Ubicacion</option>
                        {locations.map((location) => (
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
                        value={tireEdited.usedHours ?? ""}
                        onChange={
                            (e) => setTireEdited({ ...tireEdited, usedHours: Number(e.target.value) })
                        }
                        placeholder="Horas Usadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje Usado */}
                    <Label title="Kilometraje Usado" isNotEmpty={true} />
                    <input
                        name="Kilometraje Usado"
                        type="number"
                        value={tireEdited.usedKilometrage ?? ""}
                        onChange={
                            (e) => setTireEdited({ ...tireEdited, usedKilometrage: Number(e.target.value) })
                        }
                        placeholder="Kilometraje Usado"
                        className="border border-gray-300 p-2 rounded"
                    />

                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : "Guardar Cambios"}
                    </button>
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
