"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
    register: (name: string, last_name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedData = JSON.parse(userData);
                setUser(parsedData.user);
                setToken(parsedData.access_token);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { access_token, user } = response.data;

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            setUser(user);
            setToken(access_token);
            router.push("/");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    };

    const register = async (name: string, last_name: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                last_name,
                email,
                password,
            });
            const { access_token, user } = response.data;

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            setUser(user);
            setToken(access_token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error al registrarse:", error);
            throw error;
        }
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        setUser(null);
        setToken(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
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
