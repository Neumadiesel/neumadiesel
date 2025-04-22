import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const faena = {
    nombre: "Faena 1",
    region: "Region 1",
    inicio: new Date("2024-01-01"),
    fin: new Date("2024-01-01"),
};

export default function Page() {
    return (
        <div>
            <h1 className="text-3xl font-bold">Faena {faena.nombre}</h1>
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <div className="flex flex-col gap-2">
                    <span className="text-md text-gray-600 font-semibold flex items-center gap-2">
                        <FaMapMarkerAlt /> Región: {faena.region}
                    </span>
                    <span className="text-md text-gray-600 font-semibold flex items-center gap-2">
                        <FaCalendarAlt className="text-xl" />
                        <div className="flex flex-col gap-1">
                            <span>Inicio: </span>
                            <span className="text-xl font-bold text-black">
                                {faena.inicio.toLocaleDateString()}
                            </span>
                        </div>
                        <FaCalendarAlt className="text-xl ml-4" />
                        <div className="flex flex-col gap-1">
                            <span>Fecha: </span>
                            <span className="text-xl font-bold text-black">
                                {faena.fin.toLocaleDateString()}
                            </span>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    );
}
