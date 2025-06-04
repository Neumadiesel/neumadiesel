// ModalRegistrarModeloCadena.tsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Label from "@/components/common/forms/Label";
import { useAuth } from "@/contexts/AuthContext";

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}
// Componente para registrar un nuevo modelo de cadena
export default function ModalRegistrarModeloCadena({ visible, onClose, onGuardar }: ModalProps) {
    const { isDemo } = useAuth();
    // Estados para los campos del formulario
    const [codigo, setCodigo] = useState("");
    const [modelo, setModelo] = useState("");
    const [patron, setPatron] = useState("");
    const [diseno, setDiseno] = useState("");
    const [size, setSize] = useState("");

    // Validamos visibilidad
    if (!visible) return null;

    // Acción para guardar nuevo modelo
    const handleGuardar = async () => {
        await axios.post("https://inventory.neumasystem.site/chain-model", {
            code: codigo,
            model: modelo,
            meshPattern: patron,
            meshDesign: diseno,
            tireSize: size,
        });
        onGuardar();
    };

    return (//
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Registrar Modelo de Cadena</h2>

                {/* Campos del formulario */}
                <div className="space-y-3">
                    <Label title="Código" isNotEmpty={true} />
                    <input type="text" placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full p-2 border rounded" />
                    <Label title="Modelo" isNotEmpty={true} />
                    <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full p-2 border rounded" />
                    <Label title="Patrón de Malla" isNotEmpty={true} />
                    <input type="text" placeholder="Patrón de Malla" value={patron} onChange={(e) => setPatron(e.target.value)} className="w-full p-2 border rounded" />
                    <Label title="Diseño de Malla" isNotEmpty={true} />
                    <input type="text" placeholder="Diseño de Malla" value={diseno} onChange={(e) => setDiseno(e.target.value)} className="w-full p-2 border rounded" />
                    <Label title="Tamaño Neumático " isNotEmpty={true} />
                    <input type="text" placeholder="Tamaño Neumático Recomendado" value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 border rounded" />
                </div>




                <button disabled={isDemo} onClick={handleGuardar} className={"mt-4 disabled:opacity-70 w-full bg-amber-300 text-black py-2 rounded font-semibold" + (isDemo ? " cursor-not-allowed" : "hover:bg-amber-500")}>
                    Guardar Cambios
                </button>
            </div>

        </div>
    );
}
