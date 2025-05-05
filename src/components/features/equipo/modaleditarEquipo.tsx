"use client";

import { useState, useEffect } from "react";
import axios from "axios";


interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
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
        siteId: null as number | null,
        kilometrage: null as number | null,
        hours: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [vehicleModels, setVehicleModels] = useState<VehicleModelDto[]>([]);
    const [sites, setSites] = useState<FaenaDTO[]>([]);

    useEffect(() => {
        if (vehicle) {
            console.log("faena", vehicle);
            setVehicleEdited({
                code: vehicle.code,
                modelId: vehicle.modelId,
                siteId: vehicle.siteId,
                kilometrage: vehicle.kilometrage,
                hours: vehicle.hours,
            });
        }
    }, [vehicle]);

    const fetchFaenas = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/sites/with-contract");
            const data = await response.json();
            setLoading(false);
            setSites(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/vehicleModels");
            const data = await response.json();
            setLoading(false);
            setVehicleModels(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
        fetchVehicleModels();
    }, []);


    if (!visible || !vehicle) return null;


    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        const { code, modelId, siteId, hours, kilometrage } = vehicleEdited;
        if (!code || !modelId || !siteId || hours === null || kilometrage === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        try {
            const response = await axios.patch(
                `http://localhost:3002/vehicles/${vehicle.id}`,
                {
                    code,
                    modelId,
                    siteId,
                    hours,
                    kilometrage
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
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Equipo</h2>
                <p className="text-sm mb-4">Edita los datos del equipo {vehicle.code}, rellene los campos que desee modificar.</p>

                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError(null)} className=" text-red-500">
                        X
                    </button>
                </div>}

                <div className="flex flex-col">
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
                    {/* Codigo del vehiculo */}
                    <label className="text-sm mt-2 font-semibold mb-2">Codigo del equipo</label>
                    <input
                        name="Codigo"
                        value={vehicleEdited.code}
                        onChange={
                            (e) => setVehicleEdited({ ...vehicleEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo del equipo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas */}

                    <label className="text-sm mt-2 font-semibold mb-2">Horas de trabajo</label>
                    <input
                        name="horas"
                        type="number"
                        value={vehicleEdited.hours === null ? "" : vehicleEdited.hours}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVehicleEdited({
                                ...vehicleEdited,
                                hours: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="Horas trabajadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje */}
                    <label className="text-sm mt-2 font-semibold mb-2">Kilometraje</label>
                    <input
                        name="kilometraje"
                        type="number"
                        value={vehicleEdited.kilometrage === null ? "" : vehicleEdited.kilometrage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setVehicleEdited({
                                ...vehicleEdited,
                                kilometrage: val === "" ? null : Number(val),
                            });
                        }
                        }
                        placeholder="Kilometraje"
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
