"use client";
import { useState, useEffect } from "react";
import { Usuario } from "@/types/Usuario";
import { useAuth } from "@/contexts/AuthContext";

import { useAuthFetch } from "@/utils/AuthFetch";
import axios from "axios";

interface Role {
    role_id: number;
    name: string;
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

interface ModalFormularioUsuarioProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: (usuario: Usuario) => void;
    onSuccess?: () => void;
}

export default function ModalFormularioUsuario({
    visible,
    onClose,
    onGuardar,
    onSuccess,
}: ModalFormularioUsuarioProps) {
    const authFetch = useAuthFetch();
    const { user } = useAuth();
    const [nombre, setNombre] = useState<string>("");
    const [apellido, setApellido] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [rol, setRol] = useState<Usuario["rol"]>("operador");
    const [roleId, setRoleId] = useState<number>(0);
    const [faena, setFaena] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [roles, setRoles] = useState<Role[]>([]);
    const { register, token } = useAuth();
    const [faenas, setFaenas] = useState<FaenaDTO[]>([]);


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
                // Establecer el primer rol como valor por defecto
                if (response.data.length > 0) {
                    setRoleId(response.data[0].role_id);
                    setRol(response.data[0].name.toLowerCase() as Usuario["rol"]);
                }
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
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/with-contract`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            console.log("Faenas Fetched:", data);
            setFaenas(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };



    useEffect(() => {
        fetchFaenas();
    }, []);

    useEffect(() => {
        fetchFaenas();
    }, [user]);

    if (!visible) return null;

    const handleSubmit = async () => {
        try {
            setError("");
            // Primero registramos el usuario en el sistema de autenticación
            await register(nombre, apellido, correo, roleId, faena);

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
            setFaena(0);

            // Llamar a onSuccess si está definido
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error("Error en handleSubmit:", err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err instanceof Error ? err.message : "Error al registrar el usuario");
            }
        }
    };

    const handleClose = () => {
        setNombre("");
        setApellido("");
        setCorreo("");
        setRol("operador");
        setFaena(0);
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-md shadow-lg lg:max-w-sm w-2/3 lg:w-full">
                <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Complete los campos requeridos para registrar un nuevo usuario.
                </p>
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}                <div className="space-y-3">
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
                        className="w-full p-2 border border-gray-300 rounded lowercase"
                        value={correo.toLowerCase()}
                        onChange={e => setCorreo(e.target.value.toLowerCase())}
                    />
                    <label className="text-sm font-semibold">
                        Rol del usuario<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={roleId}
                        onChange={e => {
                            const selectedRoleId = parseInt(e.target.value);
                            setRoleId(selectedRoleId);
                            const selectedRole = roles.find(r => r.role_id === selectedRoleId);
                            if (selectedRole) {
                                setRol(selectedRole.name.toLowerCase() as Usuario["rol"]);
                            }
                        }}
                    >
                        {roles.length > 0 ? (
                            roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Cargando roles...</option>
                        )}
                    </select>
                    <label className="text-sm font-semibold">
                        Faena<span className="font-bold text-lg text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={faena}
                        onChange={e => setFaena(Number(e.target.value))}
                    >
                        <option value="">Seleccione una faena</option>
                        {faenas.map(faena => (
                            <option key={faena.id} value={faena.id}>
                                {faena.name} - {faena.region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={handleSubmit}
                        className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded font-bold"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-200 dark:bg-neutral-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-800 text-black px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
