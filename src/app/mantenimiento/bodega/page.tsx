

export default function page() {
    return (
        <div className="bg-white m-3 p-3 rounded-md shadow-lg h-[95%] font-mono">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-3xl">Neumaticos en bodega</h2>
                <select className="bg-amber-50 w-[20%] border-amber-300 border rounded-md outline-amber-400 py-2 px-4" >
                    <option value="volvo">Bodega</option>
                    <option value="saab">Baja</option>
                    <option value="mercedes">Recuperados</option>
                    <option value="audi">Reparacion</option>
                </select>
            </div>

        </div>
    )
}