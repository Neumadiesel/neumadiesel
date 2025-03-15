'use client'
import { useEffect } from "react";
import { Neumaticos } from "@/mocks/neumaticos.json";
import Link from "next/link";
import { FaRegCopy } from "react-icons/fa";
import { useState } from "react";

export default function Page() {
    const [codigo, setCodigo] = useState('');
    const [camion, setCamion] = useState('');
    const [estado, setEstado] = useState('');
    const [filteredNeumaticos, setFilteredNeumaticos] = useState(Neumaticos);

    useEffect(() => {
        const filtered = Neumaticos.filter(neumatico =>
            (codigo.toLowerCase() === '' || neumatico.Codigo.toLowerCase().includes(codigo.toLowerCase())) &&
            (camion.toLowerCase() === '' || neumatico.Codigo_Camion.toLowerCase().includes(camion.toLowerCase()))
        );
        setFilteredNeumaticos(filtered);
    }, [codigo, camion, estado]);

    return (
        <div className=" p-4 bg-[#f1f1f1] dark:bg-[#212121] h-screen relative shadow-sm font-mono">
            <div>
                <h1 className="font-mono text-3xl font-bold">Lista de Neumaticos</h1>
            </div>
            {/* Busqueda por codigo, camion, y filtro selector por estado*/}
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-between w-full mx-auto my-2">
                    <input
                        type="text"
                        placeholder="Buscar por codigo"
                        className="border-2 p-2 rounded-md bg-white text-black dark:bg-[#212121] dark:text-white font-bold border-amber-300"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por camion"
                        className="border-2 p-2 text-black rounded-md bg-white dark:bg-[#212121] dark:text-white font-bold border-amber-300"

                        value={camion}
                        onChange={(e) => setCamion(e.target.value)}
                    />
                    <select
                        name="estado"
                        id="estado"
                        className="border-2 p-2 text-black rounded-md bg-white dark:bg-amber-300 font-bold border-amber-300"

                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="bueno">Bueno</option>
                        <option value="desgastado">Desgastado</option>
                    </select>
                    {/* Crear neumatico */}
                    <Link href="/neumaticos/crear">
                        <button className="bg-amber-300 text-black hover:bg-amber-700 border-2 border-black px-6 font-bold py-2  rounded">
                            Crear
                        </button>
                    </Link>

                </div>
            </div>

            {/* Tabla de neumaticos */}
            <div className="relative overflow-x-auto h-[80%] my-2">
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
                                Camion
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Posicion
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ultima Revision
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Prof. Interior
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Prof. Exterior
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
                        {filteredNeumaticos.map((neumatico) => (

                            <tr key={neumatico.Id} className="bg-white dark:bg-[#0b0a0a]  dark:text-white border-b text-center hover:bg-slate-100 ease-in transition-all border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap">
                                    {neumatico.Codigo}
                                </th>
                                <td className="px-6 py-4">
                                    {neumatico.Serie}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.Codigo_Camion}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.Posicion}
                                </td>
                                <td className="px-6 py-4">
                                    10/03/2025
                                </td>
                                <td className="px-6 py-4">
                                    <p className="bg-emerald-200 text-black font-bold rounded-lg p-1 px-2 border-2 border-emerald-500">
                                        {neumatico.Profundidad < 5 ? 'Desgastado' : 'Bueno'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.Profundidad}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.Profundidad}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.META_HORAS}
                                </td>
                                <td className="px-6 py-4">
                                    {neumatico.META_KMS}
                                </td>
                                <td className="px-6 py-4 flex items-center justify-center">
                                    <Link href={`/neumaticos/${neumatico.Id}`} className="">
                                        <FaRegCopy size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}