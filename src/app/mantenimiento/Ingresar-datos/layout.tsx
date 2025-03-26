
import Link from "next/link";
import { Suspense } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import FormSkeleton from "./loading";
export default function LayoutIngresarDatos({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const links = [
        {
            title: 'Crear Neumatico Nuevo',
            href: '/mantenimiento/Ingresar-datos/',
        },
        {
            title: 'Crear Modelo Neumatico',
            href: '/mantenimiento/Ingresar-datos/crear-modelo',
        },
        {
            title: 'Registrar Maquinaria',
            href: '/mantenimiento/Ingresar-datos/crear-maquinaria',
        },
        {
            title: 'Programar Mantenimiento',
            href: '/mantenimiento/Ingresar-datos/programar-mantenimiento',
        },
    ]

    return (
        <div className="bg-white h-[95%] flex  m-4 rounded-md shadow-xl">
            <aside className="bg-amber-100 h-[100%] shadow-sm w-[30vh] mr-4 pt-6">
                <Link href={"/mantenimiento/Ingresar-datos/"} className="font-mono p-3 font-bold text-xl">Ingresar Datos</Link>
                <div className="flex  flex-col justify-around items-center h-[40%] gap-y-3 mt-5">

                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="flex justify-between p-2 h-16 w-[100%] gap-x-2 items-center hover:bg-amber-300 ase-in-out transition-all">
                            <FaClipboardCheck className="text-3xl text-black" />
                            <p className="text-md font-bold font-mono ">{link.title}</p>
                        </Link>
                    ))}

                </div>
            </aside>
            <Suspense fallback={<FormSkeleton />} >
                <div className="p-3">

                    {children}
                </div>
            </Suspense>
        </div>
    )
}