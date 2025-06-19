import { CircleDot, Gauge, Thermometer } from "lucide-react";
export default function CardCheck() {
    return (
        <div className="bg-white dark:bg-[#212121] border dark:border-neutral-800 h-full flex flex-col rounded-md p-2">
            <div className="flex items-center justify-between w-full ">

                <p className="text-xl font-bold mt-4">
                    Neumatico: AB203123
                </p>
                {/* Estado */}
                <div className="bg-black p-1 px-2 rounded-2xl">
                    <span className="text-white font-semibold">Bueno</span>
                </div>
            </div>
            <p className="mt-2">
                Posición: 1
            </p>
            {/* Seccion de datos */}
            <section className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Presion */}
                <div className="flex items-center gap-2">
                    <Gauge size={28} className="inline mr-2 text-blue-500" />
                    <p className="text-gray-700 dark:text-gray-300">Presión:</p>
                </div>
                <p className="text-xl font-bold">32 PSI</p>
                {/* Temperatura */}
                <div className="flex items-center gap-2">
                    <Thermometer size={28} className="inline mr-2 text-red-500" />
                    <p className="text-gray-700 dark:text-gray-300">Temperatura:</p>
                </div>
                <p className="text-xl font-bold">75 °C</p>
                {/* Remanente */}
                <div className="flex items-center gap-2">
                    <CircleDot size={28} className="inline mr-2 text-green-500" />
                    <p className="text-gray-700 dark:text-gray-300">Remanente:</p>
                </div>
                <p className="text-xl font-bold">10 mm</p>
                {/* Fecha de instalacion */}
                <p className="text-gray-700 dark:text-gray-300">Fecha de Instalación:</p>
                <p className="text-xl font-bold">01/01/2023</p>
                {/* Fecha de proxima medicion */}


            </section>
        </div>
    )
}