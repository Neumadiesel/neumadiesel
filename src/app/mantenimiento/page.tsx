'use client'
import { useState } from "react";

const EjesCamion = () => {
    const [selectedEje, setSelectedEje] = useState(null);

    const ejes = [
        { id: 1, nombre: "Eje delantero", descripcion: "Soporta la dirección del camión." },
        { id: 2, nombre: "Eje trasero izquierdo", descripcion: "Conectado al diferencial y soporta carga." },
        { id: 3, nombre: "Eje trasero derecho", descripcion: "Similar al izquierdo, distribuye peso y tracción." }
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Ejes del Camión CAEX</h1>
            <div className="grid grid-cols-3 gap-4">
                {ejes.map((eje) => (
                    <div
                        key={eje.id}
                        className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all duration-300 ${selectedEje === eje.id ? "bg-yellow-500 text-white" : "bg-white hover:bg-gray-200"
                            }`}
                        onClick={() => setSelectedEje(eje.id)}
                    >
                        <h2 className="font-semibold">{eje.nombre}</h2>
                    </div>
                ))}
            </div>
            {selectedEje && (
                <div className="mt-6 p-4 bg-white border rounded-lg shadow-md w-96">
                    <h2 className="text-lg font-semibold">{ejes.find((e) => e.id === selectedEje).nombre}</h2>
                    <p className="text-gray-700 mt-2">{ejes.find((e) => e.id === selectedEje).descripcion}</p>
                </div>
            )}
        </div>
    );
};

export default EjesCamion;
