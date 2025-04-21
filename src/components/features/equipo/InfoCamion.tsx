"use client";
import { Camiones } from "@/mocks/Camiones.json";
import { Neumaticos } from "@/mocks/neumaticos.json";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

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
    const id = params.id;

    const camion = Camiones.find(camion => camion.Codigo === id);

    // Tipar los neumáticos correctamente
    const neumaticos: NeumaticoInt[] = Neumaticos.filter(
        (neumatico: NeumaticoInt) => neumatico.Codigo_Camion === id
    );

    return (
        <div className="p-2 h-[100%] w-full bg-white dark:bg-black relative shadow-md font-mono">
            <div className="text-black dark:text-white flex flex-col">
                {/* Info del camión */}

                {/* Seccion de informacion */}
                <div className="flex flex-col justify-center items-center">
                    {/* Esquema de neumaticos*/}
                    <div className="flex h-[30vh] justify-between w-full">
                        {/* Info del camión */}
                        <section className="flex flex-col w-[60%] pt-5 items-start mb-2 ">
                            <h2 className="text-2xl font-bold mb-2">
                                Equipo {id} - Faena {camion?.Faena}
                            </h2>

                            {/* Info del camión */}
                            <div className="flex flex-col pt-4 bg-gray-200 rounded-md p-2 w-[100%] h-[50%] mb-2">
                                <p>
                                    <span className="font-bold">Marca:</span> {camion?.Marca}
                                </p>
                            </div>
                            {/* Boton para cambiar entre neumaticos y sensores */}
                            <div className="flex gap-y-1 justify-between w-[100%]  gap-x-4">
                                {/* Boton para acceder a la pagina de mantenimiento */}

                                <Link
                                    href={`/mantenimiento/${id}`}
                                    className={`text-lg w-52 text-center p-2 rounded-md border border-black flex justify-center items-center gap-2 ${
                                        id
                                            ? "text-black bg-amber-300 hover:bg-amber-400 cursor-pointer"
                                            : "text-gray-400 bg-gray-200 cursor-not-allowed"
                                    }`}
                                    onClick={e => {
                                        if (!id) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <FaCirclePlus size={20} />
                                    Mantenimiento
                                </Link>
                            </div>
                        </section>
                        {/* Diagrama de neumaticos */}
                        <section className="min-w-[20%] rotate-90 p-2 flex justify-center items-center ">
                            <Image
                                src="/Axle_gray.png"
                                className="drop-shadow-xl"
                                alt="Esquema"
                                width={200}
                                height={150}
                            />
                        </section>
                    </div>

                    {/* Lista de neumaticos */}
                    <div className="w-[100%] h-full">
                        {/* Tabla de neumaticos */}
                        <section className="relative overflow-x-auto lg:h-[80%] my-2">
                            <div className="flex flex-col gap-y-2">
                                {/* Table head */}
                                <table className="w-full table-auto">
                                    <thead className="bg-amber-300 rounded-md">
                                        <tr>
                                            <th className="p-2 w-[5%]">Pos</th>
                                            <th className="p-2 w-[20%]">Codigo</th>
                                            <th className="p-2 w-[15%]">
                                                <p className="hidden lg:block">Profundidad</p>
                                                <p className="block lg:hidden">Rem</p>
                                            </th>
                                            <th className="p-2 w-[15%]">Meta </th>
                                            <th className="p-2 w-[15%]">Sensor</th>
                                            <th className="p-2 w-[15%]">
                                                <p className="hidden lg:block">Historial</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto ">
                                        {neumaticos.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center p-4">
                                                    No hay neumáticos disponibles
                                                </td>
                                            </tr>
                                        )}

                                        {neumaticos.map(neumatico => (
                                            <tr
                                                key={neumatico.Codigo}
                                                className="bg-gray-50 border-b border-b-amber-200 dark:bg-[#212121] hover:bg-gray-100 h-16 text-center dark:hover:bg-gray-700 transition-all ease-in-out  rounded-md "
                                            >
                                                <td className="w-[5%]">{neumatico.Posicion}</td>
                                                <td className="w-[20%]">{neumatico.Codigo}</td>
                                                <td>
                                                    <div>
                                                        <p>Int: {neumatico.Profundidad}</p>
                                                        <p>Ext: {neumatico.Profundidad}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{neumatico.META_HORAS}</p>
                                                    <p>{neumatico.META_KMS}</p>
                                                </td>
                                                <td>
                                                    <p>PSI: 105</p>
                                                    <p>Temp: 95</p>
                                                </td>
                                                <td className="flex justify-center mt-5 items-center">
                                                    <Link href={`/mantenimiento/Historial`}>
                                                        <FaClock size={20} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
