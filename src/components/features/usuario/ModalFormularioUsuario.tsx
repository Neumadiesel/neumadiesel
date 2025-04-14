"use client";
import { useState } from "react";
import { Usuario } from "@/types/Usuario";
import { useAuth } from "@/contexts/AuthContext";

interface ModalFormularioUsuarioProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: (usuario: Usuario) => void;
}

export default function ModalFormularioUsuario({
    visible,
    onClose,
    onGuardar,
}: ModalFormularioUsuarioProps) {
    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [rol, setRol] = useState<Usuario["rol"]>("operador");
    const [faena, setFaena] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { register } = useAuth();

    if (!visible) return null;

    const handleSubmit = async () => {
        try {
            setError("");
            // Primero registramos el usuario en el sistema de autenticación
            await register(nombre, apellido, correo, password);

            // Luego creamos el usuario en la base de datos
            const nuevoUsuario: Usuario = {
                nombre,
                correo,
                rol,
                faena,
            };
            onGuardar(nuevoUsuario);
            onClose();
            setNombre("");
            setCorreo("");
            setRol("operador");
            setFaena("");
            setPassword("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar el usuario");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Complete los campos requeridos para registrar un nuevo usuario.
                </p>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <div className="space-y-3">
                    <label className="text-sm font-semibold">
                        Nombre<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                    <label className="text-sm font-semibold">
                        Apellido<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Apellido"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={apellido}
                        onChange={e => setApellido(e.target.value)}
                    />
                    <label className="text-sm font-semibold">
                        Correo<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Correo"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={correo}
                        onChange={e => setCorreo(e.target.value)}
                    />
                    <label className="text-sm font-semibold">
                        Contraseña<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className="text-sm font-semibold">
                        Rol del usuario<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={rol}
                        onChange={e => setRol(e.target.value as Usuario["rol"])}
                    >
                        <option value="administrador">Administrador</option>
                        <option value="planificador">Planificador</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="operador">Operador</option>
                    </select>
                    <label className="text-sm font-semibold">
                        Faena<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Faena"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={faena}
                        onChange={e => setFaena(e.target.value)}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded font-bold"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
