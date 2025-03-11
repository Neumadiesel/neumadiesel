import Link from "next/link"
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
            </div>
            <div className=" text-black">
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Nombre</th>
                            <th className="px-4 py-2">Marca</th>
                            <th className="px-4 py-2">Modelo</th>
                            <th className="px-4 py-2">Año</th>
                            <th className="px-4 py-2">Serie</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maquinas.map(maquina => (
                            <tr key={maquina.id}>
                                <td className="border px-4 py-2">{maquina.nombre}</td>
                                <td className="border px-4 py-2">{maquina.marca}</td>
                                <td className="border px-4 py-2">{maquina.modelo}</td>
                                <td className="border px-4 py-2">{maquina.año}</td>
                                <td className="border px-4 py-2">{maquina.serie}</td>
                                <td className="border px-4 py-2">{maquina.estado}</td>
                                <td className="border px-4 py-2">
                                    <Link href={`/maquinaria/${maquina.id}`} className="text-black text-lg"> Info. Detallada</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}