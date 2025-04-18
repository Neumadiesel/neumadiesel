"use client";

import { Pencil, Eye } from "lucide-react";

interface Orden {
    id: number;
    fecha: string;
    equipo: string;
    estado: "Pendiente" | "En Proceso" | "Finalizada";
}

const ordenes: Orden[] = [
    { id: 1, fecha: "2025-04-16", equipo: "Excavadora CAT 320", estado: "Pendiente" },
    { id: 2, fecha: "2025-04-14", equipo: "Cargador Volvo L120", estado: "En Proceso" },
    { id: 3, fecha: "2025-04-10", equipo: "Camión Komatsu HD785", estado: "Finalizada" },
];

const getEstadoColor = (estado: Orden["estado"]) => {
    switch (estado) {
        case "Pendiente":
            return "bg-yellow-100 text-yellow-800";
        case "En Proceso":
            return "bg-blue-100 text-blue-800";
        case "Finalizada":
            return "bg-green-100 text-green-800";
        default:
            return "";
    }
};

export default function OrdenesTrabajoList() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Órdenes de Trabajo</h2>
            <div className="overflow-x-auto rounded-xl shadow">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2">Equipo</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map(orden => (
                            <tr key={orden.id} className="border-t">
                                <td className="px-4 py-2">{orden.fecha}</td>
                                <td className="px-4 py-2">{orden.equipo}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(
                                            orden.estado
                                        )}`}
                                    >
                                        {orden.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button>
                                        <Eye className="w-4 h-4 mr-1" /> Ver
                                    </button>
                                    <button>
                                        <Pencil className="w-4 h-4 mr-1" /> Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
