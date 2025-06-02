"use client";
import { FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import ModalRegistarModeloVehiculo from "@/components/features/equipo/mod/model/ModalRegistrarModeloVehiculo";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/layout/BreadCrumb";
interface TyreModelDto {
    id: number;
    code: string;
    brand: string;
    dimensions: string;
    constructionType: string;
    rubberDesign: string;
    originalTread: number;
    TKPH: number;
    cost: number;
    nominalHours: number;
    nominalKilometrage: number;
}
interface TireDto {
    id: number;
    code: string;
    modelId: number;
    initialTread: number;
    initialKilometrage: number;
    initialHours: number;
    locationId: number;
}

export default function EquiposPorModelo() {
    const { id } = useParams();
    const [tires, setTires] = useState<TireDto[]>([]);
    const [model, setModel] = useState<TyreModelDto>({} as TyreModelDto);
    const [loading, setLoading] = useState(true);
    const fetchVehicleModels = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://inventory.neumasystem.site/tiremodels/${id}/with-tires`);
            const data = await response.json();
            console.log(data);
            console.log("Vehiculos", data.vehicles)
            setModel(data);
            setTires(data.tires);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchVehicleModels();
    }, []);

    const [modalRegistarFaena, setModalRegistrarFaena] = useState(false);

    useEffect(() => {
        fetchVehicleModels();
    }, [modalRegistarFaena]);

    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <Breadcrumb />
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Lista de Neumáticos de {model.brand} - {model.constructionType}</h1>
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max overflow-hidden rounded-md border">
                        <thead className="text-xs text-black uppercase bg-amber-300  ">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Código
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Horas
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Kilometraje
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Tipo de Equipo
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Acciones
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 dark:bg-neutral-800">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando Neumáticos...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tires.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-8">
                                        <div className="flex flex-col items-center justify-center space-y-4  animate-pulse">
                                            <svg
                                                className="w-12 h-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No se encontraron Neumáticos.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {
                                tires.map((tire) => (
                                    <tr key={tire.id} className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:text-white">
                                        <td className="p-4  ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.initialTread}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.initialKilometrage}
                                            </p>
                                        </td>
                                        <td className="p-4  ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                CAEX
                                            </p>
                                        </td>
                                        <td className="   px-2">
                                            <div className="flex gap-2">
                                                {/* Boton de ver detalles */}
                                                <Link href={`/neumaticos/${tire.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border border-blue-300 rounded-md flex items-center justify-center">
                                                    <FaInfoCircle />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/* Modal editar Faena */}
                {/* <ModalEditarVehicleModel
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    vehicleModel={vehicleModelSelected}
                    onGuardar={() => {
                        setMostrarEditar(false);
                    }} /> */}

                <ModalRegistarModeloVehiculo
                    visible={modalRegistarFaena}
                    onClose={() => setModalRegistrarFaena(false)}
                    onGuardar={() => {
                        setModalRegistrarFaena(false);
                    }} />
            </main>
        </div>
    );
}
