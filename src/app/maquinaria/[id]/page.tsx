import InfoNeumaticoCamion from "@/components/Listas/InfoCamion";
export default function Maquina() {

    return (
        <div className="flex w-full h-screen">
            {/* Detalles de la maquina */}
            <main className="h-screen  w-full mx-auto">
                <div className="p-2">
                    <InfoNeumaticoCamion />
                </div>
            </main>
        </div>
    )
}