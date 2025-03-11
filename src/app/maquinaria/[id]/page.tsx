import InfoNeumaticoCamion from "@/components/Listas/InfoCamion";


export default function Maquina() {
    return (
        <div className="flex w-full h-screen">
            {/* Detalles de la maquina */}
            <main className="h-[100%]  w-[70%]">

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