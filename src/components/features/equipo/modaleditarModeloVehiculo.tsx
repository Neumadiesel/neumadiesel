"use client";

import { useState, useEffect } from "react";
import axios from "axios";


interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number | null;
}


interface ModalEditarVehicleModelProps {
    visible: boolean;
    onClose: () => void;
    vehicleModel: VehicleModelDto | null;
    onGuardar: () => void;
}

export default function ModalEditarVehicleModel({
    visible,
    onClose,
    vehicleModel,
    onGuardar,
}: ModalEditarVehicleModelProps) {
    const [vehicleModelEdited, setVehicleModelEdited] = useState({
        brand: "",
        model: "",
        wheelCount: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (vehicleModel) {
            console.log("faena", vehicleModel);
            setVehicleModelEdited({
                brand: vehicleModel.brand,
                model: vehicleModel.model,
                wheelCount: vehicleModel.wheelCount || 0,
            });
        }
    }, [vehicleModel]);



    if (!visible || !vehicleModel) return null;


    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        const { brand, model, wheelCount } = vehicleModelEdited;
        if (!brand || !model || !wheelCount) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        try {
            const response = await axios.patch(
                `http://localhost:3002/vehicleModels/${vehicleModel.id}`,
                {
                    brand,
                    model,
                    wheelCount,
                },
            );

            if (response.status !== 200) {
                throw new Error("Error al actualizar la faena");
            }

            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar la faena");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Modelo de Equipo</h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">Marca</label>
                    <input
                        name="nombre"
                        value={vehicleModelEdited.brand}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, brand: e.target.value })
                        }
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Modelo</label>
                    <input
                        name="region"
                        value={vehicleModelEdited.model}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, model: e.target.value })
                        }
                        placeholder="Region"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Cantidad de Ruedas</label>
                    <input
                        name="cantidadRuedas"
                        type="number"
                        value={vehicleModelEdited.wheelCount === null ? "" : vehicleModelEdited.wheelCount}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVehicleModelEdited({
                                ...vehicleModelEdited,
                                wheelCount: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="Cantidad de Ruedas"
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
