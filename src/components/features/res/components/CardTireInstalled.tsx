import { TireDTO } from "@/types/Tire";
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
    tire: Tire;
};
export default function CardTireInstalled({ tire }: CardTireInstalledProps) {
    return (
        <Link href={`/neumaticos/${tire?.id}`} className="w-full text-sm text-black bg-emerald-100 h-full rounded-md border-2 border-emerald-500 hover:border-emerald-600  transition-all ease-in-out  duration-75  p-2  flex flex-col items-center justify-center hover:bg-emerald-200">
            <ToolTipTire
                content={
                    <div className="text-lg">
                        <p>
                            {tire?.code}
                        </p>
                        <p>
                            <small>Interno:</small> {tire?.lastInspection?.internalTread}
                        </p>
                        <p>
                            <small>Externo:</small> {tire?.lastInspection?.externalTread}
                        </p>
                        <p>
                            <small>Presión:</small> {tire?.lastInspection?.pressure || "-"} <small>PSI</small>
                        </p>
                        <p>
                            <small>Temperatura:</small> {tire?.lastInspection?.temperature || "-"} <small>°C</small>
                        </p>
                        <p>
                            <small>Horas:</small> {tire?.lastInspection?.hours || "-"}
                        </p>
                        <p>
                            <small>Kilometraje:</small> {tire?.lastInspection?.kilometrage || "-"}
                        </p>
                    </div>
                }
            >
                <p className="text-center font-bold text-lg">
                    <small>POS:</small> {tire?.lastInspection?.position}
                </p>
            </ToolTipTire>
        </Link>
    )
}