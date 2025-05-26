"use client";

import { useState, useEffect } from "react";
import axios from "axios";


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

interface VehicleModelDto {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
    vehicleCount: number;
}

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}

interface VehicleTypeDTO {
    id: number;
    code: string;
    name: string;
}

interface ModaleditarEquipoProps {
    visible: boolean;
    onClose: () => void;
    vehicle: VehicleDTO | null;
    onGuardar: () => void;
}

export default function ModaleditarEquipo({
    visible,
    onClose,
    vehicle,
    onGuardar,
}: ModaleditarEquipoProps) {
    const [vehicleEdited, setVehicleEdited] = useState({
        code: "",
        modelId: null as number | null,
        typeId: null as number | null,
        siteId: null as number | null,
        kilometrage: null as number | null,
        hours: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [vehicleModels, setVehicleModels] = useState<VehicleModelDto[]>([]);
    const [sites, setSites] = useState<FaenaDTO[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeDTO[]>([]);

    useEffect(() => {
        if (vehicle) {
            console.log("faena", vehicle);
            setVehicleEdited({
                code: vehicle.code,
                modelId: vehicle.modelId,
                typeId: vehicle.typeId,
                siteId: vehicle.siteId,
                kilometrage: vehicle.kilometrage,
                hours: vehicle.hours,
            });
        }
    }, [vehicle]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/dataForm/registerVehicle");
            const data = await response.json();
            setLoading(false);
            setSites(data.sites);
            setVehicleModels(data.vehicleModels);
            setVehicleTypes(data.vehicleTypes);
            console.log("Data fetched:", data.vehicleTypes);
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

        const { code, modelId, typeId, siteId } = vehicleEdited;
        if (!code || !modelId || !typeId || !siteId == null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.patch(
                `https://inventory-service-emva.onrender.com/vehicles/${vehicle.id}`,
                {
                    code,
                    modelId,
                    siteId,
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
                <h2 className="text-xl font-bold mb-4">Editar Equipo</h2>
                <p className="text-sm mb-4">Edita los datos del equipo {vehicle.code}, rellene los campos que desee modificar.</p>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}

                <div className="grid grid-cols-2 gap-2">
                    {/* Lista de modelos */}
                    <label className="text-sm mt-2 font-semibold mb-2">Modelo</label>
                    <select
                        name="Modelo"
                        value={vehicleEdited.modelId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, modelId: Number(e.target.value) })
                        }
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona un modelo</option>
                        {vehicleModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.brand} {model.model}
                            </option>
                        ))}
                    </select>
                    {/* Lista de faenas */}
                    <label className="text-sm mt-2 font-semibold mb-2">Faena</label>
                    <select
                        name="Faena"
                        value={vehicleEdited.siteId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, siteId: Number(e.target.value) })
                        }
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona una faena</option>
                        {sites.map((site) => (
                            <option key={site.id} value={site.id}>
                                {site.name} - {site.region}
                            </option>
                        ))}
                    </select>
                    {/* Lista de tipos */}
                    <label className="text-sm mt-2 font-semibold mb-2">Tipo de Vehículo</label>
                    <select
                        name="Tipo"
                        value={vehicleEdited.typeId || ""}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, typeId: Number(e.target.value) })
                        }
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Selecciona un tipo de vehículo</option>
                        {vehicleTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.code} - {type.name}
                            </option>
                        ))}
                    </select>
                    {/* Codigo del vehiculo */}
                    <label className="text-sm mt-2 font-semibold mb-2">Código del equipo</label>
                    <input
                        name="Codigo"
                        value={vehicleEdited.code}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Código del equipo"
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
