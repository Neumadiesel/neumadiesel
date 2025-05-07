"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import { Location } from "@/types/Location";
import { TyreModelDto } from "@/types/TyreModelDTO";


interface ModalRegistrarNeumaticoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarNeumatico({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarNeumaticoProps) {
    const [tyreModelEdited, setTyreModelEdited] = useState({
        code: "",
        modelId: null as number | null,
        locationId: null as number | null,
        initialTread: null as number | null,
        initialKilometrage: null as number | null,
        initialHours: null as number | null
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [tireModels, setTireModels] = useState<TyreModelDto[]>([]);
    const [selectedModel, setSelectedModel] = useState<TyreModelDto | null>(null);



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

    const fetchModelTire = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/tireModels");
            const data = await response.json();
            setLoading(false);
            setTireModels(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };


    useEffect(() => {
        fetchLocations();
        fetchModelTire();
        console.log("selected", selectedModel)
    }, []);

    const handleSubmit = async () => {
        setError(null as string | null);
        setLoading(true);

        const {
            code, modelId, locationId, initialTread, initialKilometrage, initialHours
        } = tyreModelEdited;
        console.log(tyreModelEdited);
        if (
            !code ||
            modelId === null ||
            locationId === null ||
            initialTread === null ||
            initialKilometrage === null ||
            initialHours === null
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }


        if (selectedModel && initialTread > selectedModel.originalTread) {
            setError(`La goma inicial no puede ser mayor a la original del modelo (${selectedModel.originalTread})`);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3002/tires/`,
                {
                    code,
                    modelId,
                    locationId,
                    initialTread,
                    initialKilometrage,
                    initialHours,
                },
            );

            setTyreModelEdited({
                code: "",
                modelId: null,
                locationId: null,
                initialTread: null,
                initialKilometrage: null,
                initialHours: null
            });
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };


    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar Nuevo Neumatico</h2>
                <p className="text-sm text-gray-500 mb-4">Completa los campos para registrar un nuevo neumatico.</p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError(null as string | null)} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo */}
                    <Label title="Codigo" isNotEmpty={true} />
                    <input
                        name="Codigo Neumatico"
                        value={tyreModelEdited.code}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Locacion */}
                    <Label title="Locacion" isNotEmpty={true} />
                    <select
                        name="locacion"
                        value={tyreModelEdited.locationId === null ? "" : tyreModelEdited.locationId}
                        onChange={(e) => setTyreModelEdited({ ...tyreModelEdited, locationId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Locacion</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                    {/* Modelo */}
                    <Label title="Modelo" isNotEmpty={true} />
                    <select
                        name="modelo"
                        value={tyreModelEdited.modelId === null ? "" : tyreModelEdited.modelId}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedModel = tireModels.find((model) => model.id === selectedId);
                            setSelectedModel(selectedModel || null);
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                modelId: selectedId,
                                initialTread: selectedModel?.originalTread ?? null,
                            });
                        }}
                        disabled={loading}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Modelo</option>
                        {tireModels.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.code} - {model.dimensions}
                            </option>
                        ))}
                    </select>

                    {/* Goma original */}
                    <Label title="Goma Inicial" isNotEmpty={true} />
                    <input
                        disabled={selectedModel === null}
                        value={tyreModelEdited.initialTread === null ? "" : tyreModelEdited.initialTread}
                        name="gomaInicial"
                        type="number"
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialTread: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="Goma Inicial"
                        className={`border border-gray-300 p-2 rounded ${selectedModel === null ? "opacity-50" : ""}`}
                    />
                    {/* KM inicial */}
                    <Label title="KM Inicial" isNotEmpty={true} />
                    <input
                        name="kmInicial"
                        type="number"
                        value={tyreModelEdited.initialKilometrage === null ? "" : tyreModelEdited.initialKilometrage}
                        onChange={(e) => {
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialKilometrage: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}

                        placeholder="KM Inicial"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas inciales */}
                    <Label title="Horas Iniciales" isNotEmpty={true} />
                    <input
                        name="horasIniciales"
                        type="number"
                        value={tyreModelEdited.initialHours === null ? "" : tyreModelEdited.initialHours}
                        onChange={(e) => {
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                initialHours: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}
                        placeholder="Horas Iniciales"
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
