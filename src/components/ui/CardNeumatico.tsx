import Image from "next/image"

interface NeumaticoInt {
    Id: string;
    Codigo: string;
    Serie: string;
    Codigo_Camion: string;
    Profundidad: number;
    META_HORAS: number;
    META_KMS: number;
    Costo: number;
    Posicion: number;
}
interface CardNeumaticoProps {
    neumatico: NeumaticoInt;
}

export default function CardNeumatico({ neumatico }: CardNeumaticoProps) {
    return (

        <div className="w-[50px] h-[100px] relative group rounded-lg bg-emerald-300">
            <Image src="/tyre.png" alt="Esquema" layout="fill" objectFit="cover" />
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-4 w-56 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid grid-cols-1 z-40 ">
                <span className="text-white">Posicion: {neumatico.Posicion}</span>
                <span className="text-white">Horas utilizadas: {neumatico.META_HORAS}</span>
                <span className="text-white">Km utilizados: {neumatico.META_KMS}</span>
                <span className="text-white">Medicion interna: {neumatico.Profundidad}</span>
                <span className="text-white">Mmedicion externa: {neumatico.Profundidad}</span>
                <span className="text-white">Posicion: {neumatico.Posicion}</span>

            </span>
        </div>
    )
}