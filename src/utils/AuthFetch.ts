// utils/authFetch.ts
// hooks/useAuthFetch.ts
import { useAuth } from "@/contexts/AuthContext";

export const useAuthFetch = () => {
    const { token } = useAuth();

    const authFetch = async (
        input: RequestInfo,
        init: RequestInit = {}
    ): Promise<Response> => {
        const authHeaders: Record<string, string> = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        return fetch(input, {
            ...init,
            headers: {
                ...(init.headers || {}),
                ...authHeaders,
            },
        });
    };

    return authFetch;
};