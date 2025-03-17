import Link from "next/link"
import { GiMineTruck } from "react-icons/gi"
import { FaChartBar } from "react-icons/fa";
import Image from "next/image";
import { Camiones } from "@/mocks/Camiones.json";
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
import CardMain from "../ui/CardMain";
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
            <div className="hidden md:flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Lista Maquinaria</h2>
                <Link href="/maquinaria" className="text-black text-xl"> Ver mas {">"} </Link>
            </div>
            {/* vista desde el movil */}
            <div className="md:hidden">
                <div className="bg-amber-300 w-full rounded-xl h-48">

                </div>
                <section className="grid grid-cols-3 gap-x-2 ">
                    <CardMain titulo="Maquinaria" link="maquinaria">
                        <GiMineTruck size={50} color="black" />
                    </CardMain>
                    <CardMain titulo="Neumaticos" link="neumaticos" >
                        <Image src="/neumatico-3.png" width={50} height={50} alt="Acceso pagina neumaticos" />
                    </CardMain>
                    <CardMain titulo="Graficos" link="estadisticas" >
                        <FaChartBar size={50} color="black" />
                    </CardMain>
                </section>
            </div>
            <div className="hidden md:grid md:grid-cols-6 py-2 ">
                {
                    camionesConNeumaticos.map((maquina) => (
                        <Link href={`/maquinaria/${maquina.Codigo}`}
                            key={maquina.Codigo}
                            className={`flex flex-col items-center justify-center mb-1 border border-gray-300 rounded-full w-24 h-24 ${maquina.estado === 'Activo' ? 'bg-green-300' :
                                maquina.estado === 'Critico' ? 'bg-red-300' :
                                    maquina.estado === 'Mantencion' ? 'bg-yellow-300' :
                                        'bg-gray-300'
                                }`}
                        >
                            <GiMineTruck size={45} color="black" />
                            <p className="text-black font-semibold text-lg">{maquina.Codigo}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}