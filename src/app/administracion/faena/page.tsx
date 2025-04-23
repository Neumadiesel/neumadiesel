"use client";
import ModalEditarFaena from "@/components/features/faena/ModalEditarFaena";
import Modal from "@/components/common/modal/CustomModal";
import Link from "next/link";
import { FaEyeSlash, FaFile } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";

interface FaenaDTO {
    id: number;
    nombre: string;
    region: string;
    inicio: Date;
    fin: Date;
}

export default function Page() {
    const listaFaenas = [
        {
            id: 1,
            nombre: "Zaldivar - CMZ",
            region: "Antofagasta",
            inicio: new Date("2024-01-01"),
            fin: new Date("2024-01-01"),
        },
        {
            id: 2,
            nombre: "El Peñon",
            region: "Antofagasta",
            inicio: new Date("2024-02-01"),
            fin: new Date("2024-02-01"),
        },
        {
            id: 3,
            nombre: "La Negra",
            region: "Antofagasta",
            inicio: new Date("2024-03-01"),
            fin: new Date("2024-03-01"),
        },
    ]


    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [faenaSelected, setFaenaSelected] = useState<FaenaDTO>({
        id: 0,
        nombre: "",
        region: "",
        inicio: new Date(),
        fin: new Date(),
    });

    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };


    const handleEditarFaena = (faena: FaenaDTO) => {
        setFaenaSelected(faena);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md shadow-lg h-[100%] pb-4 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Contratos de faena</h1>
                <button className="bg-amber-300 hover:bg-amber-400 flex px-4 justify-center text-black p-2 rounded-md items-center gap-2 text-md font-semibold">
                    <span>Nuevo contrato</span>
                </button>
            </section>
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm rounded-sm bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead className="align-baseline bg-amber-200">
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
                            {
                                listaFaenas.map((faena) => (
                                    <tr key={faena.id}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.nombre}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.region}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.inicio.toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {faena.fin.toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className=" border-b border-blue-gray-50">
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
