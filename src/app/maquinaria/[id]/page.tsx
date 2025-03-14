'use client'
import InfoNeumaticoCamion from "@/components/Listas/InfoCamion";
import data from "@/mocks/mocks.json";
import { useParams } from "next/navigation"
export default function Maquina() {

    const params = useParams<{ id: string }>();
    const id = parseInt(params.id);

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
    return (
        <div className="flex w-full h-screen">
            {/* Detalles de la maquina */}
            <main className="h-[100%]  w-[90%]">

                <div className="p-4">
                    <h1 className="text-2xl font-bold">Detalles del Camion</h1>
                    <InfoNeumaticoCamion />
                </div>
            </main>
            {/* Historial de cambios */}
            <aside className="p-4">
                <h2 className="text-2xl font-bold">Historial</h2>
                <p>Historial de cambios realizados al Camion</p>
            </aside>
        </div>
    )
}