import { AlertTriangle } from "lucide-react";
import ToolTipTire from "./ToolTipTire";
import Link from "next/link";

interface Tire {
    id: number;
    code: string;
    creationDate: string;
    modelId: number;
    initialTread: number;
    initialKilometrage: number;
    initialHours: number;
    usedKilometrage: number;
    usedHours: number;
    lastInspectionId: number | null;
    locationId: number;
    model: {
        id: number;
        code: string;
        brand: string;
        dimensions: string;
        constructionType: string | null;
        originalTread: number;
    };
    lastInspection: {
        id: number;
        position: number;
        externalTread: number;
        internalTread: number;
        kilometrage: number;
        hours: number;
        inspectionDate: string;
        pressure: number;
        temperature: number;
        observation: string;
    };
}

type CardTireInstalledProps = {
    tire?: Tire;
    wheelCount?: number;
};

export default function CardTireInstalled({ tire, wheelCount }: CardTireInstalledProps) {
    if (!tire) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-neutral-700 border-2 border-dashed border-gray-400 rounded-md">
                <AlertTriangle className="w-6 h-6 mb-1 text-gray-400" />

            </div>
        );
    }

    const inspection = tire.lastInspection;
    const internal = inspection?.internalTread ?? 0;
    const external = inspection?.externalTread ?? 0;
    const avgTread = (internal + external) / 2;
    const treadDiff = Math.abs(internal - external);
    const position = inspection?.position ?? 0;
    const original = tire.initialTread;

    let statusColor = "bg-emerald-100 border-emerald-500 hover:bg-emerald-200"; // Verde por defecto
    let alerta = "Estado normal";

    const isFront = position === 1 || position === 2;

    if (isFront) {
        if (treadDiff > 6) {
            statusColor = "bg-red-100 border-red-500 hover:bg-red-200";
            alerta = "Inversión de desgaste (diferencia > 6 mm)";
        } else if (avgTread < 65) {
            statusColor = "bg-red-100 border-red-500 hover:bg-red-200";
            alerta = "Desgaste crítico (avg < 65 mm)";
        } else if (avgTread < 80) {
            statusColor = "bg-yellow-100 border-yellow-500 hover:bg-yellow-200";
            alerta = "Desgaste moderado (avg entre 65 y 79 mm)";
        }
    } else {
        const desgaste = avgTread / original;

        if (treadDiff > 10) {
            statusColor = "bg-red-100 border-red-500 hover:bg-red-200";
            alerta = "Inversión de desgaste (diferencia > 10 mm)";
        } else if (desgaste < 0.25) {
            statusColor = "bg-red-100 border-red-500 hover:bg-red-200";
            alerta = `Desgaste crítico (< 25% restante)`;
        } else if (desgaste < 0.5) {
            statusColor = "bg-yellow-100 border-yellow-500 hover:bg-yellow-200";
            alerta = `Desgaste moderado (entre 25% y 50%)`;
        }
    }
    // Calcular orden de visualización
    const formatRemanentes = () => {
        const pos = position;
        const ext = external;
        const int = internal;

        if (!wheelCount || pos < 3) return `${int}/${ext}`; // Para delanteros u otros

        if (wheelCount === 6) {
            if (pos === 3 || pos === 5) return `${ext}/${int}`;
            if (pos === 4 || pos === 6) return `${int}/${ext}`;
        }

        if (wheelCount === 4) {
            if (pos === 3) return `${ext}/${int}`;
            if (pos === 4) return `${int}/${ext}`;
        }

        return `${int}/${ext}`; // Fallback
    };


    return (
        <Link
            href={`/neumaticos/${tire.id}`}
            className={`w-full text-sm text-black h-full rounded-md border transition-all duration-75 p-1 flex flex-col items-center justify-center ${statusColor}`}
        >
            <ToolTipTire
                content={
                    <div className="text-sm space-y-1">
                        <p className="font-semibold">{tire.code}</p>
                        <p><small>Interno:</small> {internal} mm</p>
                        <p><small>Externo:</small> {external} mm</p>
                        <p><small>Promedio:</small> {avgTread.toFixed(1)} mm</p>
                        <p><small>Presión:</small> {inspection?.pressure || "-"} PSI</p>
                        <p><small>Temperatura:</small> {inspection?.temperature || "-"} °C</p>
                        <p><small>Horas:</small> {inspection?.hours || "-"}</p>
                        <p><small>Kilometraje:</small> {inspection?.kilometrage || "-"}</p>
                        <p className="text-xs font-bold text-red-500 pt-1">{alerta}</p>
                    </div>
                }
            >
                <div className="text-center font-bold ">
                    <p className="text-sm text-gray-800">
                        <small className="text-xs text-gray-600">POS:</small> {position}
                    </p>
                    <p className="text-md text-gray-800">
                        {formatRemanentes()}
                    </p>
                    <p className="text-sm text-gray-500">
                        {original > 0 ? `${Math.round((avgTread / original) * 100)}%` : "-"}
                    </p>
                </div>
            </ToolTipTire>
        </Link>
    );
}
