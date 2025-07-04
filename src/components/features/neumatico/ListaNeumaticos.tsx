'use client';

import { useState, useEffect } from "react";
import { Info, ArrowLeft, ArrowRight, CircleCheck, CircleOff, Donut, Plus } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/BreadCrumb";
import Button from "@/components/common/button/Button";
import ModalRegistrarNeumatico from "./mod/tire/ModalRegistrarNeumatico";
import { Location } from "@/types/Location";
import { TireDTO } from "@/types/Tire";
import ModalEditarNeumatico from "./mod/tire/ModalEditarNeumatico";
import ToolTipCustom from "@/components/ui/ToolTipCustom";
import ModalStockDisponible from "./mod/tire/ModalStockDisponible";
import ModalTireMaintenance from "./mod/tire/ModalTireMaintenance";
import ModalRetireTire from "./mod/tire/ModalRetireTire";
import { useAuth } from "@/contexts/AuthContext";
import { VehicleDTO } from "@/types/Vehicle";
import MultiSelect from "@/components/common/select/MultiSelect";
import { useAuthFetch } from "@/utils/AuthFetch";

export default function ListaNeumaticos() {
    const { user } = useAuth();
    const authFetch = useAuthFetch();

    const faenaId = user?.faena_id;
    const [codigo, setCodigo] = useState('');
    const [estado, setEstado] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [tires, setTires] = useState<TireDTO[]>([]);

    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);

    // Modals
    const [editarNeumatico, setEditarNeumatico] = useState(false);
    const [stockDisponible, setStockDisponible] = useState(false);
    const [maintenanceTire, setMaintenanceTire] = useState(false);
    const [retireTire, setRetireTire] = useState(false);

    // states por este ano
    const [yearStart, setYearStart] = useState(2024);
    const [yearEnd, setYearEnd] = useState(2025);

    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);

    const fetchVehicles = async () => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles([]); // Asegura que siempre sea un array
        }
    };

    const [tireSelected, setTireSelected] = useState<TireDTO | null>(null);

    const fetchTires = async () => {
        if (yearStart > yearEnd) {
            console.log("El año de inicio no puede ser mayor que el año de fin");
            return;
        }
        setLoading(true);
        if (!faenaId) {
            console.log("Faena ID is not defined");
            setLoading(false);
            return;
        }
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/yearStart/${yearStart}/yearEnd/${yearEnd}/site/${faenaId}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setLoading(false);
            console.log("INFORMACION NEUMATICOS ✅", data);
            setTires(data);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
            setLocations([]);
        }
    };

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setLoading(false);
            setLocations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching locations:", error);
            setLocations([]); // Asegura que siempre sea un array
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

        const matchVehiculo = selectedVehicles.length === 0 || (
            tire.location.name === "Operativo" &&
            selectedVehicles.includes(tire.installedTires[0]?.vehicleId)
        );

        return matchCode && matchEstado && matchVehiculo;
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
        fetchVehicles();
    }, [faenaId]);

    useEffect(() => {
        fetchTires();
    }, [openRegisterModal, editarNeumatico, yearStart, yearEnd, faenaId]);

    useEffect(() => {
        fetchTires();
        fetchLocations();
        fetchVehicles();
    }, [user]);

    return (
        <div className="w-full">
            <Breadcrumb />
            {/* Header y filtros */}
            <div className="flex justify-between h-[10%] items-center w-full">
                <div className="gap-y-2  items-center justify-between w-full mx-auto my-2 dark:text-white">
                    {/* Titulo y Agregar Neumático */}
                    <div className=" flex items-center justify-between mb-2">
                        <h1 className=" mb-2 text-2xl font-bold">
                            Lista de Neumáticos
                        </h1>
                        <Button
                            text="Agregar Neumático"
                            onClick={() => setOpenRegisterModal(true)}
                            className="w-1/3 lg:w-52 h-10   font-semibold text-black bg-amber-300 hover:bg-amber-200"
                        />
                    </div>
                    {/* Filtros */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-2 items-center justify-between px-4">
                        {/* Filtro por codigo de neumatico */}
                        <input
                            type="text"
                            placeholder="Buscar por código de Neumático"
                            className="border p-2 h-10 rounded-md bg-gray-100  text-black dark:bg-[#212121] dark:text-white text-sm outline-none dark:border-neutral-700 placeholder:text-gray-700 dark:placeholder:text-gray-200"
                            value={codigo.toUpperCase()}
                            onChange={(e) => { setCodigo(e.target.value); setCurrentPage(1); }}
                        />
                        {/* Rango de fechas */}
                        <div className="flex gap-2 items-center justify-between ">
                            <select
                                value={yearStart}
                                onChange={(e) => setYearStart(Number(e.target.value))}
                                className="border p-2 w-[50%] rounded-md bg-gray-100 dark:bg-[#212121] dark:text-white dark:border-neutral-700"
                            >
                                {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <span className="text-sm text-gray-800 dark:text-white">a</span>
                            <select
                                value={yearEnd}
                                onChange={(e) => setYearEnd(Number(e.target.value))}
                                className="border w-[50%] p-2 rounded-md bg-gray-100 dark:bg-[#212121] dark:text-white dark:border-neutral-700"
                            >
                                {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        {/* Multiselect */}
                        <div className="flex flex-row justify-center items-center ">
                            <MultiSelect
                                options={vehicles.map(vehicle => ({
                                    label: vehicle.code,
                                    value: vehicle.id.toString(),
                                    color: "bg-gray-200"
                                }))}
                                selected={selectedVehicles.map(String)}
                                onChange={(selected) => {
                                    setSelectedVehicles(selected.map(Number));
                                    setCurrentPage(1);
                                }}
                                placeholder="Filtrar Equipo..."
                            />
                            {selectedVehicles.length > 0 ? (
                                <button
                                    onClick={() => setSelectedVehicles([])}
                                    className="text-black w-8 rounded-xl h-10 text-2xl flex justify-center items-center "
                                    title="Limpiar filtros"
                                >
                                    <Plus className="text-2xl rotate-45 bg-white dark:bg-red-500 dark:text-white rounded-full" />
                                </button>
                            ) : (
                                <div className="flex flex-row text-gray-500 font-bold w-8 rounded-xl h-10 justify-center items-center ">
                                    <Plus className="text-2xl rotate-45 bg-gray-200 dark:bg-neutral-700  dark:text-neutral-400 rounded-full" />
                                </div>
                            )}
                        </div>
                        {/* Filtro por estado */}
                        <select
                            className="border p-2 h-10 rounded-md bg-gray-100 text-black dark:bg-[#212121] dark:text-white text-md outline-none dark:border-neutral-700 placeholder:text-gray-700"
                            value={estado}
                            onChange={(e) => {
                                setEstado(e.target.value)
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Filtro por Estado</option>
                            {
                                locations.map((location) => (
                                    <option key={location.id} value={location.name}>
                                        {location.name}
                                    </option>
                                ))
                            }
                        </select>

                    </div>
                </div>
            </div>

            {/* Tabla */}
            <main >
                <div
                    className="relative flex flex-col w-full overflow-scroll border rounded-md text-gray-700 bg-white dark:bg-neutral-800 shadow-sm bg-clip-border dark:border-neutral-700 dark:text-white">
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
                                    <p className="block lg:hidden font-sans text-sm antialiased font-semibold leading-none ">
                                        Pos
                                    </p>
                                    <p className="hidden lg:block font-sans text-sm antialiased font-semibold leading-none ">
                                        Posición
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p className="block lg:hidden font-sans text-sm antialiased font-semibold leading-none ">
                                        KM
                                    </p>
                                    <p className="hidden lg:block font-sans text-sm antialiased font-semibold leading-none ">
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
                                    <td colSpan={8} className="text-center p-8 dark:bg-neutral-800">
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
                                    <td colSpan={8} className="text-center  dark:bg-neutral-800 p-8">
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
                                                {tire.location.name == "Operativo"
                                                    ? tire.installedTires[0].vehicle.code.split(" ")[0]
                                                    : tire.location.name.split(" ")[0]}
                                            </p>
                                        </td>
                                        <td className="p-4  bg-gray-50 dark:bg-neutral-800">
                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.installedTires[0]?.position ? tire.installedTires[0].position : "N/A"}
                                            </p>
                                        </td>
                                        <td className="p-4 ">

                                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                                {tire.lastInspection?.kilometrage ?? 'No definido'}
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
                                                            setMaintenanceTire(true);
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
                                                            setRetireTire(true);
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
            {/* Mandar Nuematico a Mantencion */}
            <ModalTireMaintenance
                visible={maintenanceTire}
                onClose={() => setMaintenanceTire(false)}
                tire={tireSelected}
                onGuardar={() => {
                    fetchTires();
                    setMaintenanceTire(false);
                }} />
            {/* Modal Retirar neumatico */}
            <ModalRetireTire
                visible={retireTire}
                onClose={() => setRetireTire(false)}
                tire={tireSelected}
                onGuardar={() => {
                    fetchTires();
                    setRetireTire(false);
                }} />
        </div>
    );
}
