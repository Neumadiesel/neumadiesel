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

    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    // crea una funcion que pida los datos desde esta api, http://localhost:3000/retirement-reasons
    // y los guarde en el estado de razones
    const fetchRazones = async () => {
        try {
            const response = await fetch("http://localhost:3002/retirement-reason");
            const data = await response.json();
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
