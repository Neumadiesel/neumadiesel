
import { FaCircleDot } from "react-icons/fa6";
import { GiMineTruck } from "react-icons/gi";
import { FaExclamationTriangle } from "react-icons/fa";
export default function SectionKpi() {
    return (
        <section className="grid grid-cols-2 lg:grid-cols-1 gap-3 w-[100%] h-full justify-between ">
            {/* Neumaticos Operativos */}
            <div className="flex flex-row gap-2 h-20 items-center w-full py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-blue-500  p-2 rounded-md">
                <FaCircleDot className="text-4xl drop-shadow-md text-blue-500" />
                <div className="flex flex-col text-start">
                    <p>100</p>
                    <p>Neumáticos Operativos</p>
                </div>
            </div>
            {/* Equipos Operativos */}
            <div className="flex flex-row gap-2 h-20 items-center w-full py-4 bg-neutral-50 dark:bg-neutral-900 border-2 dark:border-amber-300 border-amber-500  p-2 rounded-md">
                <GiMineTruck className="text-4xl drop-shadow-md text-amber-500 dark:text-amber-400" />
                <div className="flex flex-col text-start">
                    <p>30</p>
                    <p>Equipos Operativos</p>
                </div>
            </div>
            {/* Cantidad de alertas */}
            <div className="flex flex-row gap-2 h-20 items-center w-full py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-emerald-500  p-2 rounded-md">
                <FaExclamationTriangle className="text-4xl drop-shadow-md text-emerald-500" />
                <div className="flex flex-col text-start">
                    <p>4390</p>
                    <p>Horas Promedio por Baja</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 h-20 items-center w-full py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-purple-500  p-2 rounded-md">
                <FaExclamationTriangle className="text-4xl drop-shadow-md text-purple-500" />
                <div className="flex flex-col text-start">
                    <p>24</p>
                    <p>Neumáticos Nuevos Utilizados</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 h-20 items-center w-full py-4 bg-neutral-50 dark:bg-neutral-900 border-2 border-red-500  p-2 rounded-md">
                <FaExclamationTriangle className="text-4xl drop-shadow-md text-red-500" />
                <div className="flex flex-col text-start">
                    <p>10</p>
                    <p>Alertas</p>
                </div>
            </div>
        </section>
    )
}