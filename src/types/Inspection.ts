export interface InspectionDTO {
    id: number;
    position: number;
    externalTread: number;
    internalTread: number;
    kilometrage: number;
    inspectorId: number;
    inspectorName: string;
    hours: number;
    tireId: number;
    inspectionDate: string; // ISO date string
    pressure?: number | null; // Optional, can be null
    temperature?: number | null; // Optional, can be null
    description: string;
    approved: boolean;
    approvedAt?: string | null; // Optional, can be null
    aprovedById?: number | null; // Optional, can be null
    approvedByName?: string | null; // Optional, can be null
    operatorId?: number | null; // Optional, can be null
    observation: string;
    tire: {
        id: number;
        code: string;
        modelId: number;
        initialTread: number;
        initialKilometrage: number;
        initialHours: number;
        lastInspectionId?: number | null; // Optional, can be null
        locationId: number;
        usedHours: number;
        usedKilometrage: number;
        siteId: number;
        creationDate: string; // ISO date string
        installedTires?: Array<{
            id: number;
            vehicleId: number;
            tireId: number;
            sensorId?: number | null; // Optional, can be null
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
        }> | null; // Optional, can be null
    };
    photos: Array<{
        id: number;
        inspectionId: number;
        tempId?: string | null; // Optional, can be null
        url: string; // URL to the photo
        uploadedById: number;
        createdAt: string; // ISO date string
    }>;
    comments?: Array<{
        id: number;
        inspectionId: number;
        userId: number;
        userName: string;
        isVisible: boolean;
        message: string; // Corrected field name
        createdAt: string; // ISO date string
    }>;
}