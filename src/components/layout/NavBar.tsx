"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import {
    FaAngleDown,
    FaAngleUp,
    FaBars,
    FaChartBar,
    FaFile,
    FaRegUserCircle,
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
import { FileText, Mountain, QrCode } from "lucide-react";
import MineTruck from "../common/icons/MineTruck";
import QRModal from "./ModalQR/QRModal";
import { useAuthFetch } from "@/utils/AuthFetch";

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path?: string;
    children?: { title: string; path: string }[];
    allowedRoles?: string[];
}

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}


export default function NavBar() {
    const { user, logout, siteId, setSiteId } = useAuth();
    const userData = Cookies.get("user-data");
    const userDataParsed = userData ? JSON.parse(userData) : null;
    const role = userDataParsed?.role;

    const [showQRModal, setShowQRModal] = React.useState(false);

    const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const authFetch = useAuthFetch();
    const [faenas, setFaenas] = React.useState<FaenaDTO[]>([]);

    const hasAccess = (allowedRoles?: string[]) => {
        if (!allowedRoles) return true;
        if (!role?.name) return false;
        return allowedRoles.includes(role.name.toLowerCase());
    };

    const fetchFaenas = async () => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/with-contract`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            if (Array.isArray(data)) {
                setFaenas(data);
            } else {
                setFaenas([]); // O setear un valor seguro por defecto
                console.warn('La respuesta no es un array válido:', data);
            }
        } catch (error) {
            console.error("Error fetching reasons:", error);
            setFaenas([]);
        }
    };

    useEffect(() => {
        if (user?.faena_id === 99) {
            fetchFaenas();
        }
    }, [user]);


    const menuItems: MenuItem[] = [

        {
            title: "Administración",
            icon: <FaUsersCog className="text-2xl" />,
            allowedRoles: ["administrador"],
            children: [
                { title: "Usuarios", path: "/administracion/usuarios" },
                { title: "Faena", path: "/administracion/faena" },
                { title: "Razón de Baja", path: "/administracion/razon-de-baja" },
            ],
        },
        {
            title: "Faena",
            icon: <Mountain className="text-2xl" />,
            path: "/faena",
            allowedRoles: ["planificador"],
        },
        {
            title: "Resumen",
            icon: <FileText className="text-2xl" />,
            path: "/resumen",
            allowedRoles: ["administrador", "planificador", "demo", "supervisor", "stakeholder"],
        },
        {
            title: "Reportabilidad",
            icon: <FaChartBar className="text-2xl" />,
            path: "/estadisticas",
            allowedRoles: ["administrador", "planificador", "demo", "supervisor", "stakeholder"],
        },
        // modelos,
        {
            title: "Modelos",
            icon: <FaWpforms className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "demo"],
            children: [
                { title: "Crear Modelo Equipo", path: "/modelos/modelo-equipo" },
                { title: "Crear Modelo Neumático", path: "/modelos/modelo-neumatico" },
                // { title: "Crear Modelo Cadena", path: "/modelos/modelo-cadena" },
                // { title: "Crear Modelo Sensor", path: "/modelos/modelo-sensor" },
            ],
        },
        {
            title: "Equipos",
            icon: <MineTruck className="w-6" />,
            path: "/maquinaria",
            allowedRoles: ["administrador", "planificador", "demo", "supervisor"],
        },
        {
            title: "Neumáticos",
            icon: <FaCircleDot className="text-2xl" />,
            path: "/neumaticos",
            allowedRoles: ["administrador", "planificador", "demo", "supervisor"],
        },
        {
            title: "Mantenimiento",
            icon: <FaWrench className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "demo"],
            children: [
                // { title: "Cadenas", path: "/mantenimiento/cadenas" },
                // { title: "Sensores", path: "/mantenimiento/sensores" },
                { title: "Orden de trabajo", path: "/mantenimiento/orden-de-trabajo" },
                { title: "Crear Orden", path: "/mantenimiento/orden-de-trabajo/crear-orden" },
                { title: "Programa semanal", path: "/mantenimiento/programas" },
            ],
        },
        {
            title: "Mantenimiento",
            icon: <FaWrench className="text-2xl" />,
            allowedRoles: ["supervisor"],
            children: [
                { title: "Programa semanal", path: "/mantenimiento/programas" },
            ],
        },
        {
            title: "Ingresar Medición por Equipo",
            icon: <FaFile className="text-2xl" />,
            path: "/inspeccion/inspeccion-por-equipo",
            allowedRoles: ["operador"],
        },
        {
            title: "Inspección",
            icon: <FaFile className="text-2xl" />,
            allowedRoles: ["administrador", "planificador", "demo", "supervisor"],
            children: [
                { title: "Inspecciones", path: "/inspeccion/" },
                // { title: "Equipo", path: "/inspeccion/equipo" },
                {
                    title: "Inspección por Neumático",
                    path: "/inspeccion/inspeccion-por-neumatico",
                },
                {
                    title: "Inspección por Equipo",
                    path: "/inspeccion/inspeccion-por-equipo",
                },
            ],
        },
    ];

    console.log("User in NavBar:", user);

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
                className={`hidden h-[80dvh] p-2 lg:flex lg:flex-col w-[100%] ${isCollapsed ? "items-center" : ""
                    }`}
            >
                <ul className="w-full">

                    <li className="">
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
                    {/* Selector de faena para Admin */}
                    <li >
                        {user.faena_id === 99 && (
                            <div className="flex items-center gap-x-2 p-2 hover:bg-neutral-700 w-full rounded">
                                <select
                                    className={`ml-2 bg-neutral-800 text-white rounded p-1 ${isCollapsed ? "w-full text-center" : "w-auto"
                                        }`}
                                    value={siteId ?? ""}
                                    onChange={(e) => setSiteId(Number(e.target.value))}
                                >
                                    <option value="">Seleccione una faena</option>
                                    {faenas.map((faena) => (
                                        <option key={faena.id} value={faena.id}>
                                            {faena.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </li>

                    {filteredMenuItems.map((item, index) => (
                        <li key={index} >
                            {item.children ? (
                                <div>
                                    <button
                                        className={`flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded`}
                                        onClick={() => {
                                            setIsCollapsed(false)
                                            toggleCategory(item.title)
                                        }}
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
            <div
                className={`hidden h-[5%]  p-2 lg:flex lg:flex-col w-[100%] ${isCollapsed ? "items-center" : ""
                    }`}
            >
                <ul className="w-full">
                    <li className="mb-1">
                        <button
                            onClick={() => setShowQRModal(true)}
                            className="flex items-center gap-x-2 p-2 hover:bg-gray-700 rounded w-full text-lg"
                            type="button"
                        >
                            <QrCode size={32} />
                            {!isCollapsed && <span>
                                Soporte
                            </span>}
                        </button>
                    </li>
                </ul>
            </div>
            {/* Cerrar sesion - cambiar la version para el */}
            <div className="w-[100%] flex gap-2 items-center justify-between p-3 mr-8 lg:mr-0">

                {user && (
                    <Link href={"/perfil"} onClick={() => {

                        setMenuOpen(false);
                    }} className="text-center text-lg lg:hidden hover:bg-neutral-900 transition-all ease-in-out p-2 rounded-md">
                        {user.name} {user.last_name}
                    </Link>
                )}
                <Link
                    href={user ? "#" : "/login"}
                    onClick={e => {
                        if (user) {
                            e.preventDefault();
                            logout();
                        }
                        setMenuOpen(false);
                    }}
                    className="flex items-center justify-around hover:bg-neutral-900  transition-all ease-in-out p-2 rounded-md lg:w-full"
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
                    className="text-white focus:outline-none hover:cursor-pointer p-2 rounded-md hover:bg-gray-900 transition-all ease-in-out"
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

                </div>
            )}
            {showQRModal && (
                <QRModal onClose={() => setShowQRModal(false)} />
            )}
        </div>
    );
}
