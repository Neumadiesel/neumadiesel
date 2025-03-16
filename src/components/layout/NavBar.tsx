'use client'
import React from 'react';
import Image from 'next/image';
import { FaRegUserCircle } from "react-icons/fa";
import Link from 'next/link';


export default function NavBar() {

    const links = [
        {
            name: 'Neumáticos',
            url: '/neumaticos'
        },
        {
            name: 'Maquinaria',
            url: '/maquinaria'
        },
        {
            name: 'Mantenimiento',
            url: '/mantenimiento'
        },
        {
            name: 'Estadisticas',
            url: '/estadisticas'
        }
    ];

    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="flex justify-between items-center h-24 bg-[#212121] text-white  shadow-sm font-mono px-10 overflow-y-hidden">
            <div className='w-[60%] md:w-[20%]'>
                <Link href="/">
                    <Image src="/logo-light.svg" alt="logo" width={250} height={180} />
                </Link>
            </div>
            <div className='w-[60%] hidden md:flex justify-around items-center'>
                {links.map((link, index) => (
                    <Link href={link.url} key={index}>
                        <p>{link.name}</p>
                    </Link>
                ))}
            </div>
            <div className='w-[20%] flex justify-center'>
                <Link href="/usuario">
                    <FaRegUserCircle size={40} />
                </Link>
            </div>
            <div className='md:hidden flex items-center'>
                <button onClick={() => setMenuOpen(!menuOpen)} className={` text-white focus:outline-none`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
            {menuOpen && (
                <div className='absolute w-full h-72 top-24 left-0 bg-[#212121] text-white flex flex-col items-center z-50 md:hidden'>
                    {links.map((link, index) => (
                        <Link href={link.url} key={index}>
                            <p className='py-2' onClick={() => setMenuOpen(false)}>{link.name}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>

    );
};
