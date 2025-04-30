"use client";
import { FaPen, FaPlusSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import ModalRegistrarRazon from "@/components/features/razon-retiro/ModalRegistrarRazon";
import ModalEditarRazon from "@/components/features/razon-retiro/ModalEditarRazon";


interface RazonDto {
    id: number;
    name: string;
    description: string;
}


export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [razonSeleccionada, setRazonSeleccionada] = useState<RazonDto | null>(null);
    const [razones, setRazones] = useState<RazonDto[]>([]);
    const abrirEditor = (razon: RazonDto) => {
        setRazonSeleccionada(razon);
        setIsOpen(true);
    };
    const [loading, setLoading] = useState(false);

    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    // crea una funcion que pida los datos desde esta api, http://localhost:3000/retirement-reasons
    // y los guarde en el estado de razones
    const fetchRazones = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/retirement-reason");
            const data = await response.json();
            setLoading(false);
            setRazones(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchRazones();
    }, []);

    useEffect(() => {
        fetchRazones();
    }, [openRegisterModal, isOpen]);

    const handleOpenModal = () => {
        setOpenRegisterModal(true);
    };

    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md shadow-lg h-[100%] pb-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Razon de baja de neumaticos</h1>
                <div className="flex">
                    <button onClick={handleOpenModal} className="bg-gray-100 hover:bg-gray-200 flex px-4 justify-center text-black p-2 rounded-sm border-2 border-amber-300 items-center gap-2 text-lg font-semibold">
                        <FaPlusSquare className="text-2xl" />
                        <span>Agregar Razon de Retiro</span>
                    </button>
                </div>
            </div>
            {/* Lista de razones de retiro */}

            <div className="relative overflow-x-auto mt-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Acciones
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
                                            Cargando razones de retiro...
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : razones.length === 0 ? (
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
                                            No se encontraron razones de retiro.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : null}
                        {razones.map(razon => (
                            <tr
                                key={razon.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 bg-gray-50 whitespace-nowrap dark:text-white"
                                >
                                    {razon.name}
                                </th>
                                <td className="px-6 py-4">
                                    <p
                                        className={` text-black px-2 py-1 rounded-md `}
                                    >
                                        {razon.description}
                                    </p>
                                </td>
                                <td className="px-6 py-4 flex justify-center bg-gray-50">
                                    <button
                                        onClick={() => abrirEditor(razon)}
                                        className="bg-gray-50 dark:bg-[#212121] dark:text-amber-300 hover:bg-amber-50 text-black border border-amber-200 font-bold py-2 px-4 rounded"
                                    >
                                        <FaPen className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalRegistrarRazon
                visible={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onGuardar={() => {
                    setOpenRegisterModal(false);
                }} />

            <ModalEditarRazon
                visible={isOpen}
                razon={razonSeleccionada}
                onClose={() => setIsOpen(false)}
                onGuardar={() => {
                    setIsOpen(false);
                }} />

        </div>
    );
}
