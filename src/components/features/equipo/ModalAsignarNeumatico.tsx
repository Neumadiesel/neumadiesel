"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import { TireDTO } from "@/types/Tire";


interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    typeId: number;
    kilometrage: number;
    hours: number;
    model: {
        id: number;
        brand: string;
        model: string;
        wheelCount: number;
    };
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    };
}

interface ModalAsignarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    vehicle: VehicleDTO | null;
    onGuardar: () => void;
}

export default function ModalAsignarNeumatico({
    visible,
    onClose,
    vehicle,
    onGuardar,
}: ModalAsignarNeumaticoProps) {
    const [posicion, setPosition] = useState<number | null>(null);
    const [tireIdSelected, setTireIdSelected] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tires, setTires] = useState<TireDTO[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/tires/available");
            const data = await response.json();
            setTires(data);
            console.log("Neumaticos", data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    if (!visible || !vehicle) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);


        if (!vehicle.code || !posicion === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        const vehicleId = vehicle.id;
        const position = Number(posicion);
        const tireId = Number(tireIdSelected);
        try {
            const response = await axios.post(
                `http://localhost:3002/installed-tires`,
                {
                    vehicleId,
                    position,
                    tireId,
                },
            );
            setPosition(null);
            setTireIdSelected(null);
            fetchData();
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

    const filteredTires = tires.filter((tire) => {
        if (posicion === 1 || posicion === 2) {
            return tire.lastInspection === null;
        }

        return true;
    });

    const handleClose = () => {
        setPosition(null);
        setTireIdSelected(null);
        setError(null);
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Instalar Neumatico</h2>
                <p className="text-sm mb-4">
                    Seleccione el neumatico a instalar y la posicion en el equipo {vehicle.code}
                </p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}

                <div className="grid grid-cols-2 gap-2">
                    {/* Lista de modelos */}
                    <Label title="Modelo" isNotEmpty={true} />
                    <input
                        name="Codigo Equipo"
                        value={vehicle.code}
                        disabled
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Lista de posiciones segun el nuemro de ruedas dado en el modelo */}
                    <Label title="Posicion" isNotEmpty={true} />
                    <select
                        value={posicion ?? ""}
                        onChange={(e) => setPosition(Number(e.target.value))}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="" disabled>
                            Seleccione una posicion
                        </option>
                        {Array.from({ length: vehicle.model.wheelCount }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {`Posicion ${index + 1}`}
                            </option>
                        ))}
                    </select>
                    {/* Lista de neumaticos */}
                    <Label title="Neumatico" isNotEmpty={true} />
                    <select
                        disabled={posicion === null}
                        value={tireIdSelected ?? ""}
                        onChange={(e) => setTireIdSelected(Number(e.target.value))}
                        className={`border border-gray-300 p-2 rounded ${posicion === null ? "opacity-50" : ""}`}
                    >
                        <option value="" disabled>
                            Seleccione un neumatico
                        </option>
                        {filteredTires.map((tire) => (
                            tire.locationId !== 1 && (
                                <option key={tire.id} value={tire.id}>
                                    {`${tire.code} - ${tire.model.brand} ${tire.model.dimensions} ${tire.lastInspection ? (`| INT: ${tire.lastInspection?.internalTread} | EXT: ${tire.lastInspection?.externalTread}`) : ('| Nuevo')}   `}
                                </option>
                            )
                        ))}
                    </select>
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
                        onClick={handleClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
