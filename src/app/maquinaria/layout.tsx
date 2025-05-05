"use client"
import Link from "next/link";
import { GiMineTruck } from "react-icons/gi";
import { useEffect, useState } from "react";

interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    kilometrage: number;
    hours: number;
    model: {
        id: number;
        brand: string;
        model: string;
        wheelCount: number;
    };
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);

    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/vehicles");
            const data = await response.json();
            setLoading(false);
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    return (
        <div className="  block lg:flex  min-h-[100%]">
            {/* Lista de camiones */}
            <main className="w-full lg:w-[40%] lg:h-screen h-[45vh]  flex justify-center items-center">
                <div className="bg-white dark:bg-black shadow-md w-[100%] h-[100%] ">
                    <h2 className="dark:text-amber-300 text-2xl font-bold p-2">Lista de Equipos</h2>
                    {/* Lista de camiones */}
                    <div className="grid grid-cols-3 h-[90%] overflow-scroll gap-x-4 gap-y-2 px-4">
                        {vehicles.map(vehicle => (
                            <Link
                                href={`/maquinaria/${vehicle.id}`}
                                key={vehicle.id}
                                className="flex flex-col h-28 justify-center items-center p-2 bg-[#f1f1f1] dark:bg-[#212121] rounded-md hover:bg-amber-200 transition-all ease-in-out shadow-sm"
                            >
                                <GiMineTruck size={35} />
                                <p className="text-xl font-semibold font-mono">{vehicle.code}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
            {/* Contenido de la pagina */}
            <section className="w-full lg:w-[60%] lg:pl-4">{children}</section>
        </div>
    );
}
