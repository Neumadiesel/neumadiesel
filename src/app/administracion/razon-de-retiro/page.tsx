"use client";
import { FaPen, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Modal from "@/components/common/modal/CustomModal";

interface Razon {
    id: number;
    nombre: string;
    estado: boolean;
}

const razones: Razon[] = [
    {
        id: 1,
        nombre: "Desgaste",
        estado: true,
    },
    {
        id: 2,
        nombre: "Corte",
        estado: true,
    },
    {
        id: 3,
        nombre: "Separacion",
        estado: true,
    },
    {
        id: 4,
        nombre: "Desgarro",
        estado: true,
    },
    {
        id: 5,
        nombre: "Desgaste Anormal",
        estado: false,
    },
];

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [razonSeleccionada, setRazonSeleccionada] = useState<Razon | null>(null);

    const abrirEditor = (razon: Razon) => {
        setRazonSeleccionada(razon);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Razaon desactivado", razonSeleccionada);
    };

    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md shadow-lg h-[100%] pb-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Razon de baja de neumaticos</h1>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Nueva razon de retiro"
                        className="w-52 p-2 rounded-l-md border border-gray-300"
                    />
                    <button className="bg-amber-300 flex px-4 justify-center text-black p-2 rounded-r-md items-center gap-2 text-lg font-bold">
                        <span>Crear</span>
                    </button>
                </div>
            </div>
            {/* Lista de razones de retiro */}

            <div className="relative overflow-x-auto mt-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {razon.nombre}
                                </th>
                                <td className="px-6 py-4">
                                    <p
                                        className={`${
                                            razon.estado
                                                ? "bg-green-100 border-green-500"
                                                : "bg-red-100 border-red-500"
                                        } text-black px-2 border py-1 rounded-md w-20 text-center`}
                                    >
                                        {razon.estado ? "Activo" : "Inactivo"}
                                    </p>
                                </td>
                                <td className="px-6 py-4 flex justify-center">
                                    <button
                                        onClick={() => abrirEditor(razon)}
                                        className="bg-gray-50 dark:bg-[#212121] dark:text-amber-300 hover:bg-amber-50 text-black border border-amber-200 font-bold py-2 px-4 rounded"
                                    >
                                        <FaPen className="inline-block" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="bg-gray-50 hover:bg-red-50 dark:bg-[#212121] dark:text-red-300 text-black border border-red-200 font-bold py-2 px-4 rounded ml-2"
                                    >
                                        <FaEyeSlash className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                title="Desactivar razon de retiro"
            >
                <p>
                    Desactivar una razon de retiro la retirara del sistema y de las opciones
                    disponibles, pero no eliminara los datos de la base de datos.
                </p>
                <p className="font-semibold">
                    ¿Estás seguro de que deseas desactivar esta razon de retiro?
                </p>
            </Modal>
        </div>
    );
}
