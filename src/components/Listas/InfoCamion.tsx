'use client'
import Link from "next/link"
import Image from "next/image"
import { Camiones } from "@/mocks/Camiones.json"
import { Neumaticos } from "@/mocks/neumaticos.json"
import { useParams } from "next/navigation"

export default function ListaMaquinaria() {

    const params = useParams<{ id: string }>();
    const id = params.id

    const camion = Camiones.find(camion => camion.Codigo === id);

    const neumaticos = Neumaticos.filter(neumatico => neumatico.Codigo_Camion === id);



    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            <div className=" text-black flex flex-col">
                {/* Info del camion */}
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-black">Camion {id} {camion?.Marca} {camion?.Modelo} - Faena {camion?.Faena}</h2>
                    <div className="flex justify-between items-center">
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 p-2 rounded-md border border-black">Realizar Mantencion</Link>
                    </div>
                </div>
                <section className="h-[40%] w-full flex ">

                    <Image src="/caex.webp" className="mr-4" height={300} width={400} alt="Camion" objectFit="cover" />

                    {/* Esquema de neumaticos */}
                    <div className="w-[70%] flex justify-center items-center ">
                        <section className="grid grid-cols-5  gap-y-4 gap-x-2">
                            <div className="w-[50px] h-[100px]"></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] relative group rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-4 w-56 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid grid-cols-1 ">
                                    <span className="text-white">Posicion: 3</span>
                                    <span className="text-white">Horas utilizadas: 1500</span>
                                    <span className="text-white">Km utilizados: 3000</span>
                                    <span className="text-white">Medicion interna: 85</span>
                                    <span className="text-white">Mmedicion externa: 85</span>
                                    <span className="text-white">Presion: 115</span>
                                    <span className="text-white">Temperatura: 85</span>





                                </span>
                            </div>


                        </section>
                        {/* <div className="w-[10vh] h-[20vh] rounded-lg bg-emerald-300 relative">
                            
                        </div> */}
                    </div>

                </section>

                {/* Info del neumatico */}
                <h2 className="text-2xl font-bold text-black">Neumáticos</h2>
                <div className="relative overflow-x-auto h-[80%] my-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md rounded-t-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Codigo</th>
                                <th className="px-4 py-2">Camion</th>
                                <th className="px-4 py-2">Horas Utilizadas</th>
                                <th className="px-4 py-2">Km Utilizados</th>
                                <th className="px-4 py-2">Posicion</th>
                                <th className="px-4 py-2">Medicion Externa</th>
                                <th className="px-4 py-2">Medicion Interna</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {neumaticos.map((neumatico) => (
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