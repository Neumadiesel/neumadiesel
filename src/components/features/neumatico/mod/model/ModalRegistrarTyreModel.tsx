"use client";

import { useState } from "react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";


interface ModalRegistrarTyreModelProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarTyreModel({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarTyreModelProps) {
    const [tyreModelEdited, setTyreModelEdited] = useState({
        code: "",
        brand: "",
        dimensions: "",
        constructionType: "",
        pattern: "",
        originalTread: null as number | null,
        TKPH: null as number | null,
        nominalHours: null as number | null,
        nominalKilometrage: null as number | null,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    if (!visible) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { code, brand, dimensions, constructionType, pattern, originalTread, TKPH, nominalHours, nominalKilometrage } = tyreModelEdited;
        if (!code || !brand || !dimensions || originalTread === null) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `https://inventory.neumasystem.site/tiremodels/`,
                {
                    code,
                    brand,
                    dimensions,
                    constructionType,
                    pattern,
                    originalTread,
                    TKPH,
                    nominalHours,
                    nominalKilometrage
                },
            );

            setTyreModelEdited({
                code: "",
                brand: "",
                dimensions: "",
                constructionType: "",
                pattern: "",
                originalTread: null,
                TKPH: null,
                nominalHours: null,
                nominalKilometrage: null,
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

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar Modelo de Neumatico</h2>
                <p className="text-sm text-gray-500 mb-4">Completa los campos para registrar un nuevo modelo de neumatico.</p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    <Label title="Marca" isNotEmpty={true} />
                    <input
                        name="Marca"
                        value={tyreModelEdited.brand}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, brand: e.target.value.toUpperCase() })
                        }
                        placeholder="Marca"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Codigo */}
                    <Label title="Codigo" isNotEmpty={true} />
                    <input
                        name="Codigo"
                        value={tyreModelEdited.code}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Dimensiones */}
                    <Label title="Dimensiones" isNotEmpty={true} />
                    <input
                        name="Dimensiones"
                        value={tyreModelEdited.dimensions}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, dimensions: e.target.value })
                        }
                        placeholder="Dimensiones"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Patron */}
                    <Label title="Patron" isNotEmpty={true} />
                    <input
                        name="Patron"
                        value={tyreModelEdited.pattern}
                        onChange={
                            (e) => setTyreModelEdited({ ...tyreModelEdited, pattern: e.target.value.toUpperCase() })
                        }
                        placeholder="Patron"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Goma original */}
                    <Label title="Goma Original" isNotEmpty={true} />
                    <input
                        name="originalTread"
                        type="number"
                        value={tyreModelEdited.originalTread === null ? "" : tyreModelEdited.originalTread}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                originalTread: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="Goma Original"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* TKPH */}
                    <Label title="TKPH" isNotEmpty={false} />
                    <input
                        name="tkph"
                        type="number"
                        value={tyreModelEdited.TKPH === null ? "" : tyreModelEdited.TKPH}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                TKPH: val === "" ? null : Number(val),
                            });
                        }}
                        placeholder="TKPH"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas nominales */}
                    <Label title="Horas Nominales" isNotEmpty={false} />
                    <input
                        name="horasNominales"
                        type="number"
                        value={tyreModelEdited.nominalHours === null ? "" : tyreModelEdited.nominalHours}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                nominalHours: val === "" ? null : Number(val),
                            });
                        }
                        }
                        placeholder="Horas Nominales"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje nominal */}
                    <Label title="Kilometraje Nominal" isNotEmpty={false} />
                    <input
                        name="kilometrajeNominal"
                        type="number"
                        value={tyreModelEdited.nominalKilometrage === null ? "" : tyreModelEdited.nominalKilometrage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTyreModelEdited({
                                ...tyreModelEdited,
                                nominalKilometrage: val === "" ? null : Number(val),
                            });
                        }
                        }
                        placeholder="Kilometraje Nominal"
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
