"use client"
import Link from "next/link";
import { GiMineTruck } from "react-icons/gi";
import { useEffect, useState } from "react";
import { LayoutProvider, useLayoutContext } from "@/contexts/LayoutContext";
import ModalRegistrarVehiculo from "@/components/features/equipo/ModalRegistrarVehiculo";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";

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
    const [modalRegistrarVehiculo, setModalRegistrarVehiculo] = useState(false);
    const { hasChanged, setHasChanged } = useLayoutContext();

    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/vehicles");
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    useEffect(() => {
        fetchVehicleModels();
    }, [modalRegistrarVehiculo]);

    useEffect(() => {
        if (hasChanged) {
            fetchVehicleModels();
            console.log("hasChanged", hasChanged);
            setHasChanged(false);
        }
    }, [hasChanged]);

    return (
        <LayoutProvider>
            <div className="block lg:flex min-h-[100%]">
                {/* Lista de camiones */}
                <main className="w-full lg:w-[40%] lg:h-screen h-[45vh] flex justify-center items-center">
                    <div className="bg-white dark:bg-black shadow-md w-full h-full relative">
                        <Breadcrumb />

                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-10 h-10 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center px-4 mb-2">
                                    <h2 className="dark:text-amber-300 text-2xl font-bold p-2">Lista de Equipos</h2>
                                    <Button
                                        onClick={() => setModalRegistrarVehiculo(true)}
                                        text="Registrar nuevo equipo"
                                        className="hidden lg:flex"
                                    />
                                </div>

                                <div className="flex flex-col h-[80%] overflow-y-scroll gap-x-4 gap-y-2 px-4">
                                    {vehicles.map(vehicle => (
                                        <Link
                                            href={`/maquinaria/${vehicle.id}`}
                                            key={vehicle.id}
                                            className="flex h-20 justify-around border items-center p-2 bg-gray-100 dark:bg-[#212121] rounded-md hover:bg-gray-200 transition-all ease-in-out"
                                        >
                                            <p className="text-lg font-semibold font-mono">{vehicle.code}</p>
                                            <p className="text-sm font-semibold text-gray-500">{vehicle.model.brand} {vehicle.model.model}</p>
                                            <p className="text-sm font-semibold text-gray-500">{vehicle.site.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Contenido de la página */}
                <section className="w-full lg:w-[60%] lg:pl-4">{children}</section>
            </div>

            <ModalRegistrarVehiculo
                visible={modalRegistrarVehiculo}
                onClose={() => setModalRegistrarVehiculo(false)}
                onGuardar={() => setModalRegistrarVehiculo(false)}
            />
        </LayoutProvider>
    );
}
