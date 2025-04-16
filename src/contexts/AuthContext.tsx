"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface User {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        last_name: string,
        email: string,
        password: string,
        role_id: number
    ) => Promise<void>;
    logout: () => void;
    loading: boolean;
    updateUser: (
        userId: number,
        userData: {
            name?: string;
            last_name?: string;
            email?: string;
            password?: string;
            role_id?: number;
        }
    ) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("auth-token");
        const userData = Cookies.get("user-data");

        if (token && userData) {
            setToken(token);
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { access_token, user } = response.data;

            // Guardar en cookies
            Cookies.set("auth-token", access_token, { expires: 7 }); // Expira en 7 días
            Cookies.set("user-data", JSON.stringify(user), { expires: 7 });

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
        password: string,
        role_id: number
    ) => {
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name,
                last_name,
                email,
                password,
                role_id,
            });
        } catch (error) {
            console.error("Error al registrarse:", error);
            throw error;
        }
    };

    const logout = () => {
        // Eliminar cookies
        Cookies.remove("auth-token");
        Cookies.remove("user-data");

        setUser(null);
        setToken(null);
        router.push("/login");
    };

    const updateUser = async (
        userId: number,
        userData: {
            name?: string;
            last_name?: string;
            email?: string;
            password?: string;
            role_id?: number;
        }
    ) => {
        try {
            const response = await axios.put(`${API_URL}/auth/users/${userId}`, userData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            }
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
                login,
                logout,
                register,
                updateUser,
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
