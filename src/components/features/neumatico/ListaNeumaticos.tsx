'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight, FaRegCopy } from "react-icons/fa";
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
import Breadcrumb from "@/components/layout/BreadCrumb";

// Cálculo fuera del componente
const neumaticosConEstado = DB_Relacion_Numaticos_Camion.map(neumatico => {
    const diferencia = Math.abs(neumatico.medicion_exterior - neumatico.medicion_interior);
    let estado = 'Bueno';
    if (diferencia > 4) {
        estado = 'Desgastado';
    } else if (diferencia > 2) {
        estado = 'Mantención';
    }
    return { ...neumatico, estado };
});

export default function ListaNeumaticos({ tipo }: { tipo: string }) {
    const [codigo, setCodigo] = useState('');
    const [camion, setCamion] = useState('');
    const [estado, setEstado] = useState('');
    const [bodega, setBodega] = useState('Bodega');

    const [filteredNeumaticos, setFilteredNeumaticos] = useState(neumaticosConEstado);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Aplicar filtros cada vez que cambian los inputs
    useEffect(() => {
        const filtered = neumaticosConEstado.filter(neumatico =>
            (codigo === '' || neumatico.id_neumatico.toLowerCase().includes(codigo.toLowerCase())) &&
            (camion === '' || neumatico.Codigo_camion.toLowerCase().includes(camion.toLowerCase())) &&
            (estado === '' || neumatico.estado.toLowerCase() === estado.toLowerCase())
        );
        setFilteredNeumaticos(filtered);
        setCurrentPage(1);
    }, [codigo, camion, estado]);

    const totalPages = Math.ceil(filteredNeumaticos.length / itemsPerPage);
    const paginatedNeumaticos = filteredNeumaticos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="w-full">
            <Breadcrumb />
            {/* Header y filtros */}
            <div className="flex justify-between h-[10%] items-center w-full">
                <div className="gap-y-2 lg:flex items-center justify-between w-full mx-auto my-2">
                    <div className="lg:w-[40%] flex items-center justify-start">
                        <h1 className="font-mono text-2xl font-bold">
                            Lista de Neumaticos {tipo !== 'operacion' && `en ${bodega}`}
                        </h1>
                    </div>
                    <section className="w-full lg:w-[60%] grid gap-y-2 py-2 grid-cols-1 lg:flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Codigo Neumatico"
                            className="border-2 p-2 h-10 rounded-md bg-white lg:w-52 text-black dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                        {tipo !== 'operacion' && (
                            <select
                                className="border-2 h-10 p-2 text-neutral-500 lg:w-52 rounded-md bg-white dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                                value={bodega}
                                onChange={(e) => setBodega(e.target.value)}
                            >
                                <option value="Bodega">Bodega</option>
                                <option value="Baja">Baja</option>
                                <option value="Recuperados">Recuperados</option>
                                <option value="Reparacion">Reparacion</option>
                            </select>
                        )}
                        {tipo === 'operacion' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Codigo Equipo"
                                    className="border-2 h-10 p-2 text-black font-bold rounded-md lg:w-52 bg-white dark:bg-[#212121] dark:text-white border-amber-300"
                                    value={camion}
                                    onChange={(e) => setCamion(e.target.value)}
                                />
                                <select
                                    name="estado"
                                    id="estado"
                                    className="border-2 h-10 p-2 text-neutral-500 lg:w-52 rounded-md bg-white dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="">Estado</option>
                                    <option value="Bueno">Optimo</option>
                                    <option value="Mantención">Precaucion</option>
                                    <option value="Desgastado">Alerta</option>
                                </select>
                            </>
                        )}
                    </section>
                </div>
            </div>

            {/* Tabla */}
            <div className="relative overflow-x-auto h-[75%] my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md rounded-t-md overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Codigo</th>
                            {tipo === 'operacion' && <th className="px-6 py-3">Camion</th>}
                            {tipo === 'operacion' && <th className="px-2 py-3">Posicion</th>}
                            <th className="px-6 py-3 hidden lg:block">Ultima Revision</th>
                            {tipo === "operacion" && <th className="px-6 py-3">Estado</th>}
                            <th className="px-2 py-3">Int.</th>
                            <th className="px-2 py-3">Ext.</th>
                            <th className="px-6 py-3">Horas</th>
                            <th className="px-6 py-3">Kms</th>
                            <th className="px-6 py-3">Historial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedNeumaticos.map((neumatico) => (
                            <tr key={neumatico.id} className="bg-white dark:bg-[#0b0a0a] h-16 dark:text-white border-b text-center hover:bg-slate-100 ease-in transition-all border-gray-200">
                                <th className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">{neumatico.id_neumatico}</th>
                                {tipo === 'operacion' && <td className="px-6 py-4">{neumatico.Codigo_camion}</td>}
                                {tipo === 'operacion' && <td className="px-6 py-4">{neumatico.Posición}</td>}
                                <td className="px-6 py-4 hidden lg:block">10/03/2025</td>
                                {tipo === "operacion" && (
                                    <td className="px-6 py-4">
                                        <div className={`font-bold w-5 h-5 rounded-full border-2 ${neumatico.estado === 'Desgastado'
                                            ? 'bg-red-200 border-red-500'
                                            : neumatico.estado === 'Mantención'
                                                ? 'bg-yellow-200 border-yellow-500'
                                                : 'bg-emerald-200 border-emerald-500'
                                            }`} />
                                    </td>
                                )}
                                <td className="px-6 py-4">{neumatico.medicion_exterior}</td>
                                <td className="px-6 py-4">{neumatico.medicion_interior}</td>
                                <td className="px-6 py-4">{neumatico.Horas_utilizados}</td>
                                <td className="px-6 py-4">{neumatico.km_utilizados}</td>
                                <td className="px-6 py-4 flex items-center justify-center">
                                    <Link href={`/mantenimiento/Historial`}>
                                        <FaRegCopy size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
}
