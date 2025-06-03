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

    return (
        <button
            {...rest}
            disabled={isDisabled}
            className={`px-4 py-2 bg-amber-400 text-black font-bold rounded  disabled:opacity-75 ${isDisabled ? "" : "hover:bg-amber-500"} ${className}`}
        >

            {loading ? "Procesando..." : children}
        </button>
    );
}