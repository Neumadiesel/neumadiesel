"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import CambiarPassword from "@/components/features/perfil/CambiarPassword";
import DesactivarCuenta from "@/components/features/perfil/DesactivarCuenta";
import EditarInfo from "@/components/features/perfil/EditarInfo";
export default function Perfil() {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState("datos personales");
    return (
        <div className="flex flex-col h-screen p-4 relative">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
                <Image src="/mine-ilustration-pc.png" alt="banner" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-black/50" />
            </div>
            {/* Contenido principal */}
            <div className="relative z-10 h-full">
                {/* seccion de banner y foto de perfil */}

                {/* Seccion de datos personales */}
                {/* Los datos personales son nombre, apellido, email, passoword, faena y rol */}
                <section className="flex flex-row gap-4 rounded-lg h-full items-center ">
                    {/* Seccion de botones de accion */}
                    <section className="flex flex-col h-full items-center bg-[#212121]/80 backdrop-blur-sm p-4 w-1/4 shadow-md gap-4">
                        <Image
                            src="/usuario.png"
                            alt="logo"
                            width={120}
                            height={120}
                            className="rounded-full"
                        />
                        <h2 className="text-white text-2xl font-bold ">
                            {user?.name} {user?.last_name}
                        </h2>
                        <p className="text-white text-sm font-semibold hidden lg:block">
                            {user?.email.toUpperCase()}
                        </p>
                        <p className="text-white text-md">{user?.role.name}</p>
                    </section>
                    {/* Seccion de datos personales */}
                    <main className="flex flex-col bg-white dark:bg-[#212121] shadow-sm h-full  p-4  w-3/4">
                        {/* Quiero una barra de 3 botones para editar datos personales, cambiar contrasena y desactivar cuenta*/}
                        <div className="flex flex-row mb-2">
                            <button
                                onClick={() => setActiveSection("datos personales")}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-[#141414] text-black dark:text-white font-semibold border-b-4 border-amber-400 w-1/3 p-2"
                            >
                                Editar datos personales
                            </button>
                            <button
                                onClick={() => setActiveSection("cambiar contraseña")}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-[#141414] text-black dark:text-white font-semibold border-b-4 border-blue-400 w-1/3 p-2"
                            >
                                Cambiar contraseña
                            </button>
                            <button
                                onClick={() => setActiveSection("desactivar cuenta")}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-[#141414] text-black dark:text-white font-semibold border-b-4 border-red-400 w-1/3 p-2"
                            >
                                Desactivar cuenta
                            </button>
                        </div>
                        {/* Seccion de datos personales */}
                        {activeSection === "datos personales" && <EditarInfo />}
                        {/* Seccion de cambiar contraseña */}
                        {activeSection === "cambiar contraseña" && <CambiarPassword />}
                        {/* Seccion de desactivar cuenta */}
                        {activeSection === "desactivar cuenta" && <DesactivarCuenta />}
                    </main>
                </section>
            </div>
        </div>
    );
}
