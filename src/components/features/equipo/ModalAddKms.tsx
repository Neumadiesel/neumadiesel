"use client";

import { useState } from "react";

import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";


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

interface ModalAddKmsProps {
    visible: boolean;
    onClose: () => void;
    vehicle: VehicleDTO | null;
    onGuardar: () => void;
}

export default function ModalAddKms({
    visible,
    onClose,
    vehicle,
    onGuardar,
}: ModalAddKmsProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [kilometrage, setKilometrage] = useState<number | null>(null);
    const [hours, setHours] = useState<number | null>(null);
    const client = useAxiosWithAuth();
    if (!visible || !vehicle) return null;



    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        if (hours === null || kilometrage === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        if (kilometrage < vehicle.kilometrage) {
            setError("El kilometraje acumulado no puede ser menor al kilometraje actual");
            setLoading(false);
            return;
        }
        if (hours < vehicle.hours) {
            setError("Las horas acumuladas no pueden ser menores a las horas actuales");
            setLoading(false);
            return;
        }
        const kilometrageAdded = kilometrage - vehicle.kilometrage;
        const hoursAdded = hours - vehicle.hours;

        console.log("kilometrageAdded", kilometrageAdded);
        console.log("hoursAdded", hoursAdded);

        console.log("vehicleEdited", hours);
        console.log("vehicleEdited", kilometrage);

        try {
            const response = await client.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/updateKms/${vehicle.id}`,
                {
                    hours,
                    kilometrage,
                    hoursAdded,
                    kilometrageAdded,
                },
            );

            console.log("response", response.data);

            onGuardar();
            handleClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setLoading(false);
        setKilometrage(null);
        setHours(null);
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] dark:text-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Agregar Horas y kilómetros al Equipo</h2>
                <p className="text-sm mb-4">Ingrese las horas y los kilómetros acumulados para el equipo {vehicle.code}, se actualizarán las horas y los kilómetros de los neumáticos instalados.</p>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}

                <div className="grid grid-cols-2 gap-2">
                    {/* Kilometraje Actual */}
                    <label className="text-sm mt-2 font-semibold mb-2">Kilometraje Actual</label>
                    <input
                        name="kilometraje"
                        disabled
                        type="number"
                        min={0}
                        value={vehicle.kilometrage === null ? "" : vehicle.kilometrage}
                        placeholder="Kilometraje"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas actuales */}
                    <label className="text-sm mt-2 font-semibold mb-2">Horas Actuales</label>
                    <input
                        name="horas"
                        disabled
                        type="number"
                        min={0}
                        value={vehicle.hours === null ? "" : vehicle.hours} // Muestra el valor actual de `hours`
                        placeholder="Horas trabajadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 border-t pt-4">
                    {/* Kilometraje Nuevo */}
                    <label className="text-sm mt-2 font-semibold mb-2">Kilometraje Acumulado</label>
                    <input
                        name="kilometraje"
                        type="number"
                        min={vehicle.kilometrage}
                        value={kilometrage === null ? "" : kilometrage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setKilometrage(val === "" ? null : Number(val));
                        }
                        }
                        placeholder="Kilometraje"
                        className="border border-gray-300 p-2 rounded dark:placeholder:text-gray-500"
                    />
                    {/* Horas Nuevas */}
                    <label className="text-sm mt-2 font-semibold mb-2">Horas Acumuladas</label>
                    <input
                        name="horas"
                        type="number"
                        min={vehicle.hours}
                        value={hours === null ? "" : hours} // Muestra el valor actual de `hours`
                        onChange={(e) => {
                            const val = e.target.value;
                            setHours(val === "" ? null : Number(val)); // Actualiza el estado `hours`
                        }}
                        placeholder="Horas trabajadas"
                        className="border border-gray-300 p-2 rounded dark:placeholder:text-gray-500"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
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
