import Link from "next/link"
import Image from "next/image"
import { GiMineTruck } from "react-icons/gi"
export default function ListaMaquinaria() {
    const id = 1
    const neumaticos = [
        {
            id: 1,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 2000,
            posicion: 1,
            serie: 'XZL49-2000-1'
        },
        {
            id: 2,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 2500,
            posicion: 2,
            serie: 'XZL49-2500-2'
        },
        {
            id: 3,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 3000,
            posicion: 3,
            serie: 'XZL49-3000-3'
        },
        {
            id: 4,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 3500,
            posicion: 4,
            serie: 'XZL49-3500-4'
        },
        {
            id: 5,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 4000,
            posicion: 5,
            serie: 'XZL49-4000-5'
        },
        {
            id: 6,
            marca: 'Michelin',
            modelo: 'XZL',
            aro: 49,
            estado: 'Activo',
            horas: 4500,
            posicion: 6,
            serie: 'XZL49-4500-6'
        }

    ]
    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            <div className=" text-black flex flex-col">
                {/* Info del camion */}
                <div className="h-[40%] w-full flex ">

                    <Image src="/Excam.png" height={300} width={400} alt="Camion" objectFit="cover" />
                    {/* Detalles */}
                    <div className="w-[70%]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-black">Camion 795F RTR324</h2>
                            <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 p-2 rounded-md border border-black">Realizar Mantencion</Link>
                        </div>
                        <div className="grid grid-cols-2 p-4 w-full h-52">
                            <p className="text-lg">Modelo:</p>
                            <p className="text-lg">795F RTR324</p>
                            <p className="text-lg">Marca:</p>
                            <p className="text-lg">Caterpillar</p>
                            <p className="text-lg">Año:</p>
                            <p className="text-lg">2021</p>
                            <p className="text-lg">Serie:</p>
                            <p className="text-lg">CAT795F2021</p>

                        </div>
                    </div>

                </div>
                {/* Info del neumatico */}
                <h2 className="text-2xl font-bold text-black">Neumáticos</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Marca</th>
                            <th className="px-4 py-2">Modelo</th>
                            <th className="px-4 py-2">Posicion</th>
                            <th className="px-4 py-2">Serie</th>
                            <th className="px-4 py-2">Horas</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {neumaticos.map(neumatico => (
                            <tr key={neumatico.id}>
                                <td className="border px-4 py-2">{neumatico.marca}</td>
                                <td className="border px-4 py-2">{neumatico.modelo}</td>
                                <td className="border px-4 py-2">{neumatico.posicion}</td>
                                <td className="border px-4 py-2">{neumatico.serie}</td>
                                <td className="border px-4 py-2">{neumatico.horas}</td>
                                <td className="border px-4 py-2">{neumatico.estado}</td>
                                <td className="border px-4 py-2">
                                    <Link href={`/neumaticos/${neumatico.id}`} className="text-black text-lg"> Info. Detallada</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}