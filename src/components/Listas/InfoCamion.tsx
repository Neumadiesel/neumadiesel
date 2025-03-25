'use client'
import { Camiones } from "@/mocks/Camiones.json"
import { Neumaticos } from "@/mocks/neumaticos.json"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { FaClock, FaPodcast } from "react-icons/fa"
import { FaCircleDot } from "react-icons/fa6"

interface NeumaticoInt {
    Id: string;
    Codigo: string;
    Serie: string;
    Codigo_Camion: string;
    Profundidad: number;
    META_HORAS: number;
    META_KMS: number;
    Costo: number;
    Posicion: number;
}

export default function ListaMaquinaria() {

    const params = useParams<{ id: string }>();
    const id = params.id

    console.log(id)

    const [isSensorActive, setIsSensorActive] = useState(false);

    const camion = Camiones.find(camion => camion.Codigo === id);

    const sensores = [
        { posicion: 1, sensor: 39412, psi: 105, temp: 95 },
        { posicion: 2, sensor: 39412, psi: 105, temp: 95 },
        { posicion: 3, sensor: 39412, psi: 105, temp: 95 },
        { posicion: 4, sensor: 39412, psi: 105, temp: 95 },
        { posicion: 5, sensor: 39412, psi: 105, temp: 95 },
        { posicion: 6, sensor: 39412, psi: 105, temp: 95 },
    ]

    // Tipar los neumáticos correctamente
    const neumaticos: NeumaticoInt[] = Neumaticos.filter((neumatico: NeumaticoInt) => neumatico.Codigo_Camion === id);

    return (
        <div className="p-4 h-full w-full mb-4 rounded-md bg-white text-white dark:bg-black relative shadow-md font-mono">
            <div className="text-black dark:text-white flex flex-col">
                {/* Info del camión */}
                <div className="md:flex justify-between mb-2">
                    <h2 className="text-2xl font-bold mb-2">
                        Camión {id} - Faena {camion?.Faena}
                    </h2>
                    <div className="flex md:flex-col gap-y-1 justify-between w-[100%] md:w-[40%] items-end gap-x-4">
                        <button disabled={id === undefined} onClick={() => setIsSensorActive(!isSensorActive)} className="text-black text-lg w-52 text-center flex justify-center gap-x-4 items-center bg-amber-300 p-2 rounded-md border border-black">
                            {
                                isSensorActive
                                    ? <FaCircleDot className="text-2xl text-black " />
                                    : <FaPodcast className="text-2xl text-black " />
                            }
                            {
                                isSensorActive ? "Neumaticos" : "Sensores"
                            }
                        </button>
                        {
                            id !== undefined ? (
                                <Link href={`/mantenimiento/${id}`} className="text-black text-lg w-52 text-center bg-amber-300 p-2 rounded-md border border-black">Mantenimiento</Link>
                            ) : (
                                <div className="text-black text-lg w-52 text-center bg-amber-300 p-2 rounded-md border border-black">-------</div>
                            )
                        }

                    </div>
                </div>
                {/* Seccion de informacion */}
                <div className="block md:flex ">
                    {/* Esquema de neumaticos*/}
                    <section className="min-w-[35%]   p-2 flex justify-center items-center">
                        <Image src="/Axle_gray.png" className="drop-shadow-xl" alt="Esquema" width={300} height={200} />
                    </section>

                    {/* Lista de neumaticos */}
                    <div className="w-full md:w-[65%] h-full">
                        <h2 className="text-2xl font-bold text-black dark:text-white">Neumáticos</h2>
                        <div className="relative overflow-x-auto md:h-[80%] my-2">
                            <div className="flex flex-col gap-y-2">
                                {/* Table head */}
                                <div className="w-full border-b-[1px] border-b-gray-300 dark:border-b-gray-600 shadow-sm bg-slate-300 dark:bg-[#212121] rounded-md p-2 h-12 transition-all flex items-center justify-between ">
                                    <div className="flex flex-col w-[20%]">
                                        <p className="font-semibold font-mono">Codigo</p>
                                    </div>
                                    <div>
                                        <p className=" font-mono font-semibold">Mediciones</p>
                                    </div>
                                    <div>
                                        <p className=" font-mono font-semibold">
                                            {
                                                isSensorActive ? "Posicion" : "Metas"
                                            }
                                        </p>
                                    </div>
                                    <div className="flex font-mono font-semibold justify-center items-center">
                                        <p>Acciones</p>
                                    </div>
                                </div>
                                {
                                    id === undefined && Array.from({ length: 6 }).map((_, index) => (
                                        <div key={index} className="w-full border-b-[1px] hover:bg-amber-100 h-32 md:h-20 transition-all flex items-center justify-between ease-in-out border-b-amber-300 p-2">
                                            <div className="flex flex-col gap-y-1 w-[20%]">
                                                <div className="bg-slate-200  p-2 rounded-md"></div>
                                                <div className="bg-slate-200 p-2 rounded-md"></div>
                                            </div>
                                            <div className="flex flex-col gap-y-1 w-[20%]">
                                                <div className="bg-slate-200  p-2 rounded-md"></div>
                                                <div className="bg-slate-200 p-2 rounded-md"></div>
                                            </div>
                                            <div className="flex flex-col gap-y-1 w-[20%]">
                                                <div className="bg-slate-200  p-2 rounded-md"></div>
                                                <div className="bg-slate-200 p-2 rounded-md"></div>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <div className="bg-slate-200 p-2 rounded-full "></div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    isSensorActive ? (
                                        sensores.map((sensor) => (
                                            <div key={sensor.posicion} className="w-full border-b-[1px] hover:bg-amber-100 h-32 md:h-20 transition-all flex items-center justify-between ease-in-out border-b-amber-300 p-2">
                                                <div className="flex flex-col w-[20%] ">

                                                    <p>{sensor.sensor}</p>
                                                </div>
                                                <div>
                                                    <p>PSI: {sensor.psi}</p>
                                                    <p>Temp °C: {sensor.temp}</p>
                                                </div>
                                                <p>Posicion: {sensor.posicion}</p>
                                                <div className="flex justify-center items-center">
                                                    <Link href={`/mantenimiento/Historial`} className="flex justify-between items-center h-12 w-12 text-lg">
                                                        <FaClock size={20} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        neumaticos.map((neumatico: NeumaticoInt) => (
                                            <div key={neumatico.Codigo} className="w-full border-b-[1px] hover:bg-amber-100 h-32 md:h-20 transition-all flex items-center justify-between ease-in-out border-b-amber-300 p-2">
                                                <div className="flex flex-col w-[20%]">
                                                    <p>{neumatico.Codigo}</p>
                                                    <p><small className="">Pos:</small> {neumatico.Posicion}</p>
                                                </div>
                                                <div>
                                                    <p>Interna: {neumatico.Profundidad}</p>
                                                    <p>Externa: {neumatico.Profundidad}</p>
                                                </div>
                                                <div>
                                                    <p>Hr: {neumatico.META_HORAS}</p>
                                                    <p>Km: {neumatico.META_KMS}</p>
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    <Link href={`/mantenimiento/Historial`} className="flex justify-between items-center h-12 w-12 text-lg">
                                                        <FaClock size={20} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
