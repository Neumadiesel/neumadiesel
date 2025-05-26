

export default function CaracteristicasNeumatico() {
    return (
        <div className="w-[100%] p-2 flex">
            <section className=" h-[100%] p-2  w-[30%] ">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="font-bold">Marca:</label>
                        <p className="text-gray-500">Bridgeston</p>
                    </div>
                    <div>
                        <label className="font-bold">Medidas:</label>
                        <p className="text-gray-500">46/90R57</p>
                    </div>
                    <div>
                        <label className="font-bold">Banda de rodado:</label>
                        <p className="text-gray-500">VRWP E3A E</p>
                    </div>
                    <div>
                        <label className="font-bold">Current tread:</label>
                        <p className="text-gray-500">21.5</p>
                    </div>
                    <div>
                        <label className="font-bold">Fecha de instalación:</label>
                        <p className="text-gray-500">10/03/2025</p>
                    </div>
                    <div>
                        <label className="font-bold">OTD:</label>
                        <p className="text-gray-500">97 mm</p>
                    </div>
                </div>
            </section>
            <section className=" h-[100%] p-2  w-[30%] border-x px-4 border-x-slate-300">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-bold">Camión:</label>
                        <p className="text-gray-500">H43</p>
                    </div>
                    <div>
                        <label className="font-bold">Porcentaje usado:</label>
                        <p className="text-gray-500">59%</p>
                    </div>
                    <div>
                        <label className="font-bold">Horas:</label>
                        <p className="text-gray-500">3.910</p>
                    </div>
                    <div>
                        <label className="font-bold">KM:</label>
                        <p className="text-gray-500">59.955</p>
                    </div>
                </div>
            </section>
            <section className=" h-[100%] p-2  w-[30%] border-x px-4 border-x-slate-300">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-bold">Presión:</label>
                        <p className="text-gray-500">32 psi</p>
                    </div>
                    <div>
                        <label className="font-bold">Temperatura:</label>
                        <p className="text-gray-500">20°C</p>
                    </div>
                    <div>
                        <label className="font-bold">Profundidad:</label>
                        <p className="text-gray-500">21.5 mm</p>
                    </div>
                    <div>
                        <label className="font-bold">Estado:</label>
                        <p className="text-gray-500">Bueno</p>
                    </div>
                </div>
            </section>
        </div>
    )
}