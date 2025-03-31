import * as React from 'react';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import { FaClock } from 'react-icons/fa';
import { PiTireBold } from 'react-icons/pi';
import { programa_mantenimiento } from "@/mocks/programa.json";
import Image from 'next/image';
import { GiFlatTire, GiMineTruck } from 'react-icons/gi';
import Link from 'next/link';

export default function Page() {

    return (
        <div className="flex flex-col  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-black text-center w-full mx-auto font-mono p-3">
            <main className='w-[100%] rounded-md mx-auto p-4 h-[95%] '>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-11 gap-4">
                    <div className="  shadow-md rounded-md py-3 col-span-2 row-span-2 flex items-center justify-center flex-col bg-amber-300">
                        <h1 className='text-3xl font-bold font-mono'>Sistema de Reportabilidad NeumaDiesel</h1>
                        <Image src="/logo.svg" alt="Logo" width={500} height={100} />
                    </div>
                    <Link href={"/maquinaria"} className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-3 flex flex-col justify-center items-center px-2">
                        <GiMineTruck size={75} className=" text-blue-500" />
                        <p className='font-semibold'>Flota Operativa</p>
                        <p className='text-3xl font-bold'>48</p>
                        <small>
                            Presione <span className='text-amber-600 font-semibold p-2'>aqui</span>  para ver mas detalles
                        </small>
                    </Link>
                    {/* mantenciones programadas */}
                    <div className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-4 flex flex-col justify-center items-center px-2">
                        <GiFlatTire size={75} className=" text-blue-500" />
                        <p className='font-semibold'>Mantenciones Programadas</p>
                        <p className='text-3xl font-bold'>12</p>
                        <small>
                            Presione <span className='text-amber-600 font-semibold p-2'>aqui</span>  para ver mas detalles
                        </small>
                    </div>
                    {/* Neumaticos en operacion */}
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3 flex">
                        <div className='w-[80%] flex flex-col justify-start'>

                            <p className='font-semibold'>Neumaticos Operativos</p>
                            <p>258</p>
                            <small><span className='text-amber-600 font-semibold p-2'>4.7%</span> Requieren revision manual</small>
                        </div>
                        <div className='flex justify-center items-center'>
                            <PiTireBold className="text-4xl text-blue-500" />
                        </div>
                    </div>
                    {/* Horas trabajadas de los neumaticos */}
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3 flex">
                        <div className='w-[80%] flex flex-col justify-start'>

                            <p className='font-semibold'>Horas registradas</p>
                            <p>12.304</p>
                            <small><span className='text-blue-600 font-semibold'>7.5%</span> mas que la semana anterior</small>
                        </div>
                        <div className='flex justify-center items-center'>
                            <FaClock className="text-4xl text-amber-400" />
                        </div>
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3 flex flex-col justify-center items-center ">
                        <p>Casilla disponible</p>
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3 flex flex-col justify-center items-center ">
                        <p>Casilla disponible</p>
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2  row-span-3 row-start-4">
                        <PieChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2 row-span-3 row-start-4">
                        <BarChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-3 row-span-2 row-start-7">programa semanal primeras filas</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-4 row-start-7">13</div>
                    <div className=" bg-amber-300 shadow-md rounded-md py-3 col-span-4 row-span-3 row-start-9">
                        <h3 className='font-semibold text-lg'>Programa semanal</h3>
                        <table className="w-full">
                            <thead className='h-12' >
                                <tr>
                                    <th>Neumatico</th>
                                    <th>Fecha</th>
                                    <th className='text-start'>Motivo</th>
                                    <th>Horas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programa_mantenimiento.slice(0, 7).map((item, index) => (
                                    <tr key={index} className='border-b bg-white border-b-slate-200 h-12'>
                                        <td>{item.equipo}</td>
                                        <td>{item.fecha}</td>
                                        <td className='text-start'>{item.motivo}</td>
                                        <td>{item.duracion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            </main>
        </div>
    );
}