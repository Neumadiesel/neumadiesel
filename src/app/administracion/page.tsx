import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
export default function Page() {


    const usuarios = [
        {
            id: 1,
            nombre: 'Juan',
            apellido: 'Perez',
            rol: 'Administrador',
        },
        {
            id: 2,
            nombre: 'Pedro',
            apellido: 'Gonzalez',
            rol: 'Usuario',
        },
        {
            id: 3,
            nombre: 'Maria',
            apellido: 'Lopez',
            rol: 'Usuario',
        },
        {
            id: 4,
            nombre: 'Jose',
            apellido: 'Martinez',
            rol: 'Usuario',
        },
        {
            id: 5,
            nombre: 'Luis',
            apellido: 'Rodriguez',
            rol: 'Usuario',
        },
        {
            id: 6,
            nombre: 'Ana',
            apellido: 'Gutierrez',
            rol: 'Usuario',
        },
        {
            id: 7,
            nombre: 'Carlos',
            apellido: 'Hernandez',
            rol: 'Usuario',
        },


    ]
    return (
        <div className="block h-screen p-4 relative shadow-sm font-mono">
            <h1 className="text-3xl">Administracion de usuarios</h1>
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Apellido</th>
                        <th className="px-4 py-2">Faena</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td className="border px-4 py-2">{usuario.id}</td>
                                <td className="border px-4 py-2">{usuario.nombre}</td>
                                <td className="border px-4 py-2">{usuario.apellido}</td>
                                <td className="border px-4 py-2">Faena</td>
                                <td className="border px-4 py-2">{usuario.rol}</td>
                                <td className="border px-4 py-2 flex items-center justify-around">
                                    <Link href={`/usuario/${usuario.id}`} className="relative group">
                                        <MdOutlineLibraryBooks size={30} color="black" />
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Historial
                                        </span>
                                    </Link>
                                    <Link href={`/usuario/${usuario.id}`} className="relative group">
                                        <span className="absolute left-8 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Info
                                        </span>
                                        <FaInfoCircle size={30} color="black" />
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}