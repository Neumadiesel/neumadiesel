import Link from "next/link"
import { GiMineTruck } from "react-icons/gi"
import { Camiones } from "@/mocks/Camiones.json";
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
export default function ListaMaquinaria() {

    const camionesConNeumaticos = Camiones.map(camion => {
        const neumaticos = DB_Relacion_Numaticos_Camion.filter(relacion => relacion.Codigo_camion === camion.Codigo);
        let estado = 'Activo';
        if (neumaticos.some(neumatico => Math.abs(neumatico.medicion_interior - neumatico.medicion_exterior) >= 5)) {
            estado = 'Critico';
        } else if (neumaticos.some(neumatico => Math.abs(neumatico.medicion_interior - neumatico.medicion_exterior) >= 4)) {
            estado = 'Mantencion';
        }
        return {
            ...camion,
            neumaticos,
            estado
        };
    });

    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            {/* Titulo y acceso a ver mas */}
            <div className="flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Lista Maquinaria</h2>
                <Link href="/maquinaria" className="text-black text-xl"> Ver mas {">"} </Link>
            </div>
            <div className=" grid grid-cols-6 py-2 gap-4">
                {
                    camionesConNeumaticos.map((maquina) => (
                        <Link href={`/maquinaria/${maquina.Codigo}`}
                            key={maquina.Codigo}
                            className={`flex flex-col items-center justify-center p-3 border border-gray-300 rounded-full w-24 h-24 ${maquina.estado === 'Activo' ? 'bg-green-300' :
                                maquina.estado === 'Critico' ? 'bg-red-300' :
                                    maquina.estado === 'Mantencion' ? 'bg-yellow-300' :
                                        'bg-gray-300'
                                }`}
                        >
                            <GiMineTruck size={50} color="black" />
                            <p className="text-black font-semibold text-lg">{maquina.Codigo}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}