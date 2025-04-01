'use client'
import { useEffect } from "react";
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
import Link from "next/link";
import { FaRegCopy } from "react-icons/fa";
import { useState } from "react";

export default function ListaNeumaticos({ tipo }: { tipo: string }) {
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
        <div >

            {/* Busqueda por codigo, camion, y filtro selector por estado*/}
            <div className="flex justify-between h-[10%] items-center">
                <div className="flex items-center justify-between w-full mx-auto my-2">
                    {
                        tipo === 'operacion' &&
                        <h1 className="font-mono text-3xl font-bold">Lista de Neumaticos</h1>
                    }

                    <input
                        type="text"
                        placeholder="Buscar por codigo"
                        className="border-2 p-2 rounded-md bg-white text-black dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    {
                        tipo === 'operacion' &&
                        <input
                            type="text"
                            placeholder="Buscar por camion"
                            className="border-2 p-2 text-black rounded-md bg-white dark:bg-[#212121] dark:text-white font-bold border-amber-300"

                            value={camion}
                            onChange={(e) => setCamion(e.target.value)}
                        />
                    }

                    {
                        tipo === 'operacion' &&
                        <select
                            name="estado"
                            id="estado"
                            className="border-2 p-2 text-black rounded-md bg-white dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Bueno" className="bg-emerald-400">Optimo</option>
                            <option value="Mantención">Precaucion</option>
                            <option value="Desgastado">Alerta</option>
                        </select>
                    }

                </div>
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
                            {
                                tipo === 'operacion' &&
                                <th scope="col" className="px-6 py-3">
                                    Camion
                                </th>
                            }
                            {
                                tipo === 'operacion' &&
                                <th scope="col" className="px-2 py-3">
                                    Posicion
                                </th>
                            }
                            <th scope="col" className="px-6 py-3">
                                Ultima Revision
                            </th>
                            {
                                tipo === "operacion" &&
                                <th scope="col" className="px-6 py-3">

                                </th>
                            }
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
                                {
                                    tipo === 'operacion' &&
                                    <td className="px-6 py-4">
                                        {neumatico.Codigo_camion}
                                    </td>
                                }
                                {
                                    tipo === 'operacion' &&
                                    <td className="px-6 py-4">
                                        {neumatico.Posición}
                                    </td>
                                }
                                <td className="px-6 py-4">
                                    10/03/2025
                                </td>
                                {
                                    tipo === "operacion" &&
                                    <td className="px-6 py-4">
                                        <div className={`font-bold  w-5 h-5 rounded-full border-2 ${neumatico.estado === 'Desgastado' ? 'bg-red-200 text-black border-red-500' : neumatico.estado === 'Mantención' ? 'bg-yellow-200 text-black border-yellow-500' : 'bg-emerald-200 text-black border-emerald-500'}`}>

                                        </div>
                                    </td>
                                }
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
    );
}