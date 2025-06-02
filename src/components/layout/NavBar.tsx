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
    FaAngleDoubleRight,
    FaAngleDoubleLeft,
    FaWpforms,
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { FaCircleDot } from "react-icons/fa6";
import Cookies from "js-cookie";

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path?: string;
    children?: { title: string; path: string }[];
    allowedRoles?: string[];
}

export default function NavBar() {
    const { user, logout } = useAuth();
    const userData = Cookies.get("user-data");
    const userDataParsed = userData ? JSON.parse(userData) : null;
    const role = userDataParsed?.role;

    const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const hasAccess = (allowedRoles?: string[]) => {
        if (!allowedRoles) return true;
        if (!role?.name) return false;
        return allowedRoles.includes(role.name.toLowerCase());
    };

    const menuItems: MenuItem[] = [
        {
            title: "Reportabilidad",
            icon: <FaChartBar className="text-2xl" />,
            path: "/estadisticas",
            allowedRoles: ["administrador", "planificador", "supervisor", "stakeholder"],
        },
        {
            title: "Equipos",
            icon: <FaTruck className="text-2xl" />,
            path: "/maquinaria",
            allowedRoles: ["administrador", "planificador", "supervisor"],
        },
        {
            title: "Neumáticos",
            icon: <FaCircleDot className="text-2xl" />,
            path: "/neumaticos",
            allowedRoles: ["administrador", "planificador", "supervisor"],
        },
        {
            title: "Administración",
            icon: <FaUsersCog className="text-2xl" />,
            allowedRoles: ["administrador"],
            children: [
                { title: "Usuarios", path: "/administracion/usuarios" },
                { title: "Faena", path: "/administracion/faena" },
                { title: "Razón de desintalacion", path: "/administracion/razon-de-desintalacion" },
            ],
        },
        // modelos,
        {
            title: "Modelos",
            icon: <FaWpforms className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "supervisor"],
            children: [
                { title: "Crear Modelo Neumático", path: "/modelos/modelo-neumatico" },
                { title: "Crear Modelo Equipo", path: "/modelos/modelo-equipo" },
                { title: "Crear Modelo Cadena", path: "/modelos/modelo-cadena" },
                { title: "Crear Modelo Sensor", path: "/modelos/modelo-sensor" },
            ],
        },
        {
            title: "Mantenimiento",
            icon: <FaWrench className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "supervisor"],
            children: [
                { title: "Cadenas", path: "/mantenimiento/cadenas" },
                { title: "Sensores", path: "/mantenimiento/sensores" },
                { title: "Orden de trabajo", path: "/mantenimiento/orden-de-trabajo" },
                { title: "Programa semanal", path: "/mantenimiento/programas" },
            ],
        },
        {
            title: "Mediciones",
            icon: <FaFile className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "supervisor"],
            children: [
                { title: "Mediciones", path: "/medicion/" },
                {
                    title: "Ingresar Medición por Equipo",
                    path: "/medicion/medicion-por-equipo",
                },
            ],
        },
        {
            title: "Ingresar Medición por Equipo",
            icon: <FaFile className="text-2xl" />,
            path: "/medicion/medicion-por-equipo",
            allowedRoles: ["operador"],
        },
    ];

    const filteredMenuItems = menuItems.filter(item => hasAccess(item.allowedRoles));

    const toggleCategory = (title: string) => {
        setOpenCategories(prev => {
            const isCurrentlyOpen = prev[title];
            return isCurrentlyOpen ? {} : { [title]: true };
        });
    };

    if (!user) return null;

    return (
        <div
            className={`flex lg:flex-col gap-y-2 items-center lg:h-screen bg-[#212121] text-neutral-300 shadow-sm font-semibold overflow-y-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "lg:min-w-[80px]" : "lg:min-w-[220px]"}`}
        >
            <div className="w-full flex justify-between items-center bg-amber-300 ">
                <Link href={"/"} className="w-[60%]  p-2">
                    {isCollapsed ? (
                        <Image
                            onClick={() => setMenuOpen(false)}
                            src="/icon.png"
                            alt="logo"
                            width={30}
                            height={30}
                            className="transition-all duration-300"
                        />
                    ) : (
                        <Image
                            onClick={() => setMenuOpen(false)}
                            src="/NEUMASYSTEM.png"
                            alt="logo"
                            width={240}
                            height={180}
                            className="transition-all duration-300"
                        />
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-2 text-black hover:bg-amber-400 rounded"
                >
                    {isCollapsed ? (
                        <FaAngleDoubleRight size={20} />
                    ) : (
                        <FaAngleDoubleLeft size={20} />
                    )}
                </button>
            </div>

            <div
                className={`hidden h-[90%] p-2 lg:flex lg:flex-col w-[100%] ${isCollapsed ? "items-center" : ""
                    }`}
            >
                <ul className="w-full">
                    <li className="mb-2">
                        <div
                            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-end"
                                }`}
                        >

                        </div>
                        <Link
                            href={"/perfil"}
                            className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
                        >
                            <FaRegUserCircle className="text-3xl" />
                            {(!isCollapsed) && (
                                <span>
                                    {user?.name} {user?.last_name}
                                </span>
                            )}
                        </Link>
                    </li>
                    {filteredMenuItems.map((item, index) => (
                        <li key={index} className="mb-1">
                            {item.children ? (
                                <div>
                                    <button
                                        className={`flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded`}
                                        onClick={() => toggleCategory(item.title)}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            {item.icon}
                                            {(!isCollapsed) && (
                                                <span>{item.title}</span>
                                            )}
                                        </div>
                                        {(!isCollapsed) &&
                                            (openCategories[item.title] ? (
                                                <FaAngleUp size={16} />
                                            ) : (
                                                <FaAngleDown size={16} />
                                            ))}
                                    </button>
                                    {openCategories[item.title] && (!isCollapsed) && (
                                        <ul
                                            className={`ml-4 mt-1 overflow-hidden text-sm transition-all duration-300 ease-in-out ${openCategories[item.title]
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
                                    href={item.path || ""}
                                    className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded"
                                >
                                    {item.icon}
                                    {(!isCollapsed) && <span>{item.title}</span>}
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
                    {(!isCollapsed) && (
                        <p className="hidden lg:block">
                            {user ? "Cerrar sesión" : "Iniciar sesion"}
                        </p>
                    )}
                </Link>
            </div>

            <div className="lg:hidden flex items-center">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white focus:outline-none"
                >
                    <FaBars size={30} />
                </button>
            </div>

            {menuOpen && (
                <div className="absolute w-[100%] h-[100%] top-16 left-0 bg-[#212121] text-white flex flex-col items-center z-50 lg:hidden">
                    <ul className="h-[50%] w-[80%]">
                        {filteredMenuItems.map((item, index) => (
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
                                        href={item.path || ""}
                                        onClick={() => setMenuOpen(false)}
                                        className="block p-2 text-2xl hover:bg-gray-700 rounded"
                                    >
                                        <p onClick={() => setMenuOpen(false)}>{item.title}</p>
                                    </Link>
                                )}
                            </li>

                        ))}
                    </ul>
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
                            {(!isCollapsed) && (
                                <p className="hidden lg:block">
                                    {user ? "Cerrar sesión" : "Iniciar sesion"}
                                </p>
                            )}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
