"use client"
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { LayoutProvider, useLayoutContext } from "@/contexts/LayoutContext";
import ModalRegistrarVehiculo from "@/components/features/equipo/ModalRegistrarVehiculo";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";
import { useAuth } from "@/contexts/AuthContext";
import MineTruck from "@/components/common/icons/MineTruck";
import { useAuthFetch } from "@/utils/AuthFetch";
import Grader from "@/components/common/icons/Grader";
import WheelDozer from "@/components/common/icons/WheelDozer";
import Loader from "@/components/common/icons/Loader";
import WaterTruck from "@/components/common/icons/WaterTruck";
import ServiceTruck from "@/components/common/icons/ServiceTruck";


interface VehicleDTO {
    id: number;
    code: string;
    modelId: number;
    siteId: number;
    typeId: number;
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
    const authFetch = useAuthFetch();
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [modalRegistrarVehiculo, setModalRegistrarVehiculo] = useState(false);
    const { hasChanged, setHasChanged } = useLayoutContext();
    const [codigo, setCodigo] = useState("");
    const { user } = useAuth();

    const iconosPorTipoId: Record<number, ReactElement> = {
        1: <Grader className="w-16 h-16 text-black dark:text-white" />,        // Motoniveladora
        2: <WheelDozer className="w-16 h-16 text-black dark:text-white" />,    // Bulldozer de ruedas
        3: <Loader className="w-20 h-20 rotate-y-180  text-black dark:text-white" />,        // Cargador
        4: <WaterTruck className="w-16 h-16 text-black dark:text-white" />,    // Camión de agua
        5: <ServiceTruck className="w-16 h-16 text-black dark:text-white" />,  // Camión de servicio
        6: <MineTruck className="w-16 h-16 text-black dark:text-white" />,     // Camión de extracción
    };

    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            if (user && user.faena_id !== undefined) {
                console.log("Fetching vehicles for user with faena_id:", user.faena_id);
                if (user.faena_id === 99) {
                    // Admin: obtener todos los vehículos
                    const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`);
                    if (!response) {
                        console.warn("No se pudo obtener la respuesta (res es null).");
                        return;
                    }
                    if (!response) {
                        console.warn("No se pudo obtener la respuesta (res es null).");
                        return;
                    }
                    const data = await response.json();


                    if (Array.isArray(data)) {
                        setVehicles(data);
                    } else {
                        console.error("La respuesta del backend no es un array:", data);
                        setVehicles([]);
                    }
                } else {
                    // Usuario común: obtener solo vehículos de su faena
                    const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/${user.faena_id}`);
                    if (!response) {
                        console.warn("No se pudo obtener la respuesta (res es null).");
                        return;
                    }
                    const data = await response.json();

                    if (Array.isArray(data)) {
                        setVehicles(data);
                    } else {
                        console.error("La respuesta del backend no es un array:", data);
                        setVehicles([]);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchCode = vehicle.code.toLowerCase().includes(codigo.toLowerCase());

        return matchCode;
    });


    useEffect(() => {
        if (user && user.faena_id !== undefined) {
            fetchVehicleModels();
        }
    }, [user, modalRegistrarVehiculo]);

    useEffect(() => {
        if (hasChanged) {
            fetchVehicleModels();
            setHasChanged(false);
        }
    }, [hasChanged]);

    return (
        <LayoutProvider>
            <div className="block lg:flex min-h-[100%]">
                {/* Lista de camiones */}
                <main className="w-full lg:w-[40%] lg:h-screen h-[40vh] flex justify-center items-center">
                    <div className="bg-white dark:bg-[#212121] w-full h-full relative">
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
                                <div className="flex justify-center items-center px-4 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Buscar por código de Equipo..."
                                        value={codigo.toUpperCase()}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        className="w-full h-10 px-4 border border-gray-300 dark:border-neutral-700 dark:text-white placeholder:text-white rounded-md focus:outline-none"
                                    />
                                </div>

                                <div className="flex lg:flex-col w-[100%] h-[25vh]   lg:h-[80%] max-lg:overflow-x-scroll lg:overflow-y-scroll gap-x-4 gap-y-2 px-4">
                                    {filteredVehicles.map(vehicle => (
                                        <Link
                                            href={`/maquinaria/${vehicle.id}`}
                                            key={vehicle.id}
                                            className="lg:flex max-lg:flex-col grid grid-cols-2  min-w-52 h-[90%] lg:h-20 lg:justify-between border items-center p-2 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950 lg:gap-4 rounded-md hover:bg-gray-200 dark:hover:bg-[#212121] transition-all ease-in-out"
                                        >
                                            {iconosPorTipoId[vehicle.typeId] ?? (
                                                <MineTruck className="w-16 h-16 text-gray-500 dark:text-white" />
                                            )}

                                            <p className="text-2xl font-semibold   dark:text-white">{vehicle.code}</p>
                                            <div className="flex flex-col items-start justify-center max-lg:min-w-[100%] max-lg:col-span-2">

                                                <p className="text-sm font-semibold text-gray-500 dark:text-white">{vehicle.model.brand} {vehicle.model.model}</p>
                                                <p className="text-sm font-semibold text-gray-500 dark:text-white">{vehicle.site.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Contenido de la página */}
                <section className="w-full lg:w-[60%]">{children}</section>
            </div>

            <ModalRegistrarVehiculo
                visible={modalRegistrarVehiculo}
                onClose={() => setModalRegistrarVehiculo(false)}
                onGuardar={() => setModalRegistrarVehiculo(false)}
            />
        </LayoutProvider>
    );
}
