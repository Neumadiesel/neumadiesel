'use client'
import { useState } from "react";

import ListaNeumaticos from "@/components/Listas/ListaNeumaticos";


export default function page() {

    const [tipo, setTipo] = useState("bodega");
    return (
        <div className="bg-white m-3 p-3 rounded-md shadow-lg h-[95%] font-mono">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-3xl">Neumaticos en {tipo}</h2>
                <select
                    className="bg-amber-50 w-[20%] border-amber-300 border rounded-md outline-amber-400 py-2 px-4"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="bodega">Bodega</option>
                    <option value="baja">Baja</option>
                    <option value="recuperados">Recuperados</option>
                    <option value="reparacion">Reparacion</option>
                </select>
            </div>
            <div>
                <ListaNeumaticos tipo={tipo} />
            </div>
        </div>
    )
}