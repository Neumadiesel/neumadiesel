import React from "react";

interface ButtonProps {
    onClick: () => void;
    text: string;
    className?: string; // Permite agregar clases adicionales
}

export default function Button({
    onClick,
    text,
    className = "",
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`bg-gray-100 hover:bg-gray-200 dark:hover:bg-neutral-700 flex px-4 justify-center text-black p-2 rounded-sm border cursor-pointer items-center gap-2 text-md font-semibold dark:bg-[#212121] dark:text-white ${className}`}
        >
            <span>{text}</span>
        </button>
    );
}