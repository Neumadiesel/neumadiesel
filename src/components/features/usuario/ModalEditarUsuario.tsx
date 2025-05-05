"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface Role {
    role_id: number;
    name: string;
}

interface UserDto {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
    role: {
        role_id: number;
        name: string;
    };
}

interface ModalEditarUsuarioProps {
    visible: boolean;
    onClose: () => void;
    usuario: UserDto | null;
    onGuardar: () => void;
}

export default function ModalEditarUsuario({
    visible,
    onClose,
    usuario,
    onGuardar,
}: ModalEditarUsuarioProps) {
    const [usuarioEditado, setUsuarioEditado] = useState({
        nombre: "",
        last_name: "",
        correo: "",
        rol: "operador",
        faena: "",
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { updateUser, token } = useAuth();

    useEffect(() => {
        if (usuario) {
            setUsuarioEditado({
                nombre: usuario.name,
                last_name: usuario.last_name,
                correo: usuario.email,
                rol: usuario.role.name.toLowerCase(),
                faena: "", // Mantenemos el campo faena por compatibilidad con la UI
            });
        }
    }, [usuario]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const response = await axios.get(`${API_URL}/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener roles:", error);
                setError("Error al cargar los roles");
            }
        };

        if (visible) {
            fetchRoles();
        }
    }, [visible, token]);

    if (!visible || !usuario) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUsuarioEditado(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            // Convertir el rol seleccionado a role_id
            const selectedRole = roles.find(r => r.name.toLowerCase() === usuarioEditado.rol);
            if (!selectedRole) {
                throw new Error("Rol no válido");
            }

            await updateUser(usuario.user_id, {
                name: usuarioEditado.nombre,
                last_name: usuarioEditado.last_name,
                email: usuarioEditado.correo,
                role_id: selectedRole.role_id,
            });

            onGuardar();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError(null)} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="flex flex-col gap-4">
                    <input
                        name="nombre"
                        value={usuarioEditado.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <input
                        name="last_name"
                        value={usuarioEditado.last_name}
                        onChange={handleChange}
                        placeholder="Apellido"
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
                        {roles.length > 0 ? (
                            roles.map(role => (
                                <option key={role.role_id} value={role.name.toLowerCase()}>
                                    {role.name}
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="administrador">Administrador</option>
                                <option value="planificador">Planificador</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="operador">Operador</option>
                            </>
                        )}
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
