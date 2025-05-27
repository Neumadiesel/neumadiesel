// "use client" asegura que este componente se ejecute solo en el cliente
"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Link as LinkIcon } from "lucide-react";
import axios from "axios";
import ModalRegistrarModeloCadena from "@/components/features/cadenas/ModalRegistrarModeloCadena";
import ModalEditarModeloCadena from "@/components/features/cadenas/ModalEditarModeloCadena";


// Interfaz para tipar los datos de cada modelo de cadena
interface ModeloCadena {
    id: number;
    code: string;
    model: string;
    meshPattern: string;
    meshDesign: string;
    tireSize: string;
}



export default function Page() {
    // Estados para manejar datos y visibilidad de los modales
    const [modelos, setModelos] = useState<ModeloCadena[]>([]);
    const [modalCrearVisible, setModalCrearVisible] = useState(false);
    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    const [modalListaVisible, setModalListaVisible] = useState(false);
    const [modeloSeleccionado, setModeloSeleccionado] = useState<ModeloCadena | null>(null);

    // Función para obtener datos desde la API
    const fetchModelos = async () => {
        const res = await axios.get("https://inventory-service-emva.onrender.com/chain-model");
        setModelos(res.data);
    };

    // Se ejecuta una vez al cargar el componente
    useEffect(() => {
        fetchModelos();
    }, []);

    // Función para abrir modal de edición con un modelo específico
    const abrirModalEditar = (modelo: ModeloCadena) => {
        setModeloSeleccionado(modelo);
        setModalEditarVisible(true);
    };

    // Función para abrir el modal de Lista de Cadenas relacionadas con el modelo
    const abrirModalLista = (modelo: ModeloCadena) => {
        setModeloSeleccionado(modelo);
        setModalListaVisible(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Modelos de Cadenas</h1>
                <button
                    onClick={() => setModalCrearVisible(true)}
                    className="bg-amber-400 text-black px-4 py-2 rounded font-semibold flex items-center gap-2"
                >
                    <Plus size={18} /> Registrar Modelo
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Código</th>
                            <th className="px-4 py-2 text-left">Modelo</th>
                            <th className="px-4 py-2 text-left">Patrón de Malla</th>
                            <th className="px-4 py-2 text-left">Diseño de Malla</th>
                            <th className="px-4 py-2 text-left">Dimensión</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modelos.map((modelo) => (
                            <tr key={modelo.id} className="border-t border-gray-200">
                                <td className="px-4 py-2">{modelo.code}</td>
                                <td className="px-4 py-2">{modelo.model}</td>
                                <td className="px-4 py-2">{modelo.meshPattern}</td>
                                <td className="px-4 py-2">{modelo.meshDesign}</td>
                                <td className="px-4 py-2">{modelo.tireSize}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => abrirModalEditar(modelo)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => abrirModalLista(modelo)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <LinkIcon size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para registrar modelo */}
            <ModalRegistrarModeloCadena
                visible={modalCrearVisible}
                onClose={() => setModalCrearVisible(false)}
                onGuardar={() => {
                    fetchModelos();
                    setModalCrearVisible(false);
                }}
            />

            {/* Modal para editar modelo */}
            {modeloSeleccionado && (
                <ModalEditarModeloCadena
                    visible={modalEditarVisible}
                    onClose={() => setModalEditarVisible(false)}
                    onGuardar={() => {
                        fetchModelos();
                        setModalEditarVisible(false);
                    }}
                    modeloCadena={modeloSeleccionado}
                />
            )}
        </div>
    );
}
