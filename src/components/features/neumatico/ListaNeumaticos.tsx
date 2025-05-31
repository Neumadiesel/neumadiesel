'use client';

import { useState, useEffect } from "react";
import { Info, ArrowLeft, ArrowRight, CircleCheck, CircleOff, Donut } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";
import ModalRegistrarNeumatico from "./mod/tire/ModalRegistrarNeumatico";
import { Location } from "@/types/Location";
import { TireDTO } from "@/types/Tire";
import ModalEditarNeumatico from "./mod/tire/ModalEditarNeumatico";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import ModalStockDisponible from "./mod/tire/ModalStockDisponible";

export default function ListaNeumaticos() {
    const [codigo, setCodigo] = useState('');
    const [estado, setEstado] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [tires, setTires] = useState<TireDTO[]>([]);

    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

    // Modals
    const [editarNeumatico, setEditarNeumatico] = useState(false);
    const [stockDisponible, setStockDisponible] = useState(false);

    const [tireSelected, setTireSelected] = useState<TireDTO | null>(null);

    const fetchTires = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/tires");
            const data = await response.json();
            setLoading(false);
            console.log("INFORMACION NEUMATICOS ✅", data);
            setTires(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://inventory-service-emva.onrender.com/locations");
            const data = await response.json();
            setLoading(false);
            setLocations(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    // Aplicar filtros cada vez que cambian los inputs


    const filteredTires = tires.filter((tire) => {
        const matchCode = tire.code.toLowerCase().includes(codigo.toLowerCase());

        const matchEstado = estado === "" ||
            (estado === "Operativo"
                ? tire.location.name === "Operativo"
                : tire.location.name === estado);

        return matchCode && matchEstado;
    });

    const totalPages = Math.ceil(filteredTires.length / itemsPerPage);
    const paginatedNeumaticos = filteredTires.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchLocations();
        fetchTires();
    }, []);

    useEffect(() => {
        fetchTires();
    }, [openRegisterModal, editarNeumatico]);
    return (
        <div className="w-full">
            <Breadcrumb />
            {/* Header y filtros */}
            <div className="flex justify-between h-[10%] items-center w-full">
                <div className="gap-y-2  items-center justify-between w-full mx-auto my-2 dark:text-white">
                    <div className="lg:w-[40%] flex items-center justify-start">
                        <h1 className=" mb-2 text-2xl font-bold">
                            Lista de Neumáticos
                        </h1>
                    </div>
                    <div className="w-full flex justify-between">
                        <input
                            type="text"
                            placeholder="Buscar por código de Neumático"
                            className="border p-2 h-10 rounded-md bg-gray-100 lg:w-1/3 text-black dark:bg-[#212121] dark:text-white text-sm outline-none dark:border-neutral-700 placeholder:text-gray-700 dark:placeholder:text-gray-200"
                            value={codigo.toUpperCase()}
                            onChange={(e) => { setCodigo(e.target.value); setCurrentPage(1); }}
                        />
                        <select
                            className="border p-2 h-10 rounded-md bg-gray-100 lg:w-1/3 text-black dark:bg-[#212121] dark:text-white text-md outline-none dark:border-neutral-700 placeholder:text-gray-700"
                            value={estado}
                            onChange={(e) => {
                                setEstado(e.target.value)
                                setCurrentPage(1);
                            }}
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
                            text="Agregar Neumático"
                            onClick={() => setOpenRegisterModal(true)}
                            className="w-full lg:w-52 h-10   font-semibold text-black bg-amber-300 hover:bg-amber-200"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <main >
                <div
                    className="relative flex flex-col w-full h-full overflow-scroll border rounded-md text-gray-700 bg-white shadow-sm bg-clip-border dark:border-neutral-700 dark:text-white">
                    <table className="w-full text-left table-auto min-w-max ">
                        <thead className="text-xs text-black uppercase bg-amber-300  dark:bg-neutral-900 dark:text-white">
                            <tr>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Código
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Ubicación
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Posición
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Kilómetros
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Horas
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Int
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Ext
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block font-sans text-sm antialiased font-semibold leading-none ">
                                        Acciones
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-8 dark:bg-neutral-900">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Cargando modelos...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedNeumaticos.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center  dark:bg-[#313131] p-8">
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
                            ) :
                                paginatedNeumaticos.map((tire) => (
                                    <tr key={tire.id} className="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-gray-200 dark:text-white">
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-800">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.code}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.location.name == "Operativo" ? tire.installedTires[0].vehicle.code : tire.location.name}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-800">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.installedTires[0]?.position ? tire.installedTires[0].position : "N/A"}
                                            </p>
                                        </td>
                                        <td className="p-4 ">

                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.lastInspection.kilometrage}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-800">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.usedHours}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.lastInspection ? tire.lastInspection.internalTread : tire.initialTread}
                                            </p>
                                        </td>
                                        <td className="p-4 ">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.lastInspection ? tire.lastInspection.externalTread : tire.initialTread}
                                            </p>
                                        </td>

                                        <td className="dark:bg-neutral-800 px-2">
                                            <div className="flex gap-2">
                                                <ToolTipCustom content="Ver Detalles">
                                                    <Link
                                                        href={`/neumaticos/${tire.id}`}
                                                        className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-neutral-800 border border-blue-500 rounded-md flex items-center justify-center"
                                                    >
                                                        <Info className="w-4 h-4" />
                                                    </Link>
                                                </ToolTipCustom>
                                                {/* Condicionales */}
                                                {/* Mandar a Mantencion */}


                                                <ToolTipCustom content="Realizar Mantenimiento">
                                                    <button
                                                        disabled={tire.location.name === "Operativo" || tire.location.name === "Mantención"}
                                                        onClick={() => {
                                                            setTireSelected(tire);
                                                            setEditarNeumatico(true);
                                                        }}
                                                        className={"p-2 px-2 text-yellow-500 bg-yellow-50 dark:bg-neutral-800 border border-yellow-400 rounded-md flex items-center justify-center" + (tire.location.name === "Operativo" || tire.location.name === "Mantención" ? " grayscale-100" : "hover:text-yellow-600")}
                                                    >
                                                        <Donut className="w-4 h-4" />
                                                    </button>
                                                </ToolTipCustom>
                                                {/* Habilitar Stock */}
                                                <ToolTipCustom content="Disponer para Stock">
                                                    <button
                                                        disabled={tire.location.name === "Operativo" || tire.location.name === "Baja" || tire.location.name === "Stock Disponibles"}
                                                        onClick={() => {
                                                            setTireSelected(tire);
                                                            setStockDisponible(true);
                                                        }}
                                                        className={"p-2 px-2 text-emerald-500 bg-emerald-50 dark:bg-neutral-800 border border-emerald-300 rounded-md flex items-center justify-center" + (tire.location.name === "Operativo" || tire.location.name === "Baja" || tire.location.name === "Stock Disponibles" ? " grayscale-100" : "hover:text-emerald-600")}
                                                    >
                                                        <CircleCheck className="w-4 h-4" />
                                                    </button>
                                                </ToolTipCustom>
                                                {/* Dar de Baja */}
                                                <ToolTipCustom content="Dar de Baja">
                                                    <button
                                                        disabled={tire.location.name === "Baja" || tire.location.name === "Operativo"}
                                                        onClick={() => {
                                                            setTireSelected(tire);
                                                            setEditarNeumatico(true);
                                                        }}
                                                        className={"p-2 px-2 text-red-400 bg-red-50 dark:bg-neutral-800 border border-red-300 rounded-md flex items-center justify-center" + (tire.location.name === "Baja" || tire.location.name === "Operativo" ? " grayscale-100" : "hover:text-red-600")}
                                                    >
                                                        <CircleOff className="w-4 h-4" />
                                                    </button>
                                                </ToolTipCustom>
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
                    className={`p-3   font-semibold h-10 border rounded-full ${currentPage === 1 ? "bg-gray-100 dark:bg-neutral-800 dark:text-white " : "bg-amber-300 dark:border-black hover:bg-amber-200"
                        } text-black`}
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-black h-10 w-48 flex justify-center items-center py-3 dark:text-white text-sm">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-3   h-10 font-semibold border rounded-full ${currentPage === totalPages ? "bg-gray-200  dark:bg-neutral-800 dark:text-white" : "bg-amber-300 hover:bg-amber-200 dark:border-black"
                        } text-black`}
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <ModalEditarNeumatico
                visible={editarNeumatico}
                onClose={() => setEditarNeumatico(false)}
                tire={tireSelected}
                onGuardar={() => {
                    setEditarNeumatico(false);
                }} />
            <ModalRegistrarNeumatico
                visible={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                onGuardar={() => {
                    setOpenRegisterModal(false);
                }} />
            {/* Mandar Neumatico a stock disponible */}
            <ModalStockDisponible
                visible={stockDisponible}
                onClose={() => setStockDisponible(false)}
                tire={tireSelected}
                onGuardar={() => {
                    fetchTires();
                    setStockDisponible(false);
                }} />

        </div>
    );
}
