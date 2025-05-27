'use client';
import { AccionUsuario } from "@/types/Historial";
import { Usuario } from "@/types/Usuario";

interface ModalHistorialUsuarioProps {
    visible: boolean;
    onClose: () => void;
    usuario: Usuario | null;
    historial: AccionUsuario[];
}

export default function ModalHistorialUsuario({
    visible,
    onClose,
    usuario,
    historial,
}: ModalHistorialUsuarioProps) {
    if (!visible || !usuario) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-2">
                    Historial de {usuario.nombre}
                </h2>
                <p className="text-gray-500 dark:text-amber-500 mb-4">Correo: {usuario.correo}</p>

                {historial.length > 0 ? (
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {historial.map((accion, index) => (
                            <li key={index} className="py-2">
                                <div className="text-sm text-gray-600 dark:text-amber-400">{accion.fecha}</div>
                                <div className="text-base">{accion.descripcion}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">Este usuario no tiene acciones registradas.</p>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-amber-300 hover:bg-amber-400 text-black px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
