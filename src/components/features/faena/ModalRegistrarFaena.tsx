"use client";

import { useState } from "react";

import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";



interface ModalRegistrarFaenaProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalRegistrarFaena({
    visible,
    onClose,
    onGuardar,
}: ModalRegistrarFaenaProps) {
    const [faenaEditada, setFaenaeditada] = useState({
        name: "",
        region: "",
        startDate: "",
        endDate: "",
    });
    const [registerContract, setRegisterContract] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);




    if (!visible) return null;


    const registerSite = async () => {
        setError("");
        setLoading(true);
        const client = useAxiosWithAuth();
        const { name, region } = faenaEditada;
        if (name === "" || region === "") {
            setError("Por favor complete todos los campos");
            setLoading(false);
            return;
        }
        try {
            // verifica el checkbox 
            if (registerContract) {
                console.log("Checkbox is checked");
                console.log(new Date(faenaEditada.startDate).toISOString());

                const response = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/with-contract`, {

                    site: {
                        name,
                        region,
                        isActive: true,
                    },
                    contract: {
                        startDate: new Date(faenaEditada.startDate).toISOString(),
                        endDate: new Date(faenaEditada.endDate).toISOString(),
                    },
                });
                console.log('Site Created:', response.data);
                setFaenaeditada({
                    name: "",
                    region: "",
                    startDate: "",
                    endDate: "",
                });

                onGuardar();
                onClose();
                return response.data; // Devuelve los datos del objeto creado
            }
            // Si el checkbox no está marcado, crea la faena sin contrato
            else {

                const response = await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites`, {
                    name,
                    region,
                    isActive: true,
                });
                console.log('Site Created:', response.data);
                setFaenaeditada({
                    name: "",
                    region: "",
                    startDate: "",
                    endDate: "",
                });

                onGuardar();
                onClose();
                return response.data; // Devuelve los datos del objeto creado
            }

        } catch (error) {
            console.error('Error creating Retirement Reason:', error);
            throw error; // Lanza el error para manejarlo en el componente


        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold">Registrar nuevo contrato de faena</h2>
                <p className="text-sm text-gray-500 mb-2">
                    Completa los campos para registrar un nuevo contrato de faena, puede registrar el contrato de inmediato o registrarlo en un futuro.
                </p>
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col">
                    <label className="text-sm mt-2 font-semibold mb-2">Nombre de la Faena</label>
                    <input
                        name="nombre"
                        value={faenaEditada.name}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, name: e.target.value })
                        }
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Región</label>
                    <input
                        name="region"
                        value={faenaEditada.region}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, region: e.target.value })
                        }
                        placeholder="Región"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Chechbox para incluir contrato */}
                    <div className="flex items-center gap-x-2">
                        <label className="text-sm mt-2 font-semibold mb-2">Incluir contrato</label>
                        <input
                            name="contrato"
                            type="checkbox"
                            checked={registerContract}
                            onChange={
                                (e) => setRegisterContract(e.target.checked)
                            }
                            className="border border-gray-300 p-2 rounded"
                        />
                    </div>
                    <label className="text-sm mt-2 font-semibold mb-2">Fechas</label>
                    <input
                        name="inicio"
                        type="date"
                        disabled={!registerContract}
                        value={faenaEditada.startDate}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, startDate: e.target.value })
                        }
                        placeholder="Fecha Inicio"
                        className={`border border-gray-300 p-2 rounded ${registerContract ? "" : "opacity-50 "}`}
                    />
                    <label className="text-sm mt-2 font-semibold mb-2">Fecha Final</label>
                    <input
                        name="fin"
                        type="date"
                        disabled={!registerContract}
                        value={faenaEditada.endDate}
                        onChange={
                            (e) => setFaenaeditada({ ...faenaEditada, endDate: e.target.value })
                        }
                        placeholder="Fecha Final"
                        className={`border border-gray-300 p-2 rounded ${registerContract ? "" : "opacity-50 "}`}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={registerSite}
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
