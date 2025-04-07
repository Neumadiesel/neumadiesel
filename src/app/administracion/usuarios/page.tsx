'use client'
import { useState, useEffect, use } from "react";
import { usuarios } from "@/lib/constants/usuarios";
import { FaEyeSlash, FaPen, FaRegCopy } from "react-icons/fa";
import Modal from "@/components/ui/modal/customModal";
import ModalFormularioUsuario from "@/components/ui/modal/ModalFormularioUsuario";
import { Usuario } from "@/types/Usuario";
import { AccionUsuario } from "@/types/Historial";
import ModalHistorialUsuario from "@/components/ui/modal/ModalHistorialUsuario";
import ModalEditarUsuario from "@/components/ui/modal/ModalEditarUsuario";


export default function Page() {
    const [filtroRol, setFiltroRol] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(usuarios);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const usuariosPorPagina = 10;

    useEffect(() => {
        const filtrados = usuarios.filter((usuario) => {
            const coincideRol = filtroRol === "todos" || usuario.rol.toLowerCase() === filtroRol.toLowerCase();
            const coincideBusqueda =
                usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.correo.toLowerCase().includes(busqueda.toLowerCase());

            return coincideRol && coincideBusqueda;
        });
        setUsuariosFiltrados(filtrados);
        setPaginaActual(1); // Reinicia a la primera página al filtrar
    }, [filtroRol, busqueda]);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Usuario desactivado");
    };

    // Historial
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
    const [acciones, setAcciones] = useState<AccionUsuario[]>([]);

    const abrirHistorial = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        // Reemplaza esto por una llamada real a un backend si es necesario
        setAcciones([
            { fecha: "2025-04-01", descripcion: "Inició sesión en el sistema" },
            { fecha: "2025-04-02", descripcion: "Modificó una faena" },
            { fecha: "2025-04-04", descripcion: "Generó un reporte PDF" },
        ]);
        setMostrarHistorial(true);
    };

    // Editar usuario
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

    const abrirEditor = (usuario: Usuario) => {
        setUsuarioEditar(usuario);
        setMostrarEditar(true);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Lista de usuarios</h1>
            <p>Esta es la página de administración de usuarios.</p>

            {/* Sección de botones y filtros */}
            <section className="flex flex-wrap justify-between items-center my-4 gap-2">
                <button onClick={() => setMostrarModal(true)} className="bg-amber-300 hover:bg-amber-400 text-black font-bold py-2 px-4 rounded">
                    Agregar Usuario
                </button>

                <select
                    className="border border-amber-500 rounded-md bg-amber-50 dark:bg-[#212121] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtroRol}
                    onChange={(e) => setFiltroRol(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="administrador">Administradores</option>
                    <option value="planificador">Planificadores</option>
                    <option value="supervisor">Supervisores</option>
                    <option value="operador">Operadores</option>
                </select>

                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="border border-amber-500 rounded-md bg-amber-50 dark:bg-[#212121] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </section>

            {/* Tabla */}
            <table className="table-auto w-full border-collapse bg-white dark:bg-[#212121] shadow-md rounded-lg overflow-hidden">
                <thead className="bg-amber-300 text-black">
                    <tr>
                        <th className="p-2 w-[20%]">Nombre</th>
                        <th className="p-2 w-[20%]">Email</th>
                        <th className="p-2">Rol</th>
                        <th className="p-2">Faena</th>
                        <th className="p-2 w-[20%]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usuariosPagina.length === 0 && (
                            <tr>
                                <td colSpan={6} rowSpan={6} className="text-center p-4">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )

                    }
                    {usuariosPagina.map((usuario, index) => (
                        <tr key={inicio + index} className="">
                            <td className="p-2">{usuario.nombre}</td>
                            <td className="p-2">{usuario.correo}</td>
                            <td className="p-2 text-center">{usuario.rol}</td>
                            <td className="p-2">{usuario.faena}</td>
                            <td className="p-2 flex justify-center gap-2">
                                <button onClick={() => abrirEditor(usuario as Usuario)} className="bg-gray-50 dark:bg-[#212121] dark:text-amber-300 hover:bg-amber-200 text-black border border-amber-500 font-bold py-2 px-4 rounded">
                                    <FaPen className="inline-block" />
                                </button>
                                {/* Boton para ver el historial */}
                                <button onClick={() => { abrirHistorial(usuario as Usuario) }} className="bg-emerald-50 dark:bg-[#212121] dark:text-emerald-300 hover:bg-emeral-200 text-black border font-bold py-2 px-4 rounded ml-2">
                                    <FaRegCopy className="inline-block" />
                                </button>
                                {/* Boton de desactivar usuario */}
                                <button onClick={() => { setIsOpen(true) }} className="bg-red-50 hover:bg-red-200 dark:bg-[#212121] dark:text-red-300 text-black border font-bold py-2 px-4 rounded ml-2">
                                    <FaEyeSlash className="inline-block" />
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    className="px-3 py-1 bg-amber-300 text-black border rounded disabled:opacity-60"
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    disabled={paginaActual === 1}
                >
                    Anterior
                </button>
                <span className="px-3 py-1">
                    Página {paginaActual} de {totalPaginas}
                </span>
                <button
                    className="px-3 bg-amber-300 text-black py-1 border rounded disabled:opacity-60"
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
            {/* Modal para desactivar usuario */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="Desactivar usuario">
                <p>Desactivar un usuario impedirá su acceso al sistema. Sin embargo, se mantendrán registrados sus datos y las acciones realizadas previamente.</p>
                <p className="font-semibold">¿Estás seguro de que deseas desactivar este usuario?</p>
            </Modal>
            {/* Modal para agregar usuario */}
            <ModalFormularioUsuario
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onGuardar={(nuevoUsuario) => {

                    console.log("Nuevo usuario agregado:", nuevoUsuario);
                }}
            />
            {/* Modal Historial */}
            <ModalHistorialUsuario
                visible={mostrarHistorial}
                onClose={() => setMostrarHistorial(false)}
                usuario={usuarioSeleccionado}
                historial={acciones}
            />
            {/* Modal Editar */}
            <ModalEditarUsuario
                visible={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                usuario={usuarioEditar}
                onGuardar={(usuarioActualizado) => {
                    console.log("Usuario actualizado:", usuarioActualizado);
                    // Aquí podrías hacer un update en el estado o mandar a backend
                }}
            />
        </div>
    );
}
