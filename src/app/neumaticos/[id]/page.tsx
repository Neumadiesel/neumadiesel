'use client';
import Button from "@/components/common/button/Button";
import Label from "@/components/common/forms/Label";
import LabelLoading from "@/components/common/forms/LabelLoading";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { TireDTO } from "@/types/Tire";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TirePage() {
    const { id } = useParams();

    const [tire, setTires] = useState<TireDTO>();
    const [loading, setLoading] = useState(true);
    const fetchTires = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3002/tires/${id}`);
            const data = await response.json();
            setTires(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    useEffect(() => {
        fetchTires();
    }, []);

    // funcion de porcentaje de desgaste
    const calculateWearPercentage = (initialTread: number | null, currentTread: number | null) => {
        if (initialTread === null || currentTread === null) return 0;
        if (initialTread === 0) return 0;
        console.log("initialTread", initialTread);
        console.log("currentTread", currentTread);
        console.log("result", ((initialTread - currentTread) / initialTread) * 100);
        return (((initialTread - currentTread) / initialTread) * 100).toFixed(2);
    };

    return (
        <div className="p-3 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm">
            <Breadcrumb />
            <h1 className="text-2xl font-bold">Información del Neumático: {tire?.code}</h1>
            {/* Add your tire details component here */}
            {/* Section cuadro de informacion */}
            <section className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                    <div className="bg-gray-50 p-4 rounded-md border grid grid-cols-3">
                        <div className="grid grid-cols-2 gap-2">

                            <LabelLoading loading={loading} title="Marca:" text={tire?.model.brand || ""} />
                            <LabelLoading loading={loading} title="Patron:" text={tire?.model.pattern || ""} />
                            <LabelLoading loading={loading} title="Código:" text={tire?.model.code || ""} />
                            <LabelLoading loading={loading} title="Medidas:" text={tire?.model.dimensions || ""} />
                            <LabelLoading loading={loading} title="OTD:" text={tire?.model.originalTread?.toString() || ""} />
                        </div>
                        <div className="px-4 grid grid-cols-2 gap-2 border-x border-gray-200">
                            <LabelLoading loading={loading} title="Desgaste Interior:" text={tire?.lastInspection?.internalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Desgaste Exterior:" text={tire?.lastInspection?.externalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Kilometraje:" text={tire?.lastInspection?.kilometrage?.toString() || ""} />
                            <LabelLoading loading={loading} title="Horas:" text={tire?.initialHours?.toString() || ""} />
                            {
                                tire &&
                                <LabelLoading loading={loading} title="% de Desgaste:" text={`${calculateWearPercentage(tire?.initialTread, tire?.lastInspection?.externalTread)}%`} />
                            }
                        </div>
                        <div className="px-4 flex flex-col gap-2 ">
                            <LabelLoading loading={loading} title="Ubicación:" text={tire?.location.name || ""} />
                            <LabelLoading loading={loading} title="Equipo:" text={tire?.installedTires[0]?.vehicle?.code || ""} />
                            <LabelLoading loading={loading} title="Posicion:" text={tire?.installedTires[0]?.position?.toString() || ""} />
                        </div>


                    </div>
                </div>
            </section>

        </div>
    );
}