"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
export default function EditarInfo() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name);
    const [last_name, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);
    const [role, setRole] = useState(user?.role.name);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { updateUser, token } = useAuth();

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);

        try {
            if (!user) return null;

            await updateUser(user?.user_id, {
                name: name,
                last_name: last_name,
                email: email,
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el usuario");
        } finally {
            setLoading(false);
            setSuccess("Usuario actualizado correctamente");
        }
    };

    return (
        <section className="flex flex-col">
            <h1 className="text-2xl font-bold">Datos personales</h1>
            <div className="grid mt-2 grid-cols-2 gap-4 items-center justify-center w-2/3 ">
                <div className="flex flex-col  w-full">
                    <label className="text-sm text-gray-500">Nombre:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500">Apellido:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        value={last_name}
                        onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500">Email:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500">Password:</label>
                    <p className="text-sm text-gray-950 font-semibold">**********</p>
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-sm text-gray-500">Rol:</label>
                    <input
                        type="text"
                        className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    />
                </div>
                {error && (
                    <div className=" bg-red-50 border-2 border-dashed border-red-400 rounded-sm p-2">
                        <p className="text-red-500 text-sm">
                            Error al actualizar el usuario: {error}
                        </p>
                    </div>
                )}
                {success && (
                    <div className=" bg-green-50 border-2 border-dashed border-green-400 rounded-sm p-2">
                        <p className="text-green-700 text-sm">Usuario actualizado correctamente</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 w-2/3 mt-4 bg-amber-300 text-black font-bold rounded hover:bg-amber-500 disabled:opacity-50"
            >
                {loading ? "Procesando..." : "Guardar Cambios"}
            </button>
        </section>
    );
}
