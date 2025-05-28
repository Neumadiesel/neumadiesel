
export interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
    typeId: number;
    model: {
        id: number;
        brand: string;
        model: string;
        wheelCount: number;
    };
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    };
    installedTires: {
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
            usedKilometrage: number;
            usedHours: number;
            lastInspectionId: number | null;
            locationId: number;
            lastInspection: {
                id: number;
                position: number;
                externalTread: number;
                internalTread: number;
                kilometrage: number;
                inspectionDate: string;
                pressure: number;
                temperature: number;
                observation: string;
            }
        };
    }[];
}