import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import fs from 'fs';
import path from 'path';

interface Usuario {
    id: number;
    nombre_completo: string;
    correo: string;
    contrasena: string;
    faena_minera: string;
    rol: string;
}
export default function Page() {


    const usuariosFilePath = path.join(process.cwd(), 'src', 'mocks', 'usuarios.json');
    const usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, 'utf8'));

    return (
        <div className="block h-screen p-4 relative shadow-sm font-mono">
            <h1 className="text-3xl">Administración de usuarios</h1>
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Correo</th>
                        <th className="px-4 py-2">Contrasena</th>
                        <th className="px-4 py-2">Faena</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {
                        usuarios.map((usuario: Usuario) => (
                            <tr key={usuario.id}>
                                <td className="border px-4 py-2">{usuario.id}</td>
                                <td className="border px-4 py-2">{usuario.nombre_completo}</td>
                                <td className="border px-4 py-2">{usuario.correo}</td>
                                <td className="border px-4 py-2">********</td>
                                <td className="border px-4 py-2">
                                    {usuario.faena_minera === "" ? "Administrador" : usuario.faena_minera}</td>
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