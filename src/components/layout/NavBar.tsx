"use client";
import React from "react";
import Image from "next/image";
import {
    FaAngleDown,
    FaAngleUp,
    FaBars,
    FaChartBar,
    FaFile,
    FaRegUserCircle,
    FaTruck,
    FaUsersCog,
    FaWrench,
    FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { FaCircleDot } from "react-icons/fa6";

export default function NavBar() {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: "Reportabilidad",
            icon: <FaChartBar className="text-2xl" />,
            path: "/estadisticas",
        },
        {
            title: "Equipos",
            icon: <FaTruck className="text-2xl" />,
            path: "/maquinaria",
        },
        {
            title: "Neumáticos",
            icon: <FaCircleDot className="text-2xl" />,
            children: [
                { title: "Operación", path: "/neumaticos/" },
                { title: "Bodega", path: "/neumaticos/bodega" },
            ],
        },
        {
            title: "Administración",
            icon: <FaUsersCog className="text-2xl" />,
            children: [
                { title: "Usuarios", path: "/administracion/usuarios" },
                { title: "Roles", path: "/administracion/roles" },
            ],
        },
        {
            title: "Mantenimiento",
            icon: <FaWrench className="text-2xl" />,
            children: [
                { title: "Historial", path: "/mantenimiento/Historial" },
                { title: "Aros de camion", path: "/mantenimiento/aros-camion" },
                {
                    title: "Programar mantenimiento",
                    path: "/mantenimiento/programar-mantenimiento",
                },
                { title: "Progama semanal", path: "/mantenimiento/programas" },
            ],
        },
        {
            title: "Ingresar datos",
            icon: <FaFile className="text-2xl" />,
            children: [
                { title: "Ingresar Mediciones", path: "/Ingresar-datos/" },
                {
                    title: "Ingresar Medición por Equipo",
                    path: "/Ingresar-datos/medicion-por-equipo",
                },
                { title: "Crear Neumatico Nuevo", path: "/Ingresar-datos/crear-neumatico" },
                { title: "Crear Modelo Neumatico", path: "/Ingresar-datos/crear-modelo" },
                { title: "Registrar Maquinaria", path: "/Ingresar-datos/crear-maquinaria" },
            ],
        },
    ];

    const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});

    const toggleCategory = (title: string) => {
        setOpenCategories(prev => {
            const isCurrentlyOpen = prev[title];
            // Si ya está abierta, la cerramos. Si no, cerramos todas y abrimos esta.
            return isCurrentlyOpen ? {} : { [title]: true };
        });
    };

    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        // Recordar volver a colocar hidden en el div de la barra de navegacion
        <div
            className={` ${
                user ? "flex" : "flex"
            } lg:flex-col   gap-y-4 items-center lg:h-screen bg-[#212121] text-neutral-300  shadow-sm font-semibold overflow-y-hidden min-w-[200px] `}
        >
            <Link href={"/"} className="w-[100%] bg-amber-300 p-2">
                <Image
                    onClick={() => setMenuOpen(false)}
                    src="/NEUMASYSTEM.png"
                    alt="logo"
                    width={250}
                    height={180}
                />
            </Link>
            <div className="hidden h-[90%] p-3 lg:flex lg:flex-col w-[100%] ">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            {item.children ? (
                                <div>
                                    <button
                                        className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded"
                                        onClick={() => toggleCategory(item.title)}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </div>
                                        {openCategories[item.title] ? (
                                            <FaAngleUp size={16} />
                                        ) : (
                                            <FaAngleDown size={16} />
                                        )}
                                    </button>
                                    {openCategories[item.title] && (
                                        <ul
                                            className={`ml-4 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                                openCategories[item.title]
                                                    ? "max-h-96 opacity-100"
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
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
                                    className=" flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-[100%] p-3">
                <Link
                    href={user ? "#" : "/login"}
                    onClick={e => {
                        if (user) {
                            e.preventDefault();
                            logout();
                        }
                        setMenuOpen(false);
                    }}
                    className="flex items-center justify-around"
                >
                    {user ? <FaSignOutAlt size={40} /> : <FaRegUserCircle size={40} />}
                    <p className="hidden lg:block">{user ? "Cerrar sesion" : "Iniciar sesion"}</p>
                </Link>
            </div>
            <div className="lg:hidden flex items-center">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={` text-white focus:outline-none`}
                >
                    <FaBars size={30} />
                </button>
            </div>
            {menuOpen && (
                <div className="absolute w-[100%] h-[100%] top-24 left-0 bg-[#212121] text-white flex flex-col items-center z-50 lg:hidden">
                    <ul className="h-[50%] w-[80%]">
                        {menuItems.map((item, index) => (
                            <li key={index} className="mb-2">
                                {item.children ? (
                                    <div>
                                        <button
                                            className="flex items-center justify-between w-full text-2xl p-2 text-left hover:bg-gray-700 rounded"
                                            onClick={() => toggleCategory(item.title)}
                                        >
                                            <span>{item.title}</span>
                                            {openCategories[item.title] ? (
                                                <FaAngleUp size={16} />
                                            ) : (
                                                <FaAngleDown size={16} />
                                            )}
                                        </button>
                                        {openCategories[item.title] && (
                                            <ul className="ml-4 mt-1">
                                                {item.children.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            onClick={() => setMenuOpen(false)}
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
                                        className="block p-2 text-2xl hover:bg-gray-700 rounded"
                                    >
                                        <p onClick={() => setMenuOpen(false)}>{item.title}</p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
