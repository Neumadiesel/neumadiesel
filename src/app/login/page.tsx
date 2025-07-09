"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import { Eye, EyeClosed } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
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
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen">
            {/* Video de fondo */}
            <video
                src="/video-1.mp4"
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover"
            />

            {/* Overlay semi-transparente */}
            <div className="absolute w-full h-full bg-black/30 md:bg-black/50" />

            {/* Contenido centrado */}
            <div className="relative z-10  bg-transparent flex flex-col items-center justify-center h-full">
                <div className="bg-amber-100/20 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-white/20">
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
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Bienvenido a Neumasystem
                        </h1>
                        <p className="text-gray-200">Inicia sesión para continuar</p>
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
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 text-white focus:ring-blue-500 placeholder:text-white"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none placeholder:text-white text-white focus:ring-2 focus:ring-blue-500 pr-12"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none"
                                tabIndex={-1}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ?
                                    <EyeClosed className="w-5 h-5" />
                                    : <Eye className="w-5 h-5" />
                                }
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 rounded-md bg-amber-300 text-black text-xl hover:bg-amber-500 transition-colors font-bold"
                        >
                            Iniciar sesión
                        </button>
                        <Link
                            href="/forgot-password"
                            className="text-gray-200 hover:text-yellow-500"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </form>
                </div>
                <LoadingSpinner isOpen={loading} />
            </div>
        </div>
    );
}
