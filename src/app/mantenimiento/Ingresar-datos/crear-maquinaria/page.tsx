import { FaCross } from "react-icons/fa"
import { FaCircleMinus } from "react-icons/fa6"

export default function page() {
    const neumaticos = [
        {
            id: 1,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 2,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 3,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 4,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 5,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 6,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        }

    ]
    return (
        <main className=" flex gap-x-4">
            <div className="font-mono p-5 gap-y-5">
                <h1 className="text-2xl font-bold mb-4 border-b border-b-amber-200">Registrar Maquinaria</h1>
                <div className="flex flex-col">
                    <label htmlFor="" className="font-semibold">Tipo de Maquinaria:</label>
                    <select className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" >
                        <option value="volvo">Camion Extractor</option>
                        <option value="saab">Camion Aljibe </option>
                        <option value="mercedes">Wheeldozer</option>
                        <option value="audi">Motoniveladora</option>
                    </select>
                </div>
                <div className="flex flex-col my-2">
                    <label htmlFor="" className="font-semibold">Modelo del neumatico:</label>
                    <select className="bg-amber-50 border-amber-300 border rounded-md w-full outline-amber-400 py-2 px-4" >
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                    </select>
                </div>
                <section className="flex gap-x-4 my-4">

                    <div className=" flex flex-col">
                        <label htmlFor="" className="font-semibold">Codigo:</label>
                        <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                    </div>
                    <div className=" flex flex-col">
                        <label htmlFor="" className="font-semibold">Faena:</label>
                        <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                    </div>
                </section>
                <section className="flex gap-x-4 my-4">
                    <div className=" flex flex-col">
                        <label htmlFor="" className="font-semibold">Codigo Nuematico: </label>
                        <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                    </div>
                    <div className=" flex flex-col w-[100%]">
                        <label htmlFor="" className="font-semibold"><small>Agregue Neumaticos</small></label>
                        <button className="bg-amber-300 text-black font-semibold rounded-md p-2 ">Agregar</button>
                    </div>
                </section>
                <div>
                    <button className="bg-amber-300 text-black font-semibold rounded-md p-2">Crear Modelo</button>
                </div>
            </div>
            {/* Lista de neumaticos */}
            <aside className="bg-amber-50 border border-amber-200 h-[60%] rounded-lg p-3 shadow-sm w-[50vh] mt-10 mr-4">
                <h1 className="font-mono font-bold text-xl">Neumaticos</h1>
                <div className="flex  flex-col justify-around items-center h-[80%] mt-5 bg-white">
                    {
                        neumaticos.map((neumatico, index) => (
                            <div key={index} className="bg-white border-b border-b-amber-200 flex justify-between p-2 h-24 w-[100%] gap-x-2 items-center ">
                                <p className="text-md font-bold font-mono ">{neumatico.serie}</p>
                                <p className="text-md font-bold font-mono ">{neumatico.marca}</p>
                                <p className="text-md font-bold font-mono ">{neumatico.modelo}</p>
                                <p className="text-md font-bold font-mono ">{neumatico.remanente}</p>
                                <button>
                                    <FaCircleMinus className="text-3xl text-black hover:text-red-500 ease-in-out transition-all" />
                                </button>
                            </div>
                        ))
                    }
                </div>
            </aside>
        </main>
    )
}