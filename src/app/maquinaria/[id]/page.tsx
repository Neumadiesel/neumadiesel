import InfoNeumaticoCamion from "@/components/features/equipo/InfoCamion";
export default function Maquina() {

    return (
        <div className="flex w-full h-screen">
            {/* Detalles de la maquina */}
            <main className="h-screen   w-full mx-auto">
                <div className="">
                    <InfoNeumaticoCamion />
                </div>
            </main>
        </div>
    )
}