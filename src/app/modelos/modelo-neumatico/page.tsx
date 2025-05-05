"use client";
import { FaInfoCircle, FaPlusSquare } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ModalRegistrarTyreModel from "@/components/features/neumatico/ModalRegistrarTyreModel";
import Link from "next/link";
import ModaleditarTyreModel from "@/components/features/neumatico/ModalEditarTyreModel";

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
export default function ModelosNeumaticos() {
    const [tyreModels, setTyreModels] = useState<TyreModelDto[]>([]);
    const [tyreModelSelected, setTyreModelSelected] = useState<TyreModelDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchModelTyres = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/tiremodels");
            const data = await response.json();
            setLoading(false);
            setTyreModels(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    useEffect(() => {
        fetchModelTyres();
    }, []);

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [modalRegistrarModelo, setModalRegistrarModelo] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };


    useEffect(() => {
        fetchModelTyres();
    }, [isOpen, mostrarEditar, modalRegistrarModelo]);



    const handleEditTyreModel = (tyreModel: TyreModelDto) => {
        setTyreModelSelected(tyreModel);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Modelos de Neumaticos</h1>
                <button onClick={() => { setModalRegistrarModelo(true) }} className="bg-gray-100  hover:bg-neutral-300 dark:hover:bg-neumtral-700 flex px-4 justify-center text-black p-2 rounded-sm border-2 border-amber-300 items-center gap-2 text-md font-semibold dark:bg-[#212121] dark:text-white">
                    <FaPlusSquare className="text-xl" />
                    <span>Crear Nuevo Modelo</span>
                </button>
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="text-xs text-black uppercase bg-amber-300  ">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Codigo
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Marca
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Dimensiones
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Goma Original
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        TKPH
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Horas Nominales
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        KM's Nominal
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
                                    <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando modelos...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tyreModels.length === 0 ? (
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
                                                No se encontraron modelos.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {
                                tyreModels.map((tyreModel) => (
                                    <tr key={tyreModel.id} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200 dark:text-white">
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.brand}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.dimensions}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.originalTread}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.TKPH}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.nominalHours}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.nominalKilometrage}
                                            </p>
                                        </td>
                                        <td className="  bg-gray-50 dark:bg-neutral-900 px-2">
                                            <div className="flex gap-2">
                                                {/* boton editar */}
                                                <button onClick={() => handleEditTyreModel(tyreModel)} className="p-2 text-green-500 hover:text-green-600 bg-green-50 border border-green-300 rounded-md flex items-center justify-center">
                                                    <FaPencil />
                                                </button>
                                                {/* Boton de ver detalles */}
                                                <Link href={`/modelos/modelo-equipo/${tyreModel.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border border-blue-300 rounded-md flex items-center justify-center">
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
                <ModaleditarTyreModel
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    tyreModel={tyreModelSelected}
                    onGuardar={() => {
                        setMostrarEditar(false);
                    }} />

                <ModalRegistrarTyreModel
                    visible={modalRegistrarModelo}
                    onClose={() => setModalRegistrarModelo(false)}
                    onGuardar={() => {
                        setModalRegistrarModelo(false);
                    }} />
            </main>
        </div>
    );
}
