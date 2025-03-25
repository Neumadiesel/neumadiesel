
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
            title: 'Crear Modelo Neumatico',
            href: '/mantenimiento/Ingresar-datos/crear-modelo',
        },
        {
            title: 'Crear Neumatico Nuevo',
            href: '/mantenimiento/Ingresar-datos/crear-neumatico',
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
        <div className="bg-white h-[90%] flex m-4 p-3 rounded-md shadow-xl">
            <aside className="bg-amber-100 h-[100%] rounded-lg p-3 shadow-sm w-[30vh] mr-4">
                <h1 className="font-mono font-bold text-xl">Ingresar Datos</h1>
                <div className="flex  flex-col justify-around items-center h-[40%] gap-y-3 mt-5">

                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="flex justify-between p-2 h-16 w-[90%] gap-x-2 items-center hover:bg-amber-300 rounded-md ease-in-out transition-all">
                            <FaClipboardCheck className="text-3xl text-black" />
                            <p className="text-md font-bold font-mono ">{link.title}</p>
                        </Link>
                    ))}

                </div>
            </aside>
            <Suspense fallback={<FormSkeleton />} >

                {children}
            </Suspense>
        </div>
    )
}