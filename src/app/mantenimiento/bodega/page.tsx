'use client'
import Link from "next/link"
import { FaRegCopy } from "react-icons/fa"
import { useState } from "react"
import { useEffect } from "react"

import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";

export default function page() {
    const neumaticos = DB_Relacion_Numaticos_Camion.map(neumatico => {
        const diferencia = Math.abs(neumatico.medicion_exterior - neumatico.medicion_interior);
        let estado = 'Bueno';
        if (diferencia > 4) {
            estado = 'Desgastado';
        } else if (diferencia > 2) {
            estado = 'Mantención';
        }
        return { ...neumatico, estado };
    });

    const [codigo, setCodigo] = useState('');
    const [camion, setCamion] = useState('');
    const [estado, setEstado] = useState('');
    const [filteredNeumaticos, setFilteredNeumaticos] = useState(neumaticos);

    useEffect(() => {
        const filtered = neumaticos.filter(neumatico =>
            (codigo.toLowerCase() === '' || neumatico.id_neumatico.toLowerCase().includes(codigo.toLowerCase())) &&
            (camion.toLowerCase() === '' || neumatico.Codigo_camion.toLowerCase().includes(camion.toLowerCase())) &&
            (estado === '' || neumatico.estado.toLowerCase() === estado.toLowerCase())
        );
        setFilteredNeumaticos(filtered);
        setCurrentPage(1);
    }, [codigo, camion, estado]);

    // Configuración de paginación
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredNeumaticos.length / itemsPerPage);
    const paginatedNeumaticos = filteredNeumaticos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return (
        <div className="bg-white m-3 p-3 rounded-md shadow-lg h-[95%] font-mono">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-3xl">Neumaticos en bodega</h2>
                <select className="bg-amber-50 w-[20%] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" >
                    <option value="volvo">Bodega</option>
                    <option value="saab">Baja</option>
                    <option value="mercedes">Recuperados</option>
                    <option value="audi">Reparacion</option>
                </select>
            </div>


            {/* Tabla de neumaticos */}
            <div className="relative overflow-x-auto h-[75%] my-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md rounded-t-md overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Codigo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Serie
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ultima Revision
                            </th>
                            <th scope="col" className="px-6 py-3">

                            </th>
                            <th scope="col" className="px-2 py-3">
                                Int.
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Ext.
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Horas
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kms
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedNeumaticos.map((neumatico) => (

                            <tr key={neumatico.id} className="bg-white dark:bg-[#0b0a0a] h-16 dark:text-white border-b text-center hover:bg-slate-100 ease-in transition-all border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">
                                    {neumatico.id_neumatico}
                                </th>
                                <td className="px-6 py-4">
                                    {neumatico.id_neumatico}
                                </td>
                                <td className="px-6 py-4">
                                    10/03/2025
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`font-bold  py-3 rounded-full border-2 ${neumatico.estado === 'Desgastado' ? 'bg-red-200 text-black border-red-500' : neumatico.estado === 'Mantención' ? 'bg-yellow-200 text-black border-yellow-500' : 'bg-emerald-200 text-black border-emerald-500'}`}>

                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.medicion_exterior}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.medicion_interior}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.Horas_utilizados}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.km_utilizados}
                                </td>
                                <td className="px-6 py-4 flex items-center justify-center">
                                    <Link href={`/mantenimiento/Historial`} className="">
                                        <FaRegCopy size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
            <div className="flex h-[10%] justify-center items-center mt-4 gap-4">
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
        </div>
    )
}