"use client";
import Budget from "@/components/features/faena/budget/ListaBudget";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

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


export default function Faena({ id }: { id?: string }) {
    const authFetch = useAuthFetch();
    const { user } = useAuth();

    const [faena, setFaena] = useState<FaenaDTO | null>(null);

    const fetchFaenas = async () => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/${id}/with-contract`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setFaena(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);

    useEffect(() => {
        fetchFaenas();
    }, [user]);

    return (
        <div className="bg-white dark:bg-neutral-800 dark:text-white rounded-lg h-full ">
            <Breadcrumb />
            <h1 className="text-3xl font-bold px-4">Faena {faena?.name
                ? faena.name
                : "Cargando.."
            }</h1>
            <div className="flex justify-between items-center border-b px-4 py-2 border-gray-300 pb-4">
                <div className="flex  gap-2">

                    <span className="text-md text-gray-600 dark:text-white font-semibold flex items-center gap-2">
                        <FaCalendarAlt className="text-3xl" />
                        <div className="flex flex-col">
                            <span>Inicio: </span>
                            <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                                {faena?.contract?.startDate ? new Date(faena.contract.startDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                        <FaCalendarAlt className="text-3xl ml-4" />
                        <div className="flex flex-col gap-1">
                            <span>Fecha: </span>
                            <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                                {faena?.contract?.endDate ? new Date(faena.contract.endDate).toISOString().split("T")[0] : "Sin fecha"}
                            </span>
                        </div>
                    </span>
                </div>
            </div>

            <Budget siteId={Number(id)} />
        </div>
    );
}
