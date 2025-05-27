"use client";
import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Función para manejar el "Aceptar"
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            {/* Fondo oscuro con opacidad */}
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>

            {/* Contenido del modal */}
            <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                {title && <h2 className="text-lg font-bold">{title}</h2>}
                <div className="mt-2">{children}</div>
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={onConfirm}
                        className="bg-amber-300 text-black font-semibold px-4 py-2 rounded-lg w-full hover:bg-amber-400"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-neutral-100 dark:bg-neutral-700 dark:text-gray-400 font-semibold text-black px-4 py-2 rounded-lg w-full hover:bg-gray-200 dark:hover:bg-neutral-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
