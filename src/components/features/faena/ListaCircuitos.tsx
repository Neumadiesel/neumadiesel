"use client";
import Modal from "@/components/common/modal/CustomModal";
import Link from "next/link";
import { FaEyeSlash, FaFile } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import ModalEditarCircuito from "./ModalEditarCircuito";

interface CircuitoDTO {
    id: number;
    nombreCircuito: string;
    distancia: number;
    velocidad: number;
    TKPH: number;
}

export default function ListaCircuitos() {
    const listaCircuitos = [
        {
            id: 1,
            nombreCircuito: "Colina",
            distancia: 10,
            velocidad: 20,
            TKPH: 30,
        },
        {
            id: 2,
            nombreCircuito: "Cuesta",
            distancia: 20,
            velocidad: 40,
            TKPH: 50,
        },
        {
            id: 3,
            nombreCircuito: "Barranca",
            distancia: 30,
            velocidad: 60,
            TKPH: 70,
        },
    ]


    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [circuitoSelected, setCircuitoSelected] = useState<CircuitoDTO>({
        id: 0,
        nombreCircuito: "",
        distancia: 0,
        velocidad: 0,
        TKPH: 0,
    });

    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };

    const handleEditarFaena = (faena: CircuitoDTO) => {
        setCircuitoSelected(faena);
        setMostrarEditar(true);
    }
    return (
        <div className="bg-white dark:bg-[#212121] p-3 rounded-md  h-[70%] pb-4 gap-4 flex flex-col">

            <div
                className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm rounded-sm bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead className="align-baseline bg-amber-200">
                        <tr>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Circuito
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Distancia
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Velocidad
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    TKPH
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
                            listaCircuitos.map((circuito) => (
                                <tr key={circuito.id}>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {circuito.nombreCircuito}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {circuito.distancia}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {circuito.velocidad}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {circuito.TKPH}
                                        </p>
                                    </td>
                                    <td className=" border-b border-blue-gray-50">
                                        <div className="flex gap-2">
                                            <Link href={`/administracion/faena/${circuito.id}`} className="p-2 text-amber-500 hover:text-amber-600 bg-amber-50 border border-amber-300 rounded-md flex items-center justify-center">
                                                <FaFile />
                                            </Link>
                                            {/* boton editar */}
                                            <button onClick={() => handleEditarFaena(circuito)} className="p-2 text-green-500 hover:text-green-600 bg-green-50 border border-green-300 rounded-md flex items-center justify-center">
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
            {/* Modal para desactivar circuito */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                title="Desactivar Faena"
            >
                <p>
                    Desactivar este circuito significa que no podrá ser utilizado por los usuarios de la faena.
                </p>
                <p className="font-semibold">
                    ¿Estás seguro de que deseas desactivar este Circuito?
                </p>
            </Modal>
            {/* Modal editar circuito */}
            <ModalEditarCircuito
                visible={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                circuito={circuitoSelected}
                onGuardar={() => {
                    setMostrarEditar(false);
                    console.log("Faena actualizada");
                }} />
        </div>
    );
}
