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
            name: 'Flotas',
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

    return (
        <div className="flex justify-around items-center h-24 bg-[#212121] text-white relative shadow-sm font-mono px-10 overflow-y-hidden">
            <div className='w-[20%] '>
                <Link href="/">
                    <Image src="/logo-light.svg" alt="logo" width={250} height={180} />
                </Link>
            </div>
            <div className='flex justify-around items-center w-[60%]' >
                {links.map((link, index) => (
                    <Link href={link.url} key={index}>
                        <p className='  '>{link.name}</p>
                    </Link>
                ))}
            </div>
            <div className='w-[20%] flex justify-center'>
                <FaRegUserCircle size={40} />
            </div>
        </div>

    );
};
