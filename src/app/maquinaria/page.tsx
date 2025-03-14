import Link from "next/link"
import { Camiones } from "@/mocks/Camiones.json"
import { Neumaticos } from "@/mocks/neumaticos.json"
import { FaRegCopy } from "react-icons/fa";

export default function ListaMaquinaria() {
    const camionesConNeumaticos = Camiones.map((camion) => {
        const neumaticosDelCamion = Neumaticos.filter(neumatico => neumatico.Codigo_Camion === camion.Codigo);
        return { ...camion, Neumaticos: neumaticosDelCamion };
    });

    console.log(camionesConNeumaticos);
    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            {/* Titulo y acceso a ver mas */}
            <div className="flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Lista Maquinaria</h2>
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
                                Marca
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Modelo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Faena
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ultima Revision
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Profundidad Neumaticos
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {camionesConNeumaticos.map((maquina) => (

                            <tr key={maquina.Codigo} className="bg-white border-b text-center hover:bg-slate-100 ease-in transition-all border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {maquina.Codigo}
                                </th>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {maquina.Marca}
                                </th>
                                <td className="px-6 py-4">
                                    {maquina.Modelo}
                                </td>
                                <td className="px-6 py-4">
                                    {maquina.Faena}
                                </td>
                                <td className="px-6 py-4">
                                    10/03/2025
                                </td>
                                <td className="px-6 py-4 flex gap-x-2 items-center justify-center">
                                    {
                                        maquina.Neumaticos.map(neumatico =>
                                            <p key={neumatico.Id} className="bg-emerald-200 font-bold rounded-lg p-1 px-2 border-2 border-emerald-500">
                                                {neumatico.Profundidad}
                                            </p>
                                        )
                                    }
                                </td>
                                <td className="px-6 py-4 ">
                                    <Link href={`/maquinaria/${maquina.Codigo}`} className="text-black">
                                        <FaRegCopy size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}