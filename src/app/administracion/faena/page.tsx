"use client";
import ModalEditarFaena from "@/components/features/faena/ModalEditarFaena";
import Modal from "@/components/common/modal/CustomModal";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import ModalRegistrarFaena from "@/components/features/faena/ModalRegistrarFaena";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import CustomModal from "@/components/common/alerts/alert";
import axios from "axios";
import { Info, Pencil } from "lucide-react";

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
    const [listaFaenas, setRazones] = useState<FaenaDTO[]>([]);
    const [faenaSelected, setFaenaSelected] = useState<FaenaDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [faenaId, setFaenaId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchFaenas = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory.neumasystem.site/sites/with-contract");
            const data = await response.json();
            setLoading(false);
            setRazones(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    const handleDesactive = async () => {
        if (!faenaId) return;
        try {
            setIsLoading(true);
            const response = await axios.patch(
                `https://inventory.neumasystem.site/sites/${faenaId}/deactivate`,
            );
            console.log("Desactivar usuario response", response);
            setIsOpen(false);
            setFaenaId(null);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al desactivar el usuario");
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleReactivate = async () => {
        if (!faenaId) return;
        try {
            setIsLoading(true);
            const response = await axios.patch(
                `https://inventory.neumasystem.site/sites/${faenaId}/activate`,
            );
            console.log("Usuario reactivado:", response.data);
            setIsOpenReactivar(false);
            setFaenaId(null);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al desactivar el usuario");
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);

    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [modalRegistarFaena, setModalRegistrarFaena] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenReactivar, setIsOpenReactivar] = useState(false);

    useEffect(() => {
        fetchFaenas();
    }, [isOpen, mostrarEditar, modalRegistarFaena, isOpenReactivar]);



    const handleEditarFaena = (faena: FaenaDTO) => {
        setFaenaSelected(faena);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white rounded-md shadow-lg h-[100%] pb-4  flex flex-col">
            <Breadcrumb />
            <section className="flex justify-between items-center mb-2 px-3">
                <h1 className="text-2xl font-bold">Contratos de faena</h1>
                <Button
                    onClick={() => { setModalRegistrarFaena(true) }}
                    text="Registrar nuevo contrato"
                />
            </section>
            <main className="px-3" >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max rounded-md overflow-hidden border">
                        <thead className="text-xs text-black uppercase bg-amber-300  ">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Faena
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Región
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Inicio Contrato
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Fin Contrato
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
                                                Cargando faenas...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : listaFaenas.length === 0 ? (
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
                                                No se encontraron faenas.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {
                                listaFaenas.map((faena) => (
                                    <tr key={faena.id} className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:text-white">
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.name}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.region}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.contract?.startDate ? new Date(faena.contract.startDate).toISOString().split("T")[0] : "Sin fecha"}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.contract?.endDate ? new Date(faena.contract.endDate).toISOString().split("T")[0] : "Sin fecha"}
                                            </p>
                                        </td>
                                        <td className="  px-2">
                                            <div className="flex gap-2">
                                                {/* boton editar */}
                                                <button onClick={() => handleEditarFaena(faena)}
                                                    className="p-2 px-3 text-green-500 hover:text-green-600 bg-green-50 dark:bg-neutral-800 border border-green-300 rounded-md flex items-center justify-center"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <Link href={`/administracion/faena/${faena.id}`}
                                                    className="p-2 px-3 text-blue-500 hover:text-blue-600 bg-blue-50 border dark:bg-neutral-800 border-blue-500 rounded-md flex items-center justify-center"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </Link>
                                                {
                                                    faena.isActive ? (
                                                        <button
                                                            onClick={() => { setFaenaId(faena.id); setIsOpen(true) }}
                                                            className="bg-gray-50 hover:bg-red-50 dark:hover:bg-neutral-700 dark:bg-[#212121] dark:text-red-300 text-black border border-red-200 font-bold py-2 px-4 rounded"
                                                        >
                                                            <FaEyeSlash className="inline-block" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setFaenaId(faena.id); setIsOpenReactivar(true) }}
                                                            className="bg-gray-50 hover:bg-emerald-50 dark:hover:bg-neutral-700 dark:bg-[#212121] dark:text-emerald-300 text-black border border-emerald-200 font-bold py-2 px-4 rounded"
                                                        >
                                                            <FaEye className="inline-block" />
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                <LoadingSpinner isOpen={isLoading} />

                {/* Modal para desactivar usuario */}
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleDesactive}
                    title="Desactivar usuario"
                >
                    <p>
                        Desactivar un usuario impedirá su acceso al sistema. Sin embargo, se mantendrán
                        registrados sus datos y las acciones realizadas previamente.
                    </p>
                    <p className="font-semibold">
                        ¿Estás seguro de que deseas desactivar este usuario?
                    </p>
                </Modal>

                {/* Modal para Reactivar usuario */}
                <Modal
                    isOpen={isOpenReactivar}
                    onClose={() => setIsOpenReactivar(false)}
                    onConfirm={handleReactivate}
                    title="Reactivar usuario"
                >
                    <p>
                        Reactivar un usuario le devolverá su acceso al sistema.
                    </p>
                    <p className="font-semibold">
                        ¿Estás seguro de que deseas reactivar este usuario?
                    </p>
                </Modal>

                {/* Modal de Alerta */}
                {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}


                {/* Modal editar Faena */}
                <ModalEditarFaena
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    faena={faenaSelected}
                    onGuardar={() => {
                        setMostrarEditar(false);
                    }} />

                <ModalRegistrarFaena
                    visible={modalRegistarFaena}
                    onClose={() => setModalRegistrarFaena(false)}
                    onGuardar={() => {
                        setModalRegistrarFaena(false);
                    }} />
            </main>
        </div>
    );
}
