'use client'
import CaracteristicasNeumatico from "@/components/historial/CaracteristicasNeumaticos";
import { useState } from "react"
import { FaSearch } from "react-icons/fa";
export default function MantenimientoPage() {
    const [neumaticoId, setNeumaticoId] = useState<string>("");
    return (
        <div className="p-4 h-[100%] w-[100%]  ">
            {/* selecter que cargue los datos del neumatico */}
            <div className="flex w-[100%] bg-white  rounded-md shadow-md px-2 items-center gap-x-2 p-2 py-3">
                <label className="font-bold">Codigo neumatico: </label>
                <input className=" border border-gray-300 text-md focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-amber-500 p-1 rounded-lg bg-[#f1f1f1]  shadow-sm " type="text" value={neumaticoId} onChange={(e) => setNeumaticoId(e.target.value)} />
                <button onClick={() => console.log("onclick")} className="bg-amber-300 text-black cursor-pointer p-2 rounded-md shadow-md hover:bg-amber-600 transition-all ease-in-out">
                    <FaSearch className="text-2xl " />
                </button>
            </div>
            {/* Contenido */}
            <main className="bg-white h-[30%] mt-4 p-2 rounded-md shadow-md w-[100%]">
                <CaracteristicasNeumatico />
            </main>

            {/* Lista de historial */}
            <section className="bg-white h-[50%] overflow-y-scroll mt-4 p-2 rounded-md shadow-md w-[100%]">
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Fecha</th>
                            <th className="border border-gray-300 px-4 py-2">Código de Acción</th>
                            <th className="border border-gray-300 px-4 py-2">Descripción</th>
                            <th className="border border-gray-300 px-4 py-2">Horas</th>
                            <th className="border border-gray-300 px-4 py-2">Distancia</th>
                            <th className="border border-gray-300 px-4 py-2">Medición</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">2023-10-01</td>
                            <td className="border border-gray-300 px-4 py-2">A001</td>
                            <td className="border border-gray-300 px-4 py-2">Cambio de neumático</td>
                            <td className="border border-gray-300 px-4 py-2">5</td>
                            <td className="border border-gray-300 px-4 py-2">120 km</td>
                            <td className="border border-gray-300 px-4 py-2">32 psi</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">2023-10-02</td>
                            <td className="border border-gray-300 px-4 py-2">A002</td>
                            <td className="border border-gray-300 px-4 py-2">Revisión de presión</td>
                            <td className="border border-gray-300 px-4 py-2">2</td>
                            <td className="border border-gray-300 px-4 py-2">50 km</td>
                            <td className="border border-gray-300 px-4 py-2">30 psi</td>
                        </tr>
                    </tbody>
                </table>

            </section>
        </div>
    )
}