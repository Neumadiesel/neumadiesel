'use client'
import { useState } from "react";
import Link from "next/link";
import { Camiones } from "@/mocks/Camiones.json";
import { Neumaticos } from "@/mocks/neumaticos.json";
import { FaRegCopy } from "react-icons/fa";

export default function ListaMaquinaria() {
    const camionesConNeumaticos = Camiones.map((camion) => {
        const neumaticosDelCamion = Neumaticos.filter(neumatico => neumatico.Codigo_Camion === camion.Codigo);
        return { ...camion, Neumaticos: neumaticosDelCamion };
    });

    // Configuración de paginación
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(camionesConNeumaticos.length / itemsPerPage);
    const paginatedCamiones = camionesConNeumaticos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 h-screen w-full mb-4 bg-white dark:bg-[#212121] text-white relative shadow-md font-mono">
            {/* Titulo */}
            <div className="flex items-center justify-between">
                <h2 className="text-black dark:text-white text-2xl font-bold">Lista Maquinaria</h2>
            </div>

            {/* Mostrar mensaje si no hay camiones */}
            {camionesConNeumaticos.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-300 text-lg mt-10">
                    🚜 No hay camiones disponibles en este momento.
                </div>
            ) : (
                <>
                    {/* Tabla */}
                    <div className="relative overflow-x-auto h-[70vh]  my-2">
                        <table className="w-full text-sm text-left min-h-[60vh] rtl:text-right text-gray-500 shadow-md rounded-t-md overflow-hidden">
                            <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Código</th>
                                    <th scope="col" className="px-6 py-3">Marca</th>
                                    <th scope="col" className="px-6 py-3">Modelo</th>
                                    <th scope="col" className="px-6 py-3">Faena</th>
                                    <th scope="col" className="px-6 py-3">Última Revisión</th>
                                    <th scope="col" className="px-6 py-3">Profundidad Neumáticos</th>
                                    <th scope="col" className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCamiones.map((maquina) => (
                                    <tr key={maquina.Codigo} className="bg-white h-16 dark:bg-black dark:text-white border-b text-center hover:bg-slate-100 ease-in transition-all border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            {maquina.Codigo}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            {maquina.Marca}
                                        </th>
                                        <td className="px-6 py-4">{maquina.Modelo}</td>
                                        <td className="px-6 py-4">{maquina.Faena}</td>
                                        <td className="px-6 py-4">10/03/2025</td>
                                        <td className="px-6 py-4 flex gap-x-2 items-center justify-center">
                                            {maquina.Neumaticos.map(neumatico => (
                                                <p key={neumatico.Id} className="bg-emerald-200 text-black dark:text-black font-bold rounded-lg p-1 px-2 border-2 border-emerald-500">
                                                    {neumatico.Profundidad}
                                                </p>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/maquinaria/${maquina.Codigo}`} className="text-black dark:text-white">
                                                <FaRegCopy size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-center items-center mt-4 gap-4">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 font-mono font-semibold rounded-md ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-amber-300 hover:bg-amber-400"} text-black`}
                        >
                            ◀ Anterior
                        </button>
                        <span className="text-black dark:text-white font-bold text-lg">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 font-mono font-semibold rounded-md ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-amber-300 hover:bg-amber-400"} text-black`}
                        >
                            Siguiente ▶
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
