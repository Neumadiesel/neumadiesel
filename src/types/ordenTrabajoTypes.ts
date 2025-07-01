// archivo: @/types/ordenTrabajoTypes.ts

export interface LocationDTO {
    id: number;
    description: string;
}

export interface VehicleModel {
    id: number;
    brand: string;
    model: string;
    wheelCount: number;
}

export interface VehicleSite {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
}

export interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
    typeId: number;
    model: VehicleModel;
    site: VehicleSite;
}

export interface InstalacionNeumatico {
    posicion: number;
    nuevoTireId?: number;
    remanente?: number;
    presion?: number;
    temperatura?: number;
    remanenteFinal?: number;
    razonRetiroId?: number;
}

// types/ordenTrabajoTypes.ts

export interface ProgramasDTO {
    id: number;
    vehicleId: number;
    tyreId?: number;
    status: "Programada" | "En ejecución" | "Completada" | "Cancelada";
    otId?: string;
    description: string;
    scheduledDate: string; // formato ISO (DateTime)
    scheduledTime?: number;
    workDate?: string; // formato ISO (DateTime)
    vehicle: {
        id: number;
        code: string;
    };
}
export interface TireModel {
    dimensions: string;
}

export interface TireDTO {
    id: number;
    code: string;
    model?: TireModel;
}

export interface RetirementReasonDTO {
    id: number;
    name: string;
}

export interface InstalledTireDTO {
    position: number;
    tire: {
        code: string;
    };
}

export interface InstallationData {
    posicion: number;
    nuevoTireId?: number;
    internalTread?: number;
    externalTread?: number;
    presion?: number;
    temperatura?: number;
    finalInternalTread?: number;
    finalExternalTread?: number;
    razonRetiroId?: number;
}

export interface OrderFormData {
    instalaciones: InstallationData[];
    posicionesSeleccionadas: number[];
    vehicle: {
        siteId: number;
        installedTires: InstalledTireDTO[];
    };
}
export interface OrderFormData {
    // Paso 1 - Datos generales
    fecha: string | null;
    fechaDespacho: string;
    observaciones: string;
    locationId: number | null;
    tipoIntervencion: string;
    cantidadPersonas: string;
    horaIngreso: string;
    horaDespacho: string;
    turno?: string;
    tecnico: string;

    // Paso 2 - Selección de vehículo y programa
    equipoId: number | null;
    vehicleCode: string;
    vehicle: {
        siteId: number;
        installedTires: InstalledTireDTO[];
    };
    programasSeleccionados: number[];
    posicionesSeleccionadas: number[];
    kilometrage: number;
    horas: number;

    // Paso 3 - Instalación por posición
    instalaciones: InstallationData[];
}