"use client";
import ListaCircuitos from "@/components/features/faena/ListaCircuitos";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}
export default function Page() {


    const params = useParams<{ id: string }>();
    const id = params.id

    const [faena, setFaena] = useState<FaenaDTO | null>(null);
    const fetchFaenas = async () => {
        try {
            const response = await fetch(`http://localhost:3002/sites/${id}`);
            const data = await response.json();
            setFaena(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg h-full ">
            <h1 className="text-3xl font-bold">Faena {faena?.name
                ? faena.name
                : "Cargando.."
            }</h1>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <div className="flex flex-col gap-2">
                    <span className="text-md text-gray-600 font-semibold flex items-center gap-2">
                        <FaMapMarkerAlt /> Región: {faena?.region ? faena.region : "Cargando.."}
                    </span>
                    <span className="text-md text-gray-600 font-semibold flex items-center gap-2">
                        <FaCalendarAlt className="text-xl" />
                        <div className="flex flex-col gap-1">
                            <span>Inicio: </span>
                            <span className="text-xl font-bold text-black">
                                {faena?.contract?.startDate ? new Date(faena.contract.startDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                        <FaCalendarAlt className="text-xl ml-4" />
                        <div className="flex flex-col gap-1">
                            <span>Fecha: </span>
                            <span className="text-xl font-bold text-black">
                                {faena?.contract?.endDate ? new Date(faena.contract.endDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                    </span>
                </div>
            </div>
            {/* Lista Circuitos */}
            <ListaCircuitos />
        </div>
    );
}
