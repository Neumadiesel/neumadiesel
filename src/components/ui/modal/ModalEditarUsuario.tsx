'use client';

import { useState, useEffect } from "react";
import { Usuario } from "@/types/Usuario";

interface ModalEditarUsuarioProps {
    visible: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    onGuardar: (usuarioActualizado: Usuario) => void;
}

export default function ModalEditarUsuario({
    visible,
    onClose,
    usuario,
    onGuardar
}: ModalEditarUsuarioProps) {
    const [usuarioEditado, setUsuarioEditado] = useState<Usuario | null>(usuario);

    useEffect(() => {
        setUsuarioEditado(usuario);
    }, [usuario]);

    if (!visible || !usuarioEditado) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUsuarioEditado(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = () => {
        if (usuarioEditado) {
            onGuardar(usuarioEditado);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

                <div className="flex flex-col gap-4">
                    <input
                        name="nombre"
                        value={usuarioEditado.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        name="correo"
                        value={usuarioEditado.correo}
                        onChange={handleChange}
                        placeholder="Correo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <select
                        name="rol"
                        value={usuarioEditado.rol}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="administrador">Administrador</option>
                        <option value="planificador">Planificador</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="operador">Operador</option>
                    </select>
                    <input
                        name="faena"
                        value={usuarioEditado.faena}
                        onChange={handleChange}
                        placeholder="Faena"
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={handleSubmit} className="px-4 py-2 bg-amber-400 text-black font-bold rounded hover:bg-amber-500">
                        Guardar Cambios
                    </button>
                    <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]">Cancelar</button>
                </div>
            </div>
        </div>
    );
}
