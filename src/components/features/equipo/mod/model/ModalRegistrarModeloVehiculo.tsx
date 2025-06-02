"use client";

import { useState } from "react";
import axios from "axios";



interface ModalRegistarModeloVehiculoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistarModeloVehiculo({
    visible,
    onClose,
    onGuardar,
}: ModalRegistarModeloVehiculoProps) {

    const [vehicleModelEdited, setVehicleModelEdited] = useState({
        brand: "",
        model: "",
        wheelCount: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);




    if (!visible) return null;


    const registerModelVehicle = async () => {
        setError("");
        setLoading(true);

        const { brand, model, wheelCount } = vehicleModelEdited;
        if (brand === "" || model === "" || wheelCount === null) {
            setError("Por favor complete todos los campos");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('https://inventory.neumasystem.site/vehicleModels', {
                brand,
                model,
                wheelCount,
            });
            console.log('Site Created:', response.data);
            setVehicleModelEdited({
                brand: "",
                model: "",
                wheelCount: null,
            });

            onGuardar();
            onClose();
            return response.data; // Devuelve los datos del objeto creado


        } catch (error) {
            console.error('Error creating Vehicle Model:', error);
            throw error; // Lanza el error para manejarlo en el componente


        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar Nuevo Modelo de Equipo</h2>
                <p className="text-sm text-gray-500 mb-2">
                    Completa los campos para registrar un nuevo modelo de vehículo.
                </p>
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">
                        Marca del Modelo
                    </label>
                    <input
                        name="Marca"
                        value={vehicleModelEdited.brand}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, brand: e.target.value.toUpperCase() })
                        }
                        placeholder="Marca"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Modelo del Equipo</label>
                    <input
                        name="Modelo"
                        value={vehicleModelEdited.model}
                        onChange={
                            (e) => setVehicleModelEdited({ ...vehicleModelEdited, model: e.target.value.toUpperCase() })
                        }
                        placeholder="Modelo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Cantidad de Ruedas</label>
                    <input
                        name="cantidadRuedas"
                        type="number"
                        min={0}
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
                        onClick={registerModelVehicle}
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
