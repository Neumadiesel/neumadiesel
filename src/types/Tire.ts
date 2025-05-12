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
    // "lastInspection": {
    //     "id": 2,
    //     "position": 1,
    //     "externalTread": 78,
    //     "internalTread": 83,
    //     "kilometrage": 15000,
    //     "inspectionDate": "2025-05-12T10:00:00.000Z",
    //     "pressure": 115,
    //     "temperature": 25,
    //     "tireId": 12
    lastInspection: {
        id: number;
        position: number;
        externalTread: number;
        internalTread: number;
        kilometrage: number;
        inspectionDate: string;
        pressure: number;
        temperature: number;
        tireId: number;
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
}