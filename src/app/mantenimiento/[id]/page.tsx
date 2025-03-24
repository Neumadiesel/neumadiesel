'use client'
import { useParams } from "next/navigation"

export default function MantenimientoPage() {


    const params = useParams<{ id: string }>();
    const id = params.id
    return (
        <div>
            <h1>Mantenimiento de {id}</h1>
        </div>
    )
}