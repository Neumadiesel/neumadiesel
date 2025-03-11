import { GiMineTruck } from "react-icons/gi";
import Image from "next/image";
export default function ListaAlertas() {
    return (
        <div className="w-full">
            <ul className=" h-full">
                <li className="flex items-center justify-between space-x-2 bg-slate-200  rounded-md mb-4">
                    <div className="bg-red-300 rounded-md flex items-center justify-center p-2 w-[20%]">
                        <GiMineTruck size={50} />
                    </div>
                    <div className="px-2 text-end">
                        <p className="font-semibold text-lg">Camion 795F RTR324 </p>
                        <span className=" text-sm">Neumaticos delanteros </span>
                    </div>
                </li>
                <li className="flex items-center justify-between space-x-2 bg-slate-200  rounded-md mb-4">
                    <div className="bg-amber-300 rounded-md flex items-center justify-center p-2 w-[20%]">
                        <Image src="/neumatico.png" alt="logo" width={40} height={40} />
                    </div>
                    <div className="px-2 text-end">
                        <p className="font-semibold text-lg">Neumatico FKJ294 </p>
                        <span className=" text-sm">Horas de por cumplir </span>
                    </div>
                </li>
            </ul>
        </div>
    )
}