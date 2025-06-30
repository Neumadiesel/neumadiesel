"use client";
import { useState, useEffect } from "react";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "@/components/common/modal/CustomModal";
import ModalFormularioUsuario from "@/components/features/usuario/ModalFormularioUsuario";
import ModalEditarUsuario from "@/components/features/usuario/ModalEditarUsuario";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import CustomModal from "@/components/common/alerts/alert";
import Button from "@/components/common/button/Button";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useAuthFetch } from "@/utils/AuthFetch";
interface Role {
    role_id: number;
    name: string;
}

interface UserDto {
    user_id: number;
    name: string;
    last_name: string;
    email: string;
    faena_id: number;
    is_active: boolean;
    role: {
        role_id: number;
        name: string;
    };
}

interface FaenaDTO {
    id: number;
    name: string;
    region: string;
    isActive: boolean;
    contract: {
        id: number;
        startDate: string;
        endDate: string;
        siteId: number;
    };
}

export default function Page() {
    const authFetch = useAuthFetch();

    const [filtroRol, setFiltroRol] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [usuarios, setUsuarios] = useState<UserDto[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<UserDto[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const { token, deactivateUser, reactivateUser } = useAuth();

    const [mostrarModal, setMostrarModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenReactivar, setIsOpenReactivar] = useState(false);

    const usuariosPorPagina = 10;

    // Editar usuario
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<UserDto | null>(null);

    const [loading, setLoading] = useState(true);

    const [faenas, setFaenas] = useState<FaenaDTO[]>([]);
    const fetchFaenas = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sites/with-contract`);
            const data = await response.json();
            console.log("Faenas Fetched:", data);
            setLoading(false);
            setFaenas(data);
        } catch (error) {
            console.error("Error fetching reasons:", error);
        }
    };

    useEffect(() => {
        fetchFaenas();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

                // Obtener roles
                const rolesResponse = await axios.get(`${API_URL}/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRoles(rolesResponse.data);

                // Obtener usuarios
                const usersResponse = await axios.get(`${API_URL}/auth/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(usersResponse.data);
                setUsuarios(usersResponse.data);
                setUsuariosFiltrados(usersResponse.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, mostrarModal, mostrarEditar, isOpen, isOpenReactivar]);

    useEffect(() => {
        const filtrados = usuarios.filter(usuario => {
            const coincideRol =
                filtroRol === "todos" ||
                (usuario.role && usuario.role.name.toLowerCase() === filtroRol.toLowerCase());
            const coincideBusqueda =
                usuario.name.toLowerCase().includes(busqueda.toLowerCase()) ||
                usuario.email.toLowerCase().includes(busqueda.toLowerCase());

            return coincideRol && coincideBusqueda;
        });
        setUsuariosFiltrados(filtrados);
        setPaginaActual(1);
    }, [filtroRol, busqueda, usuarios]);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
    const inicio = (paginaActual - 1) * usuariosPorPagina;
    const fin = inicio + usuariosPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

    const [userId, setUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!userId) return;
        try {
            setIsLoading(true);
            await deactivateUser(userId);
            setIsOpen(false);
            setUserId(null);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al desactivar el usuario");
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleReactivate = async () => {
        if (!userId) return;
        try {
            setIsLoading(true);
            await reactivateUser(userId);
            setIsOpenReactivar(false);
            setUserId(null);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Error al desactivar el usuario");
        }
        finally {
            setIsLoading(false);
        }
    };

    const abrirEditor = (usuario: UserDto) => {
        setUsuarioEditar({
            user_id: usuario.user_id,
            name: usuario.name,
            last_name: usuario.last_name,
            email: usuario.email,
            role: usuario.role,
            faena_id: usuario.faena_id,
            is_active: usuario.is_active,
        });
        setMostrarEditar(true);
    };

    // Menu desplegable movil
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

    return (
        <div className="lg:p-4 bg-white dark:bg-[#212121] dark:text-white p-3 pb-4">
            <div className="p-2 lg:p-0">
                <h1 className="text-2xl font-bold">Lista de usuarios</h1>
                <p>Esta es la página de administración de usuarios.</p>
            </div>

            {/* Sección de botones y filtros */}
            <section className="flex flex-wrap justify-between items-center my-4 gap-2 p-2 lg:p-0">


                <select
                    className="bg-gray-100  dark:hover:bg-neutral-800 flex px-4 justify-center text-black p-2 rounded-sm border border-neutral-300 dark:border-neutral-400 items-center gap-2 text-md font-semibold dark:bg-[#212121] dark:text-white"
                    value={filtroRol}
                    onChange={e => setFiltroRol(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    {roles.map(role => (
                        <option key={role.role_id} value={role.name.toLowerCase()}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <div className="flex items-center ">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="bg-gray-100  dark:hover:bg-neutral-800 flex px-4 justify-center text-black p-2 rounded-sm border border-neutral-300 dark:border-neutral-400 items-center gap-2 text-md font-semibold dark:bg-[#212121] dark:text-white dark:placeholder:text-white placeholder:text-gray-500 outline-none"
                    />
                </div>
                <Button
                    onClick={() => setMostrarModal(true)}
                    text="Registrar Usuario"
                />
            </section>

            {/* Tabla */}
            <table className="table-auto w-full border-collapse bg-white dark:bg-[#212121] shadow-md rounded-md border overflow-hidden">
                <thead className="text-xs text-black h-12 uppercase bg-amber-300">
                    <tr>
                        <th className="p-2 text-start ">Nombre</th>
                        <th className="p-2 text-start hidden lg:table-cell">Email</th>
                        <th className="p-2 text-start">Rol</th>
                        <th className="p-2 text-start">Faena</th>
                        <th className="p-2 w-[20%]">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="text-center p-8">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Cargando usuarios...
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : usuariosPagina.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                <div className="flex flex-col items-center justify-center space-y-4  animate-pulse">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No se encontraron usuarios.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : null}
                    {usuariosPagina.map((usuario, index) => (
                        <tr key={usuario.user_id} className="border-b dark:border-neutral-400 dark:bg-neutral-800">
                            <td className="px-4 p-2 bg-gray-50 dark:bg-neutral-800 text-start">
                                {usuario.name} {usuario.last_name}
                            </td>
                            <td className="p-2 hidden lg:block dark:bg-neutral-800">{usuario.email}</td>
                            <td className="p-2 text-start bg-gray-50 dark:bg-neutral-800">
                                {usuario.role?.name || "Sin Rol"}
                            </td>

                            <td className="p-2 text-start bg-gray-50 dark:bg-neutral-800">
                                {faenas.find(faena => faena.id === usuario.faena_id)?.name || "Sin faena"}
                            </td>

                            <td className="p-2 relative text-center bg-gray-50 dark:bg-neutral-800">
                                {/* Botones en escritorio */}
                                <div className="hidden md:flex justify-center gap-2 ">
                                    <button
                                        onClick={() => abrirEditor(usuario)}
                                        className="p-2 px-3 text-green-500 hover:text-green-600 bg-green-50 dark:bg-neutral-800 border border-green-300 rounded-md flex items-center justify-center"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    {
                                        usuario.is_active ? (
                                            <button
                                                onClick={() => { setUserId(usuario.user_id); setIsOpen(true) }}
                                                className="bg-red-50 hover:bg-red-100 dark:hover:bg-neutral-900 dark:bg-[#212121] dark:text-red-300 text-black border border-red-200 font-bold py-2 px-3 rounded-md"
                                            >
                                                <FaEyeSlash className="inline-block" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setUserId(usuario.user_id); setIsOpenReactivar(true) }}
                                                className="bg-emerald-50 hover:bg-emerald-100 dark:hover:bg-neutral-900 dark:bg-[#212121] dark:text-emerald-300 text-black border border-emerald-200 font-bold py-2 px-3 rounded-md"
                                            >
                                                <FaEye className="inline-block" />
                                            </button>
                                        )
                                    }
                                </div>

                                {/* Botón de 3 puntos en móvil */}
                                <div className="md:hidden flex justify-center">
                                    <button
                                        onClick={() =>
                                            setMenuAbierto(menuAbierto === index ? null : index)
                                        }
                                        className="p-2 bg-gray-200 dark:bg-[#333] rounded-full"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    {menuAbierto === index && (
                                        <div className="absolute top-[calc(100%-2px)] right-0 w-40 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50">
                                            <button
                                                onClick={() => {
                                                    abrirEditor(usuario);
                                                    setMenuAbierto(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(true);
                                                    setMenuAbierto(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    className={`p-3   font-semibold h-10 border rounded-full ${paginaActual === 1 ? "bg-gray-100 dark:bg-neutral-800 dark:text-white " : "bg-amber-300 dark:border-black hover:bg-amber-200"
                        } text-black`}
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    disabled={paginaActual === 1}
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1">
                    Página {paginaActual} de {totalPaginas}
                </span>
                <button
                    className={`p-3   h-10 font-semibold border rounded-full ${paginaActual === totalPaginas ? "bg-gray-200  dark:bg-neutral-800 dark:text-white" : "bg-amber-300 hover:bg-amber-200 dark:border-black"
                        } text-black`}
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <LoadingSpinner isOpen={isLoading} />

            {/* Modal para desactivar usuario */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                title="Desactivar usuario"
            >
                <p>
                    Desactivar un usuario impedirá su acceso al sistema. Sin embargo, se mantendrán
                    registrados sus datos y las acciones realizadas previamente.
                </p>
                <p className="font-semibold">
                    ¿Estás seguro de que deseas desactivar este usuario?
                </p>
            </Modal>

            {/* Modal para Reactivar usuario */}
            <Modal
                isOpen={isOpenReactivar}
                onClose={() => setIsOpenReactivar(false)}
                onConfirm={handleReactivate}
                title="Reactivar usuario"
            >
                <p>
                    Reactivar un usuario le devolvera su acceso al sistema.
                </p>
                <p className="font-semibold">
                    ¿Estás seguro de que deseas reactivar este usuario?
                </p>
            </Modal>

            {/* Modal de Alerta */}
            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}


            {/* Modal para agregar usuario */}
            <ModalFormularioUsuario
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onGuardar={nuevoUsuario => {
                    setMostrarModal(false);
                    console.log("Nuevo usuario agregado:", nuevoUsuario);
                }}
            />

            {/* Modal Editar */}
            <ModalEditarUsuario
                visible={mostrarEditar}
                onClose={() => setMostrarEditar(false)}
                usuario={usuarioEditar}
                onGuardar={() => {
                    setMostrarEditar(false);
                    console.log("Usuario actualizado");
                }}
            />
        </div>
    );
}
