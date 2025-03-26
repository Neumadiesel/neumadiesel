import InfoNeumaticoCamion from "@/components/Listas/InfoCamion";
export default function Page() {
    return (
        <div className="flex w-[100%] h-screen">
            {/* Detalles de la maquina */}
            <main className="h-screen  w-full mx-auto">
                <div className="p-2">
                    <InfoNeumaticoCamion />
                </div>
            </main>
        </div>
    )
}