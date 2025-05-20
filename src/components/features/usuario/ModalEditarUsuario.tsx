"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Label from "@/components/common/forms/Label";

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
        faena_id: 0,
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { updateUser, token } = useAuth();

    const [faenas, setFaenas] = useState<FaenaDTO[]>([]);

    useEffect(() => {
        if (usuario) {
            setUsuarioEditado({
                nombre: usuario.name,
                last_name: usuario.last_name,
                correo: usuario.email,
                rol: usuario.role.name.toLowerCase(),
                faena_id: 0,
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
    const fetchFaenas = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/sites/with-contract");
            const data = await response.json();
            console.log("Faenas Fetched:", data);
            setLoading(false);
            setFaenas(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };


    useEffect(() => {
        fetchFaenas();
    }, []);

    if (!visible || !usuario) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUsuarioEditado(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async () => {
        setError("");
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
                faena_id: usuarioEditado.faena_id,
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
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-2">
                    <Label title="Nombre" isNotEmpty={true} />
                    <input
                        name="nombre"
                        value={usuarioEditado.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <Label title="Apellido" isNotEmpty={true} />
                    <input
                        name="last_name"
                        value={usuarioEditado.last_name}
                        onChange={handleChange}
                        placeholder="Apellido"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <Label title="Correo" isNotEmpty={true} />
                    <input
                        name="correo"
                        value={usuarioEditado.correo}
                        onChange={handleChange}
                        placeholder="Correo"
                        className="border border-gray-300 p-2 rounded"
                    />
                    <Label title="Rol" isNotEmpty={true} />
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
                    <Label title="Faena" isNotEmpty={false} />
                    <select
                        name="faena_id"
                        disabled={usuario.role.name.toLowerCase() === "administrador"}
                        value={usuarioEditado.faena_id}
                        onChange={
                            (e) => setUsuarioEditado({ ...usuarioEditado, faena_id: Number(e.target.value) })
                        }
                        className={`border border-gray-300 p-2 rounded ${usuario.role.name.toLowerCase() === "administrador" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <option value="">Selecciona una faena</option>
                        {faenas.map(faena => (
                            <option key={faena.id} value={faena.id}>
                                {faena.name} - {faena.region}
                            </option>
                        ))}
                    </select>

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
