import axios, { AxiosInstance } from "axios";

const axiosWithAuth = (token: string, onUnauthorized?: () => void): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    });

    // Interceptor de request: pone el token si existe
    instance.interceptors.request.use(
        (config) => {
            if (!token) {
                console.warn("Token no disponible. El request puede fallar.");
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Interceptor de response: maneja 401
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.warn("Token inválido o expirado.");
                if (onUnauthorized) {
                    onUnauthorized(); // Lógica externa: logout, redirect, alerta
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default axiosWithAuth;
