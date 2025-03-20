'use client'
import Link from "next/link"
import Image from "next/image"
import { Camiones } from "@/mocks/Camiones.json"
import { Neumaticos } from "@/mocks/neumaticos.json"
import { useParams } from "next/navigation"
import { FaInfoCircle } from "react-icons/fa"

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

    const camion = Camiones.find(camion => camion.Codigo === id);

    // Tipar los neumáticos correctamente
    const neumaticos: NeumaticoInt[] = Neumaticos.filter((neumatico: NeumaticoInt) => neumatico.Codigo_Camion === id);

    return (
        <div className="p-4 h-screen w-full mb-4 rounded-md bg-white text-white dark:bg-black relative shadow-md font-mono">
            <div className="text-black dark:text-white flex flex-col">
                {/* Info del camión */}
                <div className="flex justify-between mb-2">
                    <h2 className="text-2xl font-bold ">
                        Camión {id} - Faena {camion?.Faena}
                    </h2>
                    <div className="flex flex-col gap-y-1 justify-between w-[40%] items-end gap-x-4">
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 w-52 text-center p-2 rounded-md border border-black">Historial</Link>
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg w-52 text-center bg-amber-300 p-2 rounded-md border border-black">Mantenimiento</Link>
                    </div>
                </div>
                {/* Seccion de informacion */}
                <div className="flex ">
                    {/* Esquema de neumaticos*/}
                    <section className="min-w-[35%]   p-2 flex justify-center items-center">
                        <Image src="/Axle_gray.png" className="drop-shadow-xl" alt="Esquema" width={300} height={200} />
                    </section>
                    {/* <CardNeumatico neumatico={neumaticos[5]} /> */}

                    {/* Lista de neumaticos */}
                    <div className="w-[65%] h-full">
                        <h2 className="text-2xl font-bold text-black dark:text-white">Neumáticos</h2>
                        <div className="relative overflow-x-auto h-[80%] my-2">
                            <div className="flex flex-col gap-y-2">
                                {/* Table head */}
                                <div className="w-full border-b-[1px] border-b-gray-300 dark:border-b-gray-600 shadow-sm bg-slate-300 dark:bg-[#212121] rounded-md p-2 h-12 transition-all flex items-center justify-between ">
                                    <div className="flex flex-col">
                                        <p>Datos del neumatico:</p>
                                    </div>
                                    <div>
                                        <p className=" font-mono font-semibold">Mediciones</p>
                                    </div>
                                    <div>
                                        <p className=" font-mono font-semibold">Metas</p>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <p>Acciones</p>
                                    </div>
                                </div>
                                {neumaticos.map((neumatico: NeumaticoInt) => (
                                    <div key={neumatico.Codigo} className="w-full border-b-[1px] hover:bg-amber-100 h-20 transition-all flex items-center justify-between ease-in-out border-b-amber-300 p-2">
                                        <div className="flex flex-col">
                                            <p>Codigo: {neumatico.Codigo}</p>
                                            <p>Posicion: {neumatico.Posicion}</p>
                                        </div>
                                        <div>
                                            <p>Interna: {neumatico.Profundidad}</p>
                                            <p>Externa: {neumatico.Profundidad}</p>
                                        </div>
                                        <div>
                                            <p>Horas: {neumatico.META_HORAS}</p>
                                            <p>Km: {neumatico.META_KMS}</p>
                                        </div>
                                        <div className="flex justify-center items-center">

                                            <Link href={`/neumaticos/${neumatico.Codigo}`} className="flex justify-center items-center h-12 w-12  text-lg ">
                                                <FaInfoCircle size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
