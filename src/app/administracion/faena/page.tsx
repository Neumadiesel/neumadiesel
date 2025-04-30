"use client";
import ModalEditarFaena from "@/components/features/faena/ModalEditarFaena";
import Modal from "@/components/common/modal/CustomModal";
import Link from "next/link";
import { FaEyeSlash, FaFile, FaPlusSquare } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";

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
    const fetchFaenas = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/sites/with-contract");
            const data = await response.json();
            setLoading(false);
            setRazones(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);

    const [mostrarEditar, setMostrarEditar] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };


    useEffect(() => {
        fetchFaenas();
    }, [isOpen, mostrarEditar]);



    const handleEditarFaena = (faena: FaenaDTO) => {
        setFaenaSelected(faena);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Contratos de faena</h1>
                <button className="bg-gray-100 hover:bg-gray-200 flex px-4 justify-center text-black p-2 rounded-sm border-2 border-amber-300 items-center gap-2 text-md font-semibold">
                    <FaPlusSquare className="text-xl" />
                    <span>Registrar Nuevo contrato</span>
                </button>
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="text-xs text-black uppercase bg-amber-300 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Faena
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                        Region
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
                                    <td colSpan={6} className="text-center p-8">
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
                                    <tr key={faena.id}>
                                        <td className="p-4 border-b border-blue-gray-50 bg-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.name}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.region}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50 bg-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.contract?.startDate ? new Date(faena.contract.startDate).toISOString().split("T")[0] : "Sin fecha"}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.contract?.endDate ? new Date(faena.contract.endDate).toISOString().split("T")[0] : "Sin fecha"}
                                            </p>
                                        </td>
                                        <td className=" border-b border-blue-gray-50 bg-gray-50 px-2">
                                            <div className="flex gap-2">
                                                <Link href={`/administracion/faena/${faena.id}`} className="p-2 text-amber-500 hover:text-amber-600 bg-amber-50 border border-amber-300 rounded-md flex items-center justify-center">
                                                    <FaFile />
                                                </Link>
                                                {/* boton editar */}
                                                <button onClick={() => handleEditarFaena(faena)} className="p-2 text-green-500 hover:text-green-600 bg-green-50 border border-green-300 rounded-md flex items-center justify-center">
                                                    <FaPencil />
                                                </button>
                                                {/* boton desactivar */}
                                                <button
                                                    onClick={() => setIsOpen(true)}
                                                    className="p-2 text-red-500 hover:text-red-600 bg-red-50 border border-red-300 rounded-md flex items-center justify-center"
                                                >
                                                    <FaEyeSlash className="inline-block" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/* Modal para desactivar usuario */}
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirm}
                    title="Desactivar Faena"
                >
                    <p>
                        Desactivar una faena significa que no podrá ser utilizada en el sistema. Esto no eliminará la faena, solo la desactivará.
                    </p>
                    <p>
                        Los usuarios asociados a esta faena no podrán acceder al sistema.
                    </p>
                    <p className="font-semibold">
                        ¿Estás seguro de que deseas desactivar esta Faena?
                    </p>
                </Modal>
                {/* Modal editar Faena */}
                <ModalEditarFaena
                    visible={mostrarEditar}
                    onClose={() => setMostrarEditar(false)}
                    faena={faenaSelected}
                    onGuardar={() => {
                        setMostrarEditar(false);
                        console.log("Faena actualizada");
                    }} />
            </main>
        </div>
    );
}
