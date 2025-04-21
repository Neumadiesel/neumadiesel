"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FaCheckCircle } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        try {
            await login(email, password);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            console.log(error);
            setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
        }
    };

    return (
        <div className="relative w-full h-screen">
            {/* Video de fondo */}
            <video
                src="/video-1.mp4"
                autoPlay
                muted
                loop
                className="hidden lg:block absolute  w-full h-full object-cover"
            />

            {/* Overlay semi-transparente */}
            <div className="absolute w-full h-full bg-black/40" />

            {/* Contenido centrado */}
            <div className="relative z-10 bg-white md:bg-transparent flex flex-col items-center justify-center h-full">
                <div className="bg-white p-8 rounded-lg md:shadow-xl max-w-md w-full mx-4">
                    <div className="flex flex-col items-center mb-6">
                        <Link href="/">
                            <Image
                                src="/NEUMASYSTEM.png"
                                alt="logo"
                                width={250}
                                height={180}
                                className="mb-4"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Bienvenido a Neumasystem
                        </h1>
                        <p className="text-gray-600">Inicia sesión para continuar</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            <span>Inicio de sesión exitoso. Redirigiendo...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full p-3 rounded-md bg-amber-300 text-black text-xl hover:bg-amber-500 transition-colors font-bold"
                        >
                            Iniciar sesión
                        </button>
                        <Link
                            href="/forgot-password"
                            className="text-gray-600 hover:text-yellow-500"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
