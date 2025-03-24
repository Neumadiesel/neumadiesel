import Link from "next/link";
import { FaTractor } from "react-icons/fa";

export default function LayoutMantencion({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const links = [
        {
            href: "/mantenimiento/Ingresar-datos",
            label: "Ingresar datos",
        },
        {
            href: "/mantenimiento/Historial",
            label: "Historial",
        },
        {
            href: "/mantenimiento/llantas-camion",
            label: "Llantas de Camion",
        },
        {
            href: "/mantenimiento/programas",
            label: "Programas",
        },
    ];

    return (
        <div className="flex">
            {/* SideBar */}
            <aside className="h-screen bg-white py-10 w-[20%] max-w-[250px] border-r-4 border-r-white shadow-2xl " >
                <nav>
                    <ul className="flex flex-col gap-y-4 items-center">
                        {links.map((link) => (
                            <li key={link.href} className="p-2 w-[95%] text-lg bg-[#212121] text-white rounded-full hover:bg-[#515151] transition-all ease-in-out ">
                                <Link className="flex items-center gap-x-4 px-3" href={link.href}>
                                    <FaTractor className="text-2xl text-amber-300" />
                                    <p className="">{link.label}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            {/* Contenido */}
            <div className="w-[100%] h-screen bg-[#f1f1f1]">
                {children}

            </div>
        </div>
    )
}