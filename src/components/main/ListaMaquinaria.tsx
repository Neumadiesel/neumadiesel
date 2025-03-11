import Link from "next/link"
import { GiMineTruck } from "react-icons/gi"
export default function ListaMaquinaria() {

    const maquinas = [
        {
            id: 1,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 2,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 3,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 4,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 5,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 6,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Critico'
        },
        {
            id: 7,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Mantencion'

        },
        {
            id: 8,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Activo'
        },
        {
            id: 9,
            nombre: 'Retroexcavadora',
            marca: 'Caterpillar',
            modelo: '420F',
            año: 2021,
            serie: 'CAT0420F2021',
            estado: 'Critico'
        }
    ]
    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            {/* Titulo y acceso a ver mas */}
            <div className="flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Lista Maquinaria</h2>
                <Link href="/maquinaria" className="text-black text-xl"> Ver mas {">"} </Link>
            </div>
            <div className=" grid grid-cols-6 py-2 gap-4">
                {
                    maquinas.map((maquina) => (
                        <Link href={`/maquinaria/${maquina.id}`}
                            key={maquina.id}
                            className={`flex flex-col items-center justify-center p-3 border border-gray-300 rounded-full w-24 h-24 ${maquina.estado === 'Activo' ? 'bg-green-300' :
                                maquina.estado === 'Critico' ? 'bg-red-300' :
                                    maquina.estado === 'Mantencion' ? 'bg-yellow-300' :
                                        'bg-gray-300'
                                }`}
                        >
                            <GiMineTruck size={50} color="black" />
                            <p className="text-black font-semibold text-lg">{maquina.modelo}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}