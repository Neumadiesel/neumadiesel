'use client'
import React from 'react';
import Image from 'next/image';
import { FaAngleDown, FaAngleUp, FaRegUserCircle } from "react-icons/fa";
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

    const menuItems = [
        {
            title: 'Reportabilidad',
            path: '/estadisticas',
        },
        {
            title: 'Maquinaria',
            path: '/maquinaria'
        },
        {
            title: 'Neumáticos',
            children: [
                { title: 'Operación', path: '/neumaticos/' },
                { title: 'Bodega', path: '/neumaticos/bodega' },
            ],
        },
        {
            title: 'Administración',
            children: [
                { title: 'Usuarios', path: '/admin/users' },
                { title: 'Roles', path: '/admin/roles' },
            ],
        },
        {
            title: 'Mantenimiento',
            children: [
                { title: 'Ingresar datos', path: '/mantenimiento/Ingresar-datos' },
                { title: 'Historial', path: '/mantenimiento/Historial' },
                { title: 'Aros de camion', path: '/mantenimiento/aros-camion' },
                { title: 'Sensores', path: '/mantenimiento/sensores' },
                { title: 'Progama', path: '/mantenimiento/programas' },
            ],
        },
    ]

    const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});

    const toggleCategory = (title: string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <div className="flex flex-col gap-y-4 items-center h-screen bg-[#212121] text-white  shadow-sm font-mono pt-5 overflow-y-hidden">
            <div className='w-[90%]'>
                <Link href="/">
                    <Image src="/logo-light.svg" alt="logo" width={250} height={180} />
                </Link>
            </div>
            <div className=' h-[90%] hidden md:flex md:flex-col w-[100%] '>
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            {item.children ? (
                                <div>
                                    <button
                                        className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded"
                                        onClick={() => toggleCategory(item.title)}
                                    >
                                        <span>{item.title}</span>
                                        {openCategories[item.title] ? (
                                            <FaAngleDown size={16} />
                                        ) : (
                                            <FaAngleUp size={16} />
                                        )}
                                    </button>
                                    {openCategories[item.title] && (
                                        <ul className="ml-4 mt-1">
                                            {item.children.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={subItem.path}
                                                        className="block p-2 hover:bg-gray-700 rounded"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="block p-2 hover:bg-gray-700 rounded"
                                >
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='w-[100%] p-3'>
                <Link href="/usuario" className='flex items-center justify-around'>
                    <FaRegUserCircle size={40} />
                    <p>Cerrar sesion</p>
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
