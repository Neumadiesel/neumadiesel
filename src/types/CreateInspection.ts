
export interface CreateInspectionDTO {
    position: number;
    externalTread: number;
    internalTread: number;
    kilometrage: number;
    inspectorId: number;
    inspectorName: string;
    pressure?: number | null;
    temperature?: number | null;
    observation?: string;
    inspectionDate?: string; // ISO date string
    hours: number;
    tireId: number;
}
