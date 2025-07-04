import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthFetch = () => {
    const { token, logout } = useAuth(); // Asegúrate de tener logout disponible
    const router = useRouter();

    const authFetch = async (
        input: RequestInfo,
        init: RequestInit = {}
    ): Promise<Response | null> => {
        // ⚠️ Aviso si no hay token
        if (!token) {
            console.warn("Token no disponible. Usuario no autenticado.");
            return null; // o lanzar un error, dependiendo de tu lógica
        }

        const authHeaders: Record<string, string> = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await fetch(input, {
                ...init,
                headers: {
                    ...(init.headers || {}),
                    ...authHeaders,
                },
            });

            // ⚠️ Si el token expiró o no es válido
            if (response.status === 401) {
                console.warn("Token inválido o expirado. Redirigiendo al login...");
                logout?.(); // Cierra sesión si tienes implementado
                router.push("/login");
                return null; // Para evitar errores con data inesperada
            }

            return response;
        } catch (error) {
            console.error("Error al hacer fetch con autenticación:", error);
            return null;
        }
    };

    return authFetch;
};
