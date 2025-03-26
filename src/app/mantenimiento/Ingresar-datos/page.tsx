export default function page() {
    return (
        <div className="font-mono p-5 gap-y-5">
            <h1 className="text-2xl font-bold mb-4 border-b border-b-amber-200">Crear Neumatico nuevo</h1>
            <div className="flex flex-col">
                <label htmlFor="" className="font-semibold">Modelo del neumatico:</label>
                <select className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" >
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="audi">Audi</option>
                </select>
            </div>
            <section className="flex gap-x-4 my-4">

                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Serie:</label>
                    <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Codigo:</label>
                    <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
            </section>
            <section className="flex gap-x-4 my-4">
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Codigo Camion: <small>(opcional)</small></label>
                    <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
                <div className=" flex flex-col">
                    <label htmlFor="" className="font-semibold">Remanente Original:</label>
                    <input type="text" className="bg-amber-50 border-amber-300 border rounded-md outline-amber-400 py-2 px-4" />
                </div>
            </section>
            {/* Posicion */}
            <div>
                <button className="bg-amber-300 text-black font-semibold rounded-md p-2">Crear Modelo</button>
            </div>
        </div>
    )
}