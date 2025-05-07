export interface TireDTO {
    id: number;
    code: string;
    modelId: number;
    initialTread: number;
    initialKilometrage: number;
    initialHours: number;
    lastInspectionId: number;
    locationId: number;
    model: {
        id: number;
        code: string;
        brand: string;
        dimensions: string;
        constructionType: string | null;
        pattern: string;
        originalTread: number | null;
        TKPH: number | null;
        cost: number | null;
        nominalHours: number | null;
        nominalKilometrage: number | null;
    };
    location: {
        id: number;
        name: string;
    };
    installedTires: {
        id: number;
        vehicleId: number;
        tireId: number;
        sensorId: number | null;
        position: number;
        vehicle: {
            id: number;
            code: string;
            modelId: number;
            siteId: number;
            kilometrage: number;
            hours: number;
            typeId: number;
        };
    }[];
}

export interface installedTiresDTO {
    id: number;
    vehicleId: number;
    tireId: number;
    sensorId: number | null;
    position: number;
    tire: {
        id: number;
        code: string;
        modelId: number;
        initialTread: number;
        initialKilometrage: number;
        initialHours: number;
        lastInspectionId: number | null;
        locationId: number;
    };
    sensor: any | null; // Cambia `any` si tienes una estructura definida para el sensor
}