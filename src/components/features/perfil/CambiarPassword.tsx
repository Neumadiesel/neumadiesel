'use client'

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Assuming useAuth is defined and provides changePassword function
import { Eye, EyeClosed } from "lucide-react";
export default function CambiarPassword() {
    const { user, isDemo, changePassword, logout } = useAuth(); // Assuming useAuth is defined and provides changePassword function
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);

    const handleChangePassword = async () => {
        if (password.new !== password.confirm) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
        }
        if (!user) {
            alert("No hay usuario autenticado.");
            return;
        }
        try {
            await changePassword(user.user_id, password.current, password.new);
            alert("Contraseña cambiada exitosamente.");
            logout();
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            alert("Error al cambiar la contraseña. Por favor, inténtelo de nuevo.");
        }
    };
    return (
        <section className="flex flex-col h-full dark:text-white">
            <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
            <p className="text-md text-gray-500 dark:text-white">
                Para cambiar su contraseña ingrese su contraseña actual seguido de la nueva contraseña.
            </p>
            <main className="grid mt-2 grid-cols-1 h-3/4 items-center justify-center w-full">
                <div className="flex px-2 flex-col pt-10 justify-between items-center w-full h-full ">
                    <div className="flex flex-col w-1/2">
                        {/* Contraseña actual */}
                        <label className="text-md mt-4 text-gray-950 dark:text-white font-semibold">
                            Contraseña actual:
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                                className="text-md bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 dark:border-yellow-600 rounded-sm p-2 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowOldPassword((prev) => !prev)}
                                className="absolute right-2 text-gray-600 dark:text-gray-300"
                                aria-label={showOldPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showOldPassword ?
                                    <EyeClosed className="w-5 h-5" />
                                    : <Eye className="w-5 h-5" />
                                }
                            </button>
                        </div>
                        <label className="text-md mt-4 text-gray-950 dark:text-white font-semibold">
                            Nueva contraseña:
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                disabled={!password.current}
                                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                className="text-md bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 dark:border-yellow-600 rounded-sm p-2 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-2 text-gray-600 dark:text-gray-300"
                                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showNewPassword ?
                                    <EyeClosed className="w-5 h-5" />
                                    : <Eye className="w-5 h-5" />
                                }
                            </button>
                        </div>
                        <label className="text-md mt-4 text-gray-950 dark:text-white font-semibold">
                            Confirmar contraseña:
                        </label>
                        <div className="relative flex items-center">
                            <input
                                disabled={!password.new}
                                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                type={showNewPassword ? "text" : "password"}
                                className="text-md bg-amber-50 dark:bg-[#313131] outline-amber-300 text-gray-950 dark:text-white font-semibold border border-amber-300 dark:border-yellow-600 rounded-sm p-2 w-full"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-2 text-gray-600 dark:text-gray-300"
                                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showNewPassword ?
                                    <EyeClosed className="w-5 h-5" />
                                    : <Eye className="w-5 h-5" />
                                }
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={!password.confirm || !password.new || !password.current || isDemo}
                        onClick={handleChangePassword}
                        className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                        Cambiar contraseña
                    </button>
                </div>
            </main>
        </section>
    );
}
