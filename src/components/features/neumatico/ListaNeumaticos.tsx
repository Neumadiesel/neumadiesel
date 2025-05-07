'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight, FaInfoCircle, FaRegCopy } from "react-icons/fa";
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";
import ModalRegistrarNeumatico from "./ModalRegistrarNeumatico";
import { Location } from "@/types/Location";
import { TireDTO } from "@/types/Tire";
import { FaPencil } from "react-icons/fa6";
// Cálculo fuera del componente




export default function ListaNeumaticos({ tipo }: { tipo: string }) {
    const [codigo, setCodigo] = useState('');
    const [camion, setCamion] = useState('');
    const [estado, setEstado] = useState('');
    const [bodega, setBodega] = useState('Bodega');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [tires, setTires] = useState<TireDTO[]>([]);

    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

    const fetchTires = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/tires");
            const data = await response.json();
            setLoading(false);
            console.log(data);
            setTires(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3002/locations");
            const data = await response.json();
            setLoading(false);
            setLocations(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    // Aplicar filtros cada vez que cambian los inputs


    const totalPages = Math.ceil(tires.length / itemsPerPage);
    const paginatedNeumaticos = tires.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchLocations();
        fetchTires();
    }, []);
    return (
        <div className="w-full">
            <Breadcrumb />
            {/* Header y filtros */}
            <div className="flex justify-between h-[10%] items-center w-full">
                <div className="gap-y-2  items-center justify-between w-full mx-auto my-2">
                    <div className="lg:w-[40%] flex items-center justify-start">
                        <h1 className="font-mono text-2xl font-bold">
                            Lista de Neumaticos {tipo !== 'operacion' && `en ${bodega}`}
                        </h1>
                    </div>
                    <div className="w-full flex justify-between">
                        <input
                            type="text"
                            placeholder="Buscar por código Neumático o Equipo"
                            className="border p-2 h-10 rounded-md bg-gray-100 lg:w-1/3 text-black dark:bg-[#212121] dark:text-white font-semibold outline-gray-200 placeholder:text-gray-700 "
                            value={codigo.toUpperCase()}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                        <select
                            className="border p-2 h-10 rounded-md bg-gray-100 lg:w-1/3 text-black dark:bg-[#212121] dark:text-white font-semibold outline-gray-200 placeholder:text-gray-700"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {
                                locations.map((location) => (
                                    <option key={location.id} value={location.name}>
                                        {location.name}
                                    </option>
                                ))
                            }
                        </select>
                        <Button
                            text="Agregar Neumatico"
                            onClick={() => setOpenRegisterModal(true)}
                            className="w-full lg:w-52 h-10 font-mono font-semibold text-black bg-amber-300 hover:bg-amber-200"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla */}
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
                                        Patron
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
                                    <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando modelos...
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
                                                No se encontraron modelos.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {
                                tires.map((tire) => (
                                    <tr key={tire.id} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200 dark:text-white">
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.model.pattern}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.initialTread}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.initialKilometrage}
                                            </p>
                                        </td>
                                        <td className="p-4 bg-gray-50">
                                            <p className="block  font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.initialHours}
                                            </p>
                                        </td>
                                        <td className="dark:bg-neutral-900 px-2">
                                            <div className="flex gap-2">
                                                {/* boton editar */}
                                                <button onClick={() => console.log(tire)} className="p-2 text-green-500 hover:text-green-600 bg-green-50 border border-green-300 rounded-md flex items-center justify-center">
                                                    <FaPencil />
                                                </button>
                                                {/* Boton de ver detalles */}
                                                <Link href={`/modelos/modelo-neumatico/${tire.id}`} className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 border border-blue-300 rounded-md flex items-center justify-center">
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
            </main>

            {/* Paginación */}
            <div className="flex h-[10%] justify-center items-center mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-3 font-mono font-semibold h-10 border border-gray-400 rounded-l-md ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-amber-300 hover:bg-amber-200"
                        } text-black`}
                >
                    <FaAngleLeft size={20} />
                </button>
                <span className="text-black bg-gray-100 border-y border-gray-400 h-10 w-48 flex justify-center items-center py-3 dark:text-white font-semibold text-lg">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-3 font-mono h-10 font-semibold border border-gray-400 rounded-r-md ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-amber-300 hover:bg-amber-200"
                        } text-black`}
                >
                    <FaAngleRight size={20} />
                </button>
            </div>
            <ModalRegistrarNeumatico
                visible={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onGuardar={() => {
                    setOpenRegisterModal(false);
                }} />
        </div>
    );
}
