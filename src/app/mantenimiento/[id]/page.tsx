'use client'
import { useParams } from "next/navigation"
import { FaSadTear } from "react-icons/fa";

export default function MantenimientoPage() {


    const params = useParams<{ id: string }>();
    const id = params.id
    return (
        <div className="m-3 p-3 bg-white w-[95%] rounded-md shadow-md h-[80%] flex flex-col items-center justify-center">
            <FaSadTear size={96} className="text-black mb-4" />
            <h3 className="font-mono font-semibold text-xl mb-4">Pagina de {id} no encontrada</h3>
            <p className="text-sm w-[50%] text-center">
                La pagina que buscas no existe o ha ocurrido un error.
                Regresa, o dirígete a weebir.com para elegir una nueva dirección
            </p>
        </div>
    )
}