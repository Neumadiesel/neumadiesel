"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface User {
    user_id: number;
    name: string;
    last_name: string;
    faena_id?: number; // Puede ser undefined si no aplica
    email: string;
    role: {
        role_id: number;
        name: string;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isDemo: boolean;
    siteId: number | null;
    setSiteId: (id: number) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (
        name: string,
        last_name: string,
        email: string,
        role_id: number,
        faena_id: number
    ) => Promise<void>;
    deactivateUser: (userId: number) => Promise<void>;
    reactivateUser: (userId: number) => Promise<void>;
    changePassword: (
        userId: number,
        currentPassword: string,
        newPassword: string
    ) => Promise<void>;
    updateUser: (
        userId: number,
        userData: {
            name?: string;
            last_name?: string;
            email?: string;
            password?: string;
            role_id?: number;
            faena_id?: number;
        }
    ) => Promise<User>;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isDemo, setIsDemo] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [siteId, setSiteIdState] = useState<number | null>(null);

    const setSiteId = (id: number) => {
        setSiteIdState(id);
        Cookies.set("site-id", String(id), { expires: 7 });
    };

    useEffect(() => {
        const token = Cookies.get("auth-token");
        const userData = Cookies.get("user-data");
        const savedSiteId = Cookies.get("site-id");

        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            setToken(token);
            setUser(parsedUser);

            // Si el usuario es admin (role_id === 1, por ejemplo), permitir elegir siteId
            if (parsedUser.role?.role_id === 1 && savedSiteId) {
                setSiteIdState(Number(savedSiteId)); // usa cookie si existe
            } else {
                setSiteIdState(parsedUser.faena_id ?? null); // si no, usa faena_id (en tu caso, 99)
            }
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { access_token, user } = response.data;
            setIsDemo(user.role?.name === "Demo");
            // Guardar en cookies
            Cookies.set("auth-token", access_token, { expires: 7 }); // Expira en 7 días
            Cookies.set("user-data", JSON.stringify(user), { expires: 7 });
            console.log("Es Demo:", user.role?.name === "Demo");
            setUser(user);
            setToken(access_token);
            router.push("/");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    };

    const register = async (
        name: string,
        last_name: string,
        email: string,
        role_id: number,
        faena_id: number
    ) => {
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name,
                last_name,
                email,
                role_id,
                faena_id,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }

            );
        } catch (error) {
            console.error("Error al registrarse:", error);
            throw error;
        }
    };

    const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {
        try {
            const response = await axios.patch(
                `${API_URL}/auth/users/${userId}/change-password`,
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Contraseña cambiada:", response.data);
        } catch (error) {
            console.error("Error al cambiar contraseña:", error instanceof Error ? error.message : "Error al actualizar el modelo");
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Error al cambiar la contraseña");
        }
    };
    const logout = () => {
        // Eliminar cookies
        Cookies.remove("auth-token");
        Cookies.remove("user-data");
        Cookies.remove("site-id");


        setUser(null);
        setToken(null);
        router.push("/login");
    };

    const reactivateUser = async (userId: number): Promise<void> => {
        try {
            const response = await axios.patch(
                `${API_URL}/auth/users/${userId}/activate`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Usuario reactivado:", response.data);
        } catch (error) {
            console.error("Error al reactivar usuario:", error instanceof Error ? error.message : "Error al actualizar el modelo");

            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Error al reactivar el usuario");
        }
    };

    const deactivateUser = async (userId: number): Promise<void> => {
        try {
            const response = await axios.patch(
                `${API_URL}/auth/users/${userId}/deactivate`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Usuario desactivado:", response.data);
        } catch (error) {
            console.error("Error al desactivar usuario:", error instanceof Error ? error.message : "Error al actualizar el modelo");

            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Error al desactivar el usuario");
        }
    };

    const updateUser = async (
        userId: number,
        userData: {
            name?: string;
            last_name?: string;
            email?: string;
            password?: string;
            role_id?: number;
            faena_id?: number;
        }
    ) => {
        try {
            console.log("userData", userData.faena_id);
            const response = await axios.patch(`${API_URL}/auth/users/${userId}`, userData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("response", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Error al actualizar el usuario");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isDemo,
                login,
                siteId,
                setSiteId,
                logout,
                register,
                deactivateUser,
                reactivateUser,
                changePassword,
                updateUser,
                setUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
