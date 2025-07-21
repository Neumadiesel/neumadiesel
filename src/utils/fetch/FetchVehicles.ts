import { VehicleDTO } from "@/types/Vehicle";

export const fetchVehiclesBySite = async ({
    siteId,
    authFetch,
}: {
    siteId: number;
    authFetch: (url: string) => Promise<Response | null>;
}): Promise<VehicleDTO[]> => {
    try {
        const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/${siteId}`);
        if (!response) {
            console.warn("No se pudo obtener la respuesta (res es null).");
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
    }
};