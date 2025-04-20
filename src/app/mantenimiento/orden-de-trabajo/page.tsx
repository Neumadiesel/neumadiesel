"use client";

import { Pencil, Eye } from "lucide-react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import MultiSelect from "@/components/common/select/MultiSelect";
import Link from "next/link";
interface Orden {
    id: number;
    codigoOT: string;
    descripcion: string;
    equipo: string;
    fecha: string;
    estado: "Pendiente" | "En Proceso" | "Finalizada";
}

const opcionesEstado = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "En Proceso", value: "En Proceso" },
    { label: "Finalizada", value: "Finalizada" },
];

const ordenes: Orden[] = [
    {
        id: 1,
        codigoOT: "123456",
        descripcion: "Mantenimiento Preventivo",
        equipo: "H45",
        fecha: "2025-04-16",
        estado: "Pendiente",
    },
    {
        id: 2,
        codigoOT: "123457",
        descripcion: "Mantenimiento Correctivo",
        equipo: "H36",
        fecha: "2025-04-14",
        estado: "En Proceso",
    },
    {
        id: 3,
        codigoOT: "123458",
        descripcion: "Mantenimiento Correctivo",
        equipo: "H38",
        fecha: "2025-04-10",
        estado: "Finalizada",
    },
];

const getEstadoColor = (estado: Orden["estado"]) => {
    switch (estado) {
        case "Pendiente":
            return "bg-yellow-100 text-yellow-800";
        case "En Proceso":
            return "bg-blue-100 text-blue-800";
        case "Finalizada":
            return "bg-green-100 text-green-800";
        default:
            return "";
    }
};

export default function OrdenesTrabajoList() {
    const [estadosSeleccionados, setEstadosSeleccionados] = useState<string[]>([]);
    const [codigoBusqueda, setCodigoBusqueda] = useState("");

    const ordenesFiltradas = ordenes.filter(el => {
        const matchEstado =
            estadosSeleccionados.length === 0 || estadosSeleccionados.includes(el.estado);
        const matchCodigo = el.equipo.toLowerCase().includes(codigoBusqueda.toLowerCase());
        return matchEstado && matchCodigo;
    });

    return (
        <div className="p-4">
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold mb-4">Órdenes de Trabajo</h2>
                {/* seccion de botones y filtros */}
                <div className="flex flex-row w-[70%] justify-between items-center mb-4">
                    {/* input de busqueda */}
                    <div className="flex flex-row justify-center items-center w-[30%]">
                        <input
                            type="text"
                            placeholder="Buscar por código..."
                            value={codigoBusqueda}
                            onChange={e => setCodigoBusqueda(e.target.value)}
                            className="border px-3 py-2 rounded-md bg-white shadow-sm w-full sm:w-64"
                        />
                    </div>
                    {/* MultiSelect */}
                    <div className="flex flex-row justify-center items-center w-[30%]">
                        <MultiSelect
                            options={opcionesEstado}
                            selected={estadosSeleccionados}
                            onChange={setEstadosSeleccionados}
                            placeholder="Filtrar por estado..."
                        />
                        {estadosSeleccionados.length > 0 ? (
                            <button
                                onClick={() => setEstadosSeleccionados([])}
                                className="text-black w-8 rounded-xl h-10 text-2xl flex justify-center items-center "
                                title="Limpiar filtros"
                            >
                                <FaPlusCircle className="text-2xl rotate-45 bg-white rounded-full" />
                            </button>
                        ) : (
                            <div className="flex flex-row text-gray-500 font-bold w-8 rounded-xl h-10 justify-center items-center ">
                                <FaPlusCircle className="text-2xl rotate-45 bg-gray-200 rounded-full" />
                            </div>
                        )}
                    </div>
                    {/* boton de nueva orden de trabajo */}
                    <div className="flex flex-row justify-center items-center">
                        <button className="bg-amber-300 text-black px-4 py-2 rounded-md flex flex-row justify-center items-center gap-x-2 font-bold">
                            <FaPlusCircle className="w-4 h-4 mr-1" />
                            Nueva Orden de Trabajo
                        </button>
                    </div>
                </div>
            </div>
            {/* seccion de tabla */}
            <div className="overflow-x-auto rounded-md shadow">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-amber-300 text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Codigo OT</th>
                            <th className="px-4 py-2">Descripcion</th>
                            <th className="px-4 py-2">Equipo</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenesFiltradas.map(orden => (
                            <tr key={orden.id} className="border-t bg-gray-100">
                                <td className="px-4 py-2">{orden.codigoOT}</td>
                                <td className="px-4 py-2">{orden.descripcion}</td>
                                <td className="px-4 py-2">{orden.equipo}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                                            orden.estado
                                        )}`}
                                    >
                                        {orden.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{orden.fecha}</td>
                                <td className="py-2 space-x-2 flex flex-row justify-center items-center">
                                    <Link href={`/mantenimiento/orden-de-trabajo/${orden.id}`}>
                                        <Eye className="w-4 h-4 mr-1" />
                                    </Link>
                                    <button>
                                        <Pencil className="w-4 h-4 mr-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
