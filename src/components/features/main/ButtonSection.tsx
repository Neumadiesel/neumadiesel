"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
export default function ButtonSection() {
    const { user } = useAuth();
    return (
        <div>
            {!user && (
                <div className="flex flex-row gap-4">
                    <Link
                        href="/login"
                        className="bg-amber-300 hover:bg-amber-400 text-black px-4 mt-4 font-bold py-2 rounded-sm"
                    >
                        Iniciar Sesion
                    </Link>
                    <button className="bg-transparent border-2 border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-black px-4 mt-4 font-bold py-2 rounded-sm">
                        Solicitar Demo
                    </button>
                </div>
            )}
        </div>
    );
}
