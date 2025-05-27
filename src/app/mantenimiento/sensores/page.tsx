import Image from "next/image";
import { Camiones } from "@/mocks/Camiones.json";

export default function Page() {
    return (
        <div className="m-4">
            <main className="bg-white p-4 rounded-md">
                <h1 className="  font-bold text-3xl mb-3 bg-amber-300 p-2 rounded-md">Informe de sensores</h1>
                <div className=" flex gap-x-4">
                    {/* Lista de camiones */}
                    <aside className="w-[30%] rounded-lg h-[70vh] bg-[#212121] p-2">
                        <h2 className="text-2xl text-white font-bold">Maquinaria disponible</h2>
                        <div className="max-h-[90%] overflow-y-scroll">
                            {
                                Camiones.map((camion) => (
                                    <div key={camion.Codigo} className="p-2 bg-amber-300 text-black font-semibold rounded-md my-2">
                                        <p>Camión {camion.Codigo}</p>
                                        <p>Modelo: {camion.Modelo}</p>
                                        <p>Marca: {camion.Marca}</p>
                                    </div>
                                ))

                            }
                        </div>
                    </aside>
                    {/* Diagrama */}
                    <section className="flex justify-center items-center">
                        <div className="grid grid-cols-5 grid-rows-5 gap-4">
                            <div className="col-span-2 row-span-4 col-start-2 row-start-1 flex justify-center">
                                <Image src="/Axle_gray.png" className="drop-shadow-xl" alt="Esquema" width={300} height={200} />
                            </div>
                            <div className="col-start-1 row-start-1 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 1</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                            <div className="col-start-4 row-start-1 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 2</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                            <div className="col-start-2 row-start-5 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 4</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                            <div className="col-start-3 row-start-5 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 5</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                            <div className="col-start-4 row-start-4 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 6</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                            <div className="col-start-1 row-start-4 bg-[#212121] text-white font-bold rounded-md flex flex-col justify-center items-center">
                                <p>Posicion: 3</p>
                                <p><small>Sensor:</small> 39412</p>
                                <p>PSI: 105</p>

                                <p>Temp °C: 95</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}