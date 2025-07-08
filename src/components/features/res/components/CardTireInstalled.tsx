
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
    }
}
type CardTireInstalledProps = {
    tire?: Tire;
};

export default function CardTireInstalled({ tire }: CardTireInstalledProps) {
    if (!tire) return null;

    const inspection = tire.lastInspection;
    const internal = inspection?.internalTread ?? 0;
    const external = inspection?.externalTread ?? 0;
    const pressure = inspection?.pressure ?? 0;
    const temperature = inspection?.temperature ?? 0;

    const treadDiff = Math.abs(internal - external);
    const minTread = Math.min(internal, external);

    let statusColor = "bg-emerald-100 border-emerald-500 hover:bg-emerald-200"; // ✅ Normal

    // Crítico
    if (treadDiff > 10 || minTread <= 8) {
        statusColor = "bg-red-100 border-red-500 hover:bg-red-200";
    }
    // Alerta
    else if (
        treadDiff > 6 ||
        minTread <= 15
    ) {
        statusColor = "bg-yellow-100 border-yellow-500 hover:bg-yellow-200";
    }

    return (
        <Link
            href={`/neumaticos/${tire.id}`}
            className={`w-full text-sm text-black h-full rounded-md border-2 transition-all duration-75 p-2 flex flex-col items-center justify-center ${statusColor}`}
        >
            <ToolTipTire
                content={
                    <div className="text-lg">
                        <p>{tire.code}</p>
                        <p><small>Interno:</small> {internal}</p>
                        <p><small>Externo:</small> {external}</p>
                        <p><small>Presión:</small> {pressure || "-"} <small>PSI</small></p>
                        <p><small>Temperatura:</small> {temperature || "-"} <small>°C</small></p>
                        <p><small>Horas:</small> {inspection?.hours || "-"}</p>
                        <p><small>Kilometraje:</small> {inspection?.kilometrage || "-"}</p>
                    </div>
                }
            >
                <p className="text-center font-bold text-lg">
                    <small>POS:</small> {inspection?.position ?? "-"}
                </p>
            </ToolTipTire>
        </Link>
    );
}
