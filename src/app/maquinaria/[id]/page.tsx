import InfoNeumaticoCamion from "@/components/Listas/InfoCamion";
export default function Maquina() {

    return (
        <div className="flex w-full h-screen">
            {/* Detalles de la maquina */}
            <main className="h-screen  w-full mx-auto">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Detalles del Camion</h1>
                    <InfoNeumaticoCamion />
                </div>
            </main>
        </div>
    )
}