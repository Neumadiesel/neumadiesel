"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
export default function EditarInfo() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name);
    const [last_name, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);
    const [role, setRole] = useState(user?.role.name);

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
            </div>
        </section>
    );
}
