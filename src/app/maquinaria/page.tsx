import Link from "next/link"
import data from "../../mocks/mocks.json";

export default function ListaMaquinaria() {
    const maquinas = data.Vehiculo;
    const flotas = data.FlotaPorCircuito;
    const flotaPorCircuito = data.FlotaPorCircuito;
    const faenas = data.Faena;
    const circuitos = data.Circuito;
    const vehiculosPorFlota = data.VehiculosPorFlota

    const obtenerInfoVehiculos = () => {
        return maquinas.map((vehiculo) => {
            const relacion = vehiculosPorFlota.find((vpf) => vpf.id_vehiculo === vehiculo.id);
            const faena = faenas.find((f) => f.id === relacion?.id_faena);
            const circuito = circuitos.find((c) => c.id_faena === faena?.id);

            return {
                ...vehiculo,
                faena: faena?.compania || "Desconocida",
                circuito: circuito?.nombre || "No asignado",
            };
        });
    };

    return (
        <div className=" p-4 h-screen w-full mb-4 rounded-md bg-white text-white relative shadow-md font-mono">
            {/* Titulo y acceso a ver mas */}
            <div className="flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Lista Maquinaria</h2>
            </div>
            <div className=" text-black">
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Modelo</th>
                            <th className="px-4 py-2">Faena</th>
                            <th className="px-4 py-2">Circuito</th>
                            <th className="px-4 py-2">Ruedas</th>
                            <th className="px-4 py-2">Horometro</th>
                            <th className="px-4 py-2">Aro</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obtenerInfoVehiculos().map(maquina => (
                            <tr key={maquina.id}>
                                <td className="border px-4 py-2">{maquina.id}</td>
                                <td className="border px-4 py-2">{maquina.modelo}</td>
                                <td className="border px-4 py-2">{maquina.faena}</td>
                                <td className="border px-4 py-2">{maquina.circuito}</td>
                                <td className="border px-4 py-2">{maquina.cant_ruedas}</td>
                                <td className="border px-4 py-2">{maquina.horometro}</td>
                                <td className="border px-4 py-2">{maquina.aro}</td>
                                <td className="border px-4 py-2">
                                    <Link href={`/maquinaria/${maquina.id}`} className="text-black text-lg"> Info. Detallada</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}