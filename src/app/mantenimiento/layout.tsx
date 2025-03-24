import Link from "next/link";


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
            <aside className="h-screen bg-[#313131] py-10 w-[20%] max-w-[250px]" >
                <nav>
                    <ul className="flex flex-col gap-y-4 items-center">
                        {links.map((link) => (
                            <li key={link.href} className="p-2 w-[90%] text-lg text-white  hover:bg-[#515151] transition-all ease-in-out rounded-sm">
                                <Link href={link.href}>
                                    <p className="">{link.label}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className="w-[100%] h-screen bg-[#f1f1f1]">
                {children}

            </div>
        </div>
    )
}