// ModalEditarModeloCadena.tsx
// Este componente permite editar los datos de un modelo de cadena específico

import { useState, useEffect } from "react";
import { X } from "lucide-react";

import Label from "@/components/common/forms/Label";
import { useAuth } from "@/contexts/AuthContext";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";

interface ModeloCadena {
    id: number;
    code: string;
    model: string;
    meshPattern: string;
    meshDesign: string;
    tireSize: string;
}

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
    modeloCadena: ModeloCadena;
}

export default function ModalEditarModeloCadena({ visible, onClose, onGuardar, modeloCadena }: ModalProps) {
    const client = useAxiosWithAuth();
    const { isDemo, user } = useAuth();
    const [codigo, setCodigo] = useState("");
    const [modelo, setModelo] = useState("");
    const [patron, setPatron] = useState("");
    const [diseno, setDiseno] = useState("");
    const [tamano, setTamano] = useState("");

    // Cargar los datos iniciales del modelo seleccionado
    useEffect(() => {
        if (modeloCadena) {
            setCodigo(modeloCadena.code);
            setModelo(modeloCadena.model);
            setPatron(modeloCadena.meshPattern);
            setDiseno(modeloCadena.meshDesign);
            setTamano(modeloCadena.tireSize);
        }
    }, [modeloCadena, user]);

    const handleGuardar = async () => {
        const payload = {
            code: codigo,
            model: modelo,
            meshPattern: patron,
            meshDesign: diseno,
            tireSize: tamano,
        };
        await client.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chain-model/${modeloCadena.id}`, payload);
        onGuardar();
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] dark:text-white p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Modelo de Cadena</h2>

                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Editar Modelo de Cadena</h2>
                <div className="space-y-3">
                    <Label title="Código" isNotEmpty={true} />
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Código"
                        className="w-full p-2 border rounded"
                    />
                    <Label title="Modelo" isNotEmpty={true} />
                    <input
                        type="text"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        placeholder="Modelo"
                        className="w-full p-2 border rounded"
                    />
                    <Label title="Patrón de Malla" isNotEmpty={true} />
                    <input
                        type="text"
                        value={patron}
                        onChange={(e) => setPatron(e.target.value)}
                        placeholder="Patrón de Malla"
                        className="w-full p-2 border rounded"
                    />
                    <Label title="Diseño de Malla" isNotEmpty={true} />
                    <input
                        type="text"
                        value={diseno}
                        onChange={(e) => setDiseno(e.target.value)}
                        placeholder="Diseño de Malla"
                        className="w-full p-2 border rounded"
                    />
                    <Label title="Tamaño de Neumático" isNotEmpty={true} />
                    <input
                        type="text"
                        value={tamano}
                        onChange={(e) => setTamano(e.target.value)}
                        placeholder="Tamaño de Neumático"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    disabled={isDemo}
                    className={"mt-4 w-full bg-amber-400  text-black py-2 rounded font-semibold" + (isDemo ? " cursor-not-allowed opacity-70" : "hover:bg-amber-500")}
                    onClick={handleGuardar}
                >
                    Guardar Cambios
                </button>
            </div>
        </div>

    );
}
