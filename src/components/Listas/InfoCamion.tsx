'use client'
import Link from "next/link"
import Image from "next/image"
import { Camiones } from "@/mocks/Camiones.json"
import { Neumaticos } from "@/mocks/neumaticos.json"
import { useParams } from "next/navigation"
import CardNeumatico from "../ui/CardNeumatico"

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
        <div className="p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            <div className="text-black flex flex-col">
                {/* Info del camión */}
                <div className="flex justify-between mb-2">
                    <h2 className="text-2xl font-bold text-black">
                        Camión {id} {camion?.Marca} {camion?.Modelo} - Faena {camion?.Faena}
                    </h2>
                    <div className="flex justify-between items-center gap-x-4">
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 p-2 rounded-md border border-black">Historial</Link>
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 p-2 rounded-md border border-black">Realizar Mantención</Link>
                    </div>
                </div>

                {/* Sección superior */}
                <section className="h-[40%] w-full flex">
                    {/* Foto referencial */}
                    <Image src="/caex.webp" className="mr-4" height={300} width={400} alt="Camión" objectFit="cover" />

                    {/* Esquema de neumáticos */}
                    <div className="w-[70%] flex justify-center items-center">
                        <section className="grid grid-cols-5 gap-y-4 gap-x-2">
                            <div className="w-[50px] h-[100px]"></div>
                            <CardNeumatico neumatico={neumaticos[0]} />
                            <div className="w-[50px] h-[100px]"></div>
                            <CardNeumatico neumatico={neumaticos[1]} />
                            <div className="w-[50px] h-[100px]"></div>
                            <CardNeumatico neumatico={neumaticos[2]} />
                            <CardNeumatico neumatico={neumaticos[3]} />
                            <div className="w-[50px] h-[100px]"></div>
                            <CardNeumatico neumatico={neumaticos[4]} />
                            <CardNeumatico neumatico={neumaticos[5]} />
                        </section>
                    </div>
                </section>

                {/* Info del neumático */}
                <h2 className="text-2xl font-bold text-black">Neumáticos</h2>
                <div className="relative overflow-x-auto h-[80%] my-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md rounded-t-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Código</th>
                                <th className="px-4 py-2">Camión</th>
                                <th className="px-4 py-2">Horas Utilizadas</th>
                                <th className="px-4 py-2">Km Utilizados</th>
                                <th className="px-4 py-2">Posición</th>
                                <th className="px-4 py-2">Medición Externa</th>
                                <th className="px-4 py-2">Medición Interna</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {neumaticos.map((neumatico: NeumaticoInt) => (
                                <tr key={neumatico.Codigo}>
                                    <td className="border px-4 py-2">{neumatico.Codigo}</td>
                                    <td className="border px-4 py-2">{neumatico.Codigo_Camion}</td>
                                    <td className="border px-4 py-2">{neumatico.META_HORAS}</td>
                                    <td className="border px-4 py-2">{neumatico.META_KMS}</td>
                                    <td className="border px-4 py-2">{neumatico.Posicion}</td>
                                    <td className="border px-4 py-2">{neumatico.Profundidad}</td>
                                    <td className="border px-4 py-2">{neumatico.Profundidad}</td>
                                    <td className="border px-4 py-2">
                                        <Link href={`/neumaticos/${neumatico.Codigo}`} className="text-black text-lg"> Info. Detallada</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
