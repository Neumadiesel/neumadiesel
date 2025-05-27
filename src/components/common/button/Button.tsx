import React from "react";

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean; // Propiedad opcional para deshabilitar el botón
    text: string;
    className?: string; // Permite agregar clases adicionales
}

export default function Button({
    onClick,
    text,
    disabled,
    className = "",
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`bg-gray-100  dark:hover:bg-neutral-700 flex px-4 justify-center text-black p-2 rounded-sm border  items-center gap-2 text-md font-semibold dark:bg-[#252525] dark:border-neutral-700 dark:text-white ${className} ${disabled ? "opacity-70 " : "cursor-pointer hover:bg-gray-200"
                }`}
        >
            <span>{text}</span>
        </button>
    );
}