'use client';
import Button from "@/components/common/button/Button";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { TireDTO } from "@/types/Tire";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TirePage() {
    const { id } = useParams();

    const [tire, setTires] = useState<TireDTO>();

    const fetchTires = async () => {
        try {
            const response = await fetch(`http://localhost:3002/tires/${id}`);
            const data = await response.json();
            console.log(data);
            setTires(data);
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
                    <h2 className="text-xl font-semibold">Detalles del Modelo</h2>
                    <div className="bg-gray-100 p-4 rounded-md border grid grid-cols-2">
                        <p><strong>Marca:</strong> {tire?.model.brand}</p>
                        <p><strong>Patron:</strong> {tire?.model.pattern}</p>
                        <p><strong>Medidas:</strong> {tire?.model.dimensions}</p>
                        <p><strong>Código:</strong> {tire?.model.code}</p>
                        <p><strong>Remanente:</strong> {tire?.model.originalTread}</p>
                    </div>
                </div>
            </section>
            {/* Cuadro informacion camion instalado */}
            {
                tire &&
                (<section className="flex w-full gap-4 mt-5">
                    <div className="flex flex-col w-1/2 gap-2">
                        <h2 className="text-xl font-semibold">Detalles del Equipo</h2>
                        <div className="bg-gray-100 p-4 rounded-md border grid grid-cols-1">
                            <p><strong>Equipo:</strong> {tire?.installedTires[0]?.vehicle?.code}</p>
                            <p><strong>Posicion:</strong> {tire?.installedTires[0]?.position}</p>
                            <p><strong>Fecha de instalacion:</strong> 07-05-2025</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 gap-2">
                        <h2 className="text-xl font-semibold">Detalles del Desgaste</h2>
                        <div className="bg-gray-100 p-4 rounded-md border grid grid-cols-2">
                            <p><strong>Desgaste Interior:</strong> {tire?.lastInspection?.internalTread}</p>
                            <p><strong>Kilometraje:</strong> {tire?.lastInspection?.kilometrage}</p>
                            <p><strong>Desgaste Exterior:</strong> {tire?.lastInspection?.externalTread}</p>
                            <p><strong>Horas:</strong> {tire?.initialHours}</p>
                            <p><strong>% de Desgaste:</strong> {calculateWearPercentage(tire.initialTread, tire.lastInspection?.externalTread)}% </p>
                        </div>
                    </div>
                </section>)
            }

            {/* Seccion de historial */}
            <section className="flex flex-col gap-4 mt-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Historial de movimientos</h2>
                    <Button disabled={true} onClick={() => { }} text="Realizar Mantenimiento" />
                </div>
                <div className="bg-gray-100 p-4 rounded-md flex justify-center items-center border">
                    <p><strong>Proximamente</strong></p>

                </div>
            </section>
        </div>
    );
}