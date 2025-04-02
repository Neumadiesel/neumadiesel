'use client'
import React, { useState } from 'react';
import Link from "next/link";
import { Suspense } from "react";
import { FaBars, FaClipboardCheck } from "react-icons/fa";
import FormSkeleton from "./loading";
export default function LayoutIngresarDatos({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const links = [
        {
            title: 'Ingresar Mediciones',
            href: '/mantenimiento/Ingresar-datos/',
        },
        {
            title: 'Crear Neumatico Nuevo',
            href: '/mantenimiento/Ingresar-datos/crear-neumatico',
        },
        {
            title: 'Crear Modelo Neumatico',
            href: '/mantenimiento/Ingresar-datos/crear-modelo',
        },
        {
            title: 'Registrar Maquinaria',
            href: '/mantenimiento/Ingresar-datos/crear-maquinaria',
        },
    ]

    const [menuOpen, setMenuOpen] = useState(false);



    return (
        <div className="bg-white dark:bg-[#212121] h-screen md:h-[95%] block md:flex  md:m-4 rounded-md shadow-xl">
            {/* Navegacion latearl */}
            <aside className="bg-amber-300 md:bg-amber-100 dark:bg-amber-300 text-black h-[10%] md:h-[100%] shadow-sm w-[100%] md:w-[30vh] mr-4 pt-1 md:pt-6">
                {/* Vista desde escritorio */}
                <Link href={"/mantenimiento/Ingresar-datos/"} className="hidden md:block font-mono p-3 font-bold text-lg">Ingresar Datos</Link>
                <div className="hidden md:flex  flex-col justify-around items-center h-[40%] gap-y-3 mt-5">

                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="flex justify-between p-2 h-16 w-[100%] gap-x-2 items-center hover:bg-amber-300 ase-in-out transition-all">
                            <FaClipboardCheck className="text-3xl text-black" />
                            <p className="text-md font-bold font-mono ">{link.title}</p>
                        </Link>
                    ))}

                </div>
                {/* quiero un selector con los links que contenga los links para redirigirme a sus distintas paginas */}
                <div className='h-[100%]'>
                    <button onClick={() => setMenuOpen(!menuOpen)} className={` text-black gap-x-4 focus:outline-none flex justify-center items-center h-[100%] w-[100%]`}>
                        <p className="text-2xl font-bold">Menu de navegacion</p>
                        <FaBars className="text-3xl" />
                    </button>
                </div>
                {menuOpen && (
                    <div className='absolute w-[100%] h-[100%] top-24 left-0 bg-amber-300 text-black text-2xl font-bold flex flex-col items-center pt-20 z-50 md:hidden'>
                        <ul>
                            {links.map((item, index) => (
                                <li key={index} className="mb-2">
                                    <Link
                                        onClick={() => setMenuOpen(false)}
                                        href={item.href}
                                        className="block p-2 hover:bg-amber-400 rounded"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                            <li className="mb-2">
                                <button onClick={() => setMenuOpen(false)} className=" w-[100%] text-start p-2 hover:bg-amber-400 rounded">
                                    Cerrar menu
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </aside>
            <Suspense fallback={<FormSkeleton />} >
                <div className="p-3">

                    {children}
                </div>
            </Suspense>
        </div>
    )
}