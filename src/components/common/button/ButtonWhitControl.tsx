"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface ButtonWithAuthControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export default function ButtonWithAuthControl({
    loading = false,
    children,
    className = "",
    ...rest
}: ButtonWithAuthControlProps) {
    const { isDemo } = useAuth();

    const isDisabled = rest.disabled || loading || isDemo;

    console.log("ButtonWithAuthControl isDemo:", isDisabled);
    return (
        <button
            {...rest}
            disabled={isDisabled}
            className={`px-4 py-2  font-bold rounded  disabled:opacity-75 ${isDisabled ? "border border-neutral-200 dark:border-neutral-600 text-neutral-300 dark:text-neutral-700" : "bg-amber-400 hover:bg-amber-500 text-black"} ${className}`}
        >
            {loading ? "Procesando..." : children}
        </button>
    );
}