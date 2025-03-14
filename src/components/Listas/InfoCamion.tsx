'use client'
import Link from "next/link"
import Image from "next/image"
import data from "@/mocks/mocks.json"
import { useParams } from "next/navigation"

interface neumaticoInterface {
    id: number;
    id_vehiculo: number;
    id_rueda: number;
    mediciones: {
        id: number;
        id_neumatico: number;
        id_vehiculo: number;
        posicion: number;
        horas_utilizadas: number;
        km_utilizados: number;
        medicion_externa: number;
        medicion_interna: number;
        presion: number;
        temperatura: number;
    }[];
}

export default function ListaMaquinaria() {

    const params = useParams<{ id: string }>();
    const id = parseInt(params.id);


    const neumaticos: neumaticoInterface[] = data.RuedasPorVehiculo.filter(rueda => rueda.id_vehiculo === id).map(rueda => {
        const mediciones = data.MedicionPorRueda.filter(medicion => medicion.id_neumatico === rueda.id)
        return {
            ...rueda,
            mediciones: mediciones.length > 0 ? mediciones : [{
                id: 0,
                id_neumatico: 0,
                id_vehiculo: 0,
                posicion: 0,
                horas_utilizadas: 0,
                km_utilizados: 0,
                medicion_externa: 0,
                medicion_interna: 0,
                presion: 0,
                temperatura: 0
            }]
        }
    })

    const maquinas = data.Vehiculo;
    const faenas = data.Faena;
    const circuitos = data.Circuito;
    const vehiculosPorFlota = data.VehiculosPorFlota

    const obtenerInfoVehiculo = () => {
        const vehiculo = maquinas.find((vehiculo) => vehiculo.id === id);
        if (!vehiculo) return null;

        const relacion = vehiculosPorFlota.find((vpf) => vpf.id_vehiculo === vehiculo.id);
        const faena = faenas.find((f) => f.id === relacion?.id_faena);
        const circuito = circuitos.find((c) => c.id_faena === faena?.id);

        return {
            ...vehiculo,
            faena: faena?.compania || "Desconocida",
            circuito: circuito?.nombre || "No asignado",
        };
    };

    const vehiculoInfo = obtenerInfoVehiculo();

    console.log("Neumaticos", neumaticos)
    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            <div className=" text-black flex flex-col">
                {/* Info del camion */}
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-black">Camion {vehiculoInfo?.marca} {vehiculoInfo?.modelo} - Faena {vehiculoInfo?.faena}</h2>
                    <div className="flex justify-between items-center">
                        <Link href={`/mantenimiento/${id}`} className="text-black text-lg bg-amber-300 p-2 rounded-md border border-black">Realizar Mantencion</Link>
                    </div>
                </div>
                <section className="h-[40%] w-full flex ">

                    <Image src="/caex.webp" className="mr-4" height={300} width={400} alt="Camion" objectFit="cover" />

                    {/* Esquema de neumaticos */}
                    <div className="w-[70%] flex justify-center items-center ">
                        <section className="grid grid-cols-5  gap-y-4 gap-x-2">
                            <div className="w-[50px] h-[100px]"></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] "></div>
                            <div className="w-[50px] h-[100px] relative rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                            </div>
                            <div className="w-[50px] h-[100px] relative group rounded-lg bg-emerald-300">
                                <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
                                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-4 w-56 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid grid-cols-1 ">
                                    <span className="text-white">Posicion: 3</span>
                                    <span className="text-white">Horas utilizadas: 1500</span>
                                    <span className="text-white">Km utilizados: 3000</span>
                                    <span className="text-white">Medicion interna: 85</span>
                                    <span className="text-white">Mmedicion externa: 85</span>
                                    <span className="text-white">Presion: 115</span>
                                    <span className="text-white">Temperatura: 85</span>





                                </span>
                            </div>


                        </section>
                        {/* <div className="w-[10vh] h-[20vh] rounded-lg bg-emerald-300 relative">
                            
                        </div> */}
                    </div>

                </section>

                {/* Info del neumatico */}
                <h2 className="text-2xl font-bold text-black">Neumáticos</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID Rueda</th>
                            <th className="px-4 py-2">ID Vehiculo</th>
                            <th className="px-4 py-2">Horas Utilizadas</th>
                            <th className="px-4 py-2">Km Utilizados</th>
                            <th className="px-4 py-2">Medicion Externa</th>
                            <th className="px-4 py-2">Medicion Interna</th>
                            <th className="px-4 py-2">Presion</th>
                            <th className="px-4 py-2">Temperatura</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {neumaticos.map((neumatico) => (
                            <tr key={neumatico.id}>
                                <td className="border px-4 py-2">{neumatico.id_rueda}</td>
                                <td className="border px-4 py-2">{neumatico.id_vehiculo}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].horas_utilizadas}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].km_utilizados}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].medicion_externa}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].medicion_interna}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].presion}</td>
                                <td className="border px-4 py-2">{neumatico.mediciones[0].temperatura}</td>

                                <td className="border px-4 py-2">
                                    <Link href={`/neumaticos/${neumatico.id}`} className="text-black text-lg"> Info. Detallada</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}