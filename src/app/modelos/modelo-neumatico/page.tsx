"use client";
import { FaInfoCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ModalRegistrarTyreModel from "@/components/features/neumatico/mod/model/ModalRegistrarTyreModel";
import Link from "next/link";
import ModaleditarTyreModel from "@/components/features/neumatico/mod/model/ModalEditarTyreModel";
import { TyreModelDto } from "@/types/TyreModelDTO";
import Button from "@/components/common/button/Button";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";

export default function ModelosNeumaticos() {
    const authFetch = useAuthFetch();
    const [tyreModels, setTyreModels] = useState<TyreModelDto[]>([]);
    const [tyreModelSelected, setTyreModelSelected] = useState<TyreModelDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, siteId } = useAuth();
    const fetchModelTyres = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tiremodels/`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setLoading(false);
            setTyreModels(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [modalRegistrarModelo, setModalRegistrarModelo] = useState(false);


    useEffect(() => {
        if (user) { fetchModelTyres(); }
    }, [mostrarEditar, modalRegistrarModelo, user, siteId]);



    const handleEditTyreModel = (tyreModel: TyreModelDto) => {
        setTyreModelSelected(tyreModel);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white p-3 rounded-md shadow-lg  pb-4 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Modelos de Neumaticos</h1>
                <Button onClick={() => { setModalRegistrarModelo(true) }} text="Crear Nuevo Modelo" />
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700  shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max overflow-hidden rounded-md">
                        <thead className="text-xs text-black uppercase bg-amber-300  ">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Código
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
                                        Patrón
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Goma Original
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
                                    <tr key={tyreModel.id} className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:text-white">
                                        <td className="p-4   ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.brand}
                                            </p>
                                        </td>
                                        <td className="p-4   ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.dimensions}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.pattern}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block  font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tyreModel.originalTread}
                                            </p>
                                        </td>
                                        <td className=" px-2">
                                            <div className="flex gap-2">
                                                {/* boton editar */}
                                                <button onClick={() => handleEditTyreModel(tyreModel)} className="p-2 text-green-500 hover:text-green-600 bg-green-50 dark:bg-neutral-700 border border-green-300 rounded-md flex items-center justify-center">
                                                    <FaPencil />
                                                </button>
                                                {/* Boton de ver detalles */}
                                                <Link href={`/modelos/modelo-neumatico/${tyreModel.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border dark:bg-neutral-700 border-blue-300 rounded-md flex items-center justify-center">
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
