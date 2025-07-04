import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // o donde tengas tu contexto

const useAxiosWithAuth = (): AxiosInstance => {
    const { token, logout } = useAuth(); // suponiendo que tengas esto
    const router = useRouter();

    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    });

    // 👉 Interceptor de request: chequea si el token existe
    instance.interceptors.request.use(
        (config) => {
            if (!token) {
                console.warn("Token no disponible. Usuario no autenticado.");
                // Opcional: puedes lanzar error aquí si prefieres
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 👉 Interceptor de response: maneja errores 401 globalmente
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn("Token inválido o expirado. Redirigiendo al login...");
                logout?.(); // Si tienes una función para cerrar sesión
                router.push("/login"); // O la ruta que uses
            }
            return Promise.reject(error); // Deja pasar el error para manejo local si quieres
        }
    );

    return instance;
};

export default useAxiosWithAuth;
