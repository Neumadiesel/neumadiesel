"use client";
import { useState, useEffect } from "react";

import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";


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
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const client = useAxiosWithAuth();
    useEffect(() => {
        if (vehicleModel) {
            console.log("faena", vehicleModel);
            setVehicleModelEdited({
                brand: vehicleModel.brand,
                model: vehicleModel.model,
            });
        }
    }, [vehicleModel]);



    if (!visible || !vehicleModel) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { brand, model } = vehicleModelEdited;
        if (!brand || !model) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        try {
            const response = await client.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicleModels/${vehicleModel.id}`,
                {
                    brand,
                    model,
                },
            );

            if (response.status !== 200) {
                throw new Error("Error al actualizar la faena");
            }

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
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Modelo de Equipo</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">Marca</label>
                    <input
                        name="Marca"
                        value={vehicleModelEdited.brand}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, brand: e.target.value.toUpperCase() })
                        }
                        placeholder="Marca"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Modelo</label>
                    <input
                        name="Modelo"
                        value={vehicleModelEdited.model}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, model: e.target.value.toUpperCase() })
                        }
                        placeholder="Modelo"
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
