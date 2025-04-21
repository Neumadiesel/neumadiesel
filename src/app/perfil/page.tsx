"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
export default function Perfil() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name);
    const [last_name, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);
    const [role, setRole] = useState(user?.role.name);
    const [activeSection, setActiveSection] = useState("datos personales");
    return (
        <div className="flex flex-col h-screen p-4 ">
            {/* seccion de banner y foto de perfil */}
            <div className="flex flex-col h-36 bg-white rounded-sm items-center justify-center">
                <Image
                    src="/banner.jpg"
                    alt="banner"
                    width={500}
                    height={50}
                    className="w-full h-full object-cover "
                />
            </div>
            {/* Seccion de datos personales */}
            {/* Los datos personales son nombre, apellido, email, passoword, faena y rol */}
            <section className="flex flex-row gap-4 rounded-lg h-full items-center ">
                {/* Seccion de botones de accion */}
                <section className="flex flex-col h-full items-center bg-[#212121] p-4 w-1/4 shadow-md gap-4">
                    <Image
                        src="/usuario.png"
                        alt="logo"
                        width={120}
                        height={120}
                        className="rounded-full"
                    />
                    <h1 className="text-white text-2xl font-bold">
                        {user?.name} {user?.last_name}
                    </h1>
                    <p className="text-white text-sm font-semibold">{user?.email.toUpperCase()}</p>
                    <p className="text-white text-md">{user?.role.name}</p>
                    <p className="text-white text-sm">No asignado</p>
                </section>
                {/* Seccion de datos personales */}
                <main className="flex flex-col bg-white shadow-sm h-full  p-4  w-3/4">
                    {/* Quiero una barra de 3 botones para editar datos personales, cambiar contrasena y desactivar cuenta*/}
                    <div className="flex flex-row mb-2">
                        <button
                            onClick={() => setActiveSection("datos personales")}
                            className="bg-gray-100 hover:bg-gray-200 text-black font-semibold border-b-4 border-amber-400 w-1/3 p-2"
                        >
                            Editar datos personales
                        </button>
                        <button
                            onClick={() => setActiveSection("cambiar contraseña")}
                            className="bg-gray-100 hover:bg-gray-200 text-black font-semibold border-b-4 border-blue-400 w-1/3 p-2"
                        >
                            Cambiar contraseña
                        </button>
                        <button
                            onClick={() => setActiveSection("desactivar cuenta")}
                            className="bg-gray-100 hover:bg-gray-200 text-black font-semibold border-b-4 border-red-400 w-1/3 p-2"
                        >
                            Desactivar cuenta
                        </button>
                    </div>
                    {/* Seccion de datos personales */}
                    {activeSection === "datos personales" && (
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
                                    <p className="text-sm text-gray-950 font-semibold">
                                        **********
                                    </p>
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
                    )}
                    {/* Seccion de cambiar contraseña */}
                    {activeSection === "cambiar contraseña" && (
                        <section className="flex flex-col h-full">
                            <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
                            <p className="text-sm text-gray-500">
                                Para cambiar tu contraseña siga las instrucciones de las siguientes
                                etapas.
                            </p>
                            <main className="grid mt-2 grid-cols-3 h-3/4 items-center justify-center w-full">
                                {/* Etapa 1  */}
                                <div className="flex px-2 flex-col justify-between gap-4 h-full ">
                                    <div className="flex flex-col">
                                        <p className="text-md font-semibold">Primera etapa</p>
                                        <p className="text-sm text-gray-500">
                                            Ingrese su contraseña actual le enviaremos un codigo de
                                            verificación a su correo.
                                        </p>
                                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                                            Contraseña actual:
                                        </label>
                                        <input
                                            type="password"
                                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                                        />
                                    </div>
                                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                                        Continuar
                                    </button>
                                </div>
                                {/* Etapa 2  */}
                                <div className="flex px-2 flex-col justify-between border-x border-dashed border-gray-500 h-full">
                                    <div className="flex flex-col">
                                        <p className="text-md font-semibold">Segunda etapa</p>
                                        <p className="text-sm text-gray-500">
                                            Ingrese el codigo de verificación que le enviamos a su
                                            correo.
                                        </p>
                                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                                            Codigo de verificación:
                                        </label>
                                        <input
                                            type="text"
                                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                                        />
                                    </div>
                                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                                        Continuar
                                    </button>
                                </div>
                                {/* Etapa 3  */}
                                <div className="flex px-2 flex-col justify-between h-full ">
                                    <div className="flex flex-col">
                                        <p className="text-md font-semibold">Tercera etapa</p>
                                        <p className="text-sm text-gray-500">
                                            Ingrese su nueva contraseña y confirme para cambiarla.
                                        </p>
                                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                                            Nueva contraseña:
                                        </label>
                                        <input
                                            type="password"
                                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                                        />
                                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                                            Confirmar contraseña:
                                        </label>
                                        <input
                                            type="password"
                                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                                        />
                                    </div>
                                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </main>
                        </section>
                    )}
                    {/* Seccion de desactivar cuenta */}
                    {activeSection === "desactivar cuenta" && (
                        <section className="flex flex-col h-full w-2/3 mx-auto">
                            <h1 className=" text-center text-2xl font-bold">Desactivar cuenta</h1>
                            {/* icono de alerta */}
                            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto" />
                            <p className="text-sm text-gray-500 text-justify">
                                Si desea desactivar su cuenta, por favor ingrese su contraseña
                                actual y confirme para continuar.
                            </p>
                            <p className="text-sm text-gray-500 text-justify">
                                Para volver a activar su cuenta, contactar con la administración.
                            </p>
                            <label className="text-sm mt-4 text-gray-950 font-semibold">
                                Contraseña actual:
                            </label>
                            <input
                                type="password"
                                className="text-sm bg-gray-50 outline-gray-300 text-gray-950 font-semibold border border-gray-300 rounded-sm p-2"
                            />
                            <button className="bg-red-500 hover:bg-red-600 mt-4 text-white font-semibold rounded-sm p-2">
                                Desactivar cuenta
                            </button>
                        </section>
                    )}
                </main>
            </section>
        </div>
    );
}
