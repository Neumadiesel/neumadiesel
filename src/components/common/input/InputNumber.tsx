"use client"

import { useEffect, useState } from "react";

interface InputNumeroSeguroProps {
    value: number | null;
    onValidChange: (value: number | null) => void;
    min?: number;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export function InputNumeroSeguro({
    value,
    onValidChange,
    min = 0,
    disabled = false,
    placeholder = "",
    className = "",
}: InputNumeroSeguroProps) {
    const [localValue, setLocalValue] = useState<string>("");

    useEffect(() => {
        // Actualizar el valor visible cuando cambie desde afuera
        setLocalValue(value !== null ? value.toString() : "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalValue(val);

        if (val === "") {
            onValidChange(null);
            return;
        }

        const num = Number(val);

        const isInvalid = (
            isNaN(num) ||
            num < min ||
            /^[-]{2,}/.test(val) ||         // doble guion
            /^0{2,}\d*/.test(val) ||        // empieza con 00, 000, etc.
            /^\.|\.$/.test(val) ||          // punto al principio o final
            /[^0-9.\-]/.test(val)           // caracteres que no son números, punto o guion
        );

        if (!isInvalid) {
            onValidChange(num);
        }
    };

    return (
        <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min={min}
            disabled={disabled}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={`bg-gray-50 dark:bg-[#414141] border border-gray-300 p-2 rounded-sm ${className}`}
        />
    );
}