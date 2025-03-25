import Image from "next/image";
import Link from "next/link";
import CardSensor from "@/components/ui/CardSensor";

export default function Page() {
    return (
        <div className="m-2">
            <main className="bg-white p-4 rounded-md">
                {/* Info del camión */}
                <div className="md:flex justify-between mb-2">
                    <h2 className="text-2xl font-bold mb-2 font-mono">
                        Camión H35 - Faena Saldivar
                    </h2>
                    <div className="flex md:flex-col gap-y-1 justify-between w-[100%] md:w-[40%] items-end gap-x-4">
                        <Link href={`/maquinaria/H36`} className="text-black text-lg w-52 text-center bg-amber-300 p-2 rounded-md border border-black">Neumaticos</Link>
                    </div>
                </div>
                {/* Diagrama */}
                <section className="">
                    <div className="grid grid-cols-5 grid-rows-5 gap-4">
                        <div className="col-span-2 row-span-4 col-start-2 row-start-1 flex justify-center">
                            <Image src="/Axle_gray.png" className="drop-shadow-xl" alt="Esquema" width={300} height={200} />
                        </div>
                        <div className="col-start-1 row-start-1 ">
                            <CardSensor posicion={1} sensor={39412} psi={105} temp={95} />
                        </div>
                        <div className="col-start-4 row-start-1 ">
                            <CardSensor posicion={2} sensor={39412} psi={105} temp={95} />
                        </div>
                        <div className="col-start-2 row-start-5 ">
                            <CardSensor posicion={4} sensor={39412} psi={105} temp={95} />
                        </div>
                        <div className="col-start-3 row-start-5 ">
                            <CardSensor posicion={5} sensor={39412} psi={105} temp={95} />
                        </div>
                        <div className="col-start-4 row-start-4">
                            <CardSensor posicion={6} sensor={39412} psi={105} temp={95} />
                        </div>
                        <div className="col-start-1 row-start-4">
                            <CardSensor posicion={3} sensor={39412} psi={105} temp={95} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}