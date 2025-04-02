'use client';
import { useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import CustomModal from "@/components/ui/alerts/alert";
import Modal from "@/components/ui/modal/customModal";

export default function Page() {
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const medidasNeumaticosIniciales = [
        { pos: 1, ext: 78, int: 78, pre: 78, tem: 78 },
        { pos: 2, ext: 78, int: 78, pre: 78, tem: 78 },
        { pos: 3, ext: 78, int: 78, pre: 78, tem: 78 },
        { pos: 4, ext: 78, int: 78, pre: 78, tem: 78 },
        { pos: 5, ext: 78, int: 78, pre: 78, tem: 78 },
        { pos: 6, ext: 78, int: 78, pre: 78, tem: 78 },
    ];

    const [nuevasMedidas, setNuevasMedidas] = useState([...medidasNeumaticosIniciales]);

    const handleInputChange = (index: number, field: string, value: number) => {
        const valorOriginal = medidasNeumaticosIniciales[index][field as keyof typeof medidasNeumaticosIniciales[0]];


        if (value > valorOriginal && field !== "tem" && field !== "pre") {
            setError(`La goma remanente no puede ser mayor a la original (${valorOriginal})`);
        } else {
            setNuevasMedidas((prev) =>
                prev.map((neumatico, i) =>
                    i === index ? { ...neumatico, [field]: value } : neumatico
                )
            );
        }

    };

    const handleResetRow = (index: number) => {
        setNuevasMedidas((prev) =>
            prev.map((neumatico, i) =>
                i === index ? { ...medidasNeumaticosIniciales[index] } : neumatico
            )
        );
    };

    const handleConfirm = () => {
        setIsOpen(false);
        console.log("Datos a enviar:", nuevasMedidas);
    };

    return (
        <div className="font-mono h-screen lg:h-[100%] gap-y-2">
            <h1 className="text-2xl font-bold mb-2 border-b border-b-amber-200">Registrar Mediciones</h1>

            <section className='h-screen'>
                <div>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Ingrese código del equipo:</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>

                <div className="overflow-x-auto mt-4 w-[100%]">

                    <div className='flex justify-between'>
                        <h2 className="text-lg font-semibold text-black dark:text-white">Medición Anterior del Equipo</h2>
                        <p className="text-black dark:text-white font-semibold text-lg">Fecha: 29/03/2025</p>
                    </div>
                    <small className="text-gray-700 dark:text-white text-xs">*Datos erróneos no serán aceptados por el sistema, <span className='font-bold'>Verifique sus datos</span></small>
                    <table className="w-full shadow-md rounded-lg h-[50%]">
                        <thead >
                            <tr className="bg-amber-200 text-black">
                                <th className="px-2 py-2 text-left">Pos</th>
                                <th className="px-2 py-2 text-center">Ext</th>
                                <th className="px-2 py-2 text-center">Int</th>
                                <th className="px-2 py-2 text-center">Pre.</th>
                                <th className="px-2 py-2 text-center">Tem.</th>
                                <th className="px-2 py-2 text-center">Res.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nuevasMedidas.map((neumatico, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="px-2 py-2 text-center">{neumatico.pos}</td>
                                    {["ext", "int", "pre", "tem"].map((field) => (
                                        <td key={field} className="px-1 py-2 text-center">
                                            <div className="inline-flex items-center justify-center gap-1">
                                                {/* Botón de disminuir */}
                                                <button
                                                    onClick={() => handleInputChange(index, field, neumatico[field as keyof typeof neumatico] - 1)}
                                                    className="bg-amber-100 border-2 border-amber-500 text-black p-2 rounded-lg text-sm"
                                                >
                                                    -
                                                </button>

                                                {/* Input numérico */}
                                                <input
                                                    type="number"
                                                    value={neumatico[field as keyof typeof neumatico]}
                                                    onChange={(e) => handleInputChange(index, field, parseFloat(e.target.value) || 0)}
                                                    className="w-16 text-center bg-gray-50 dark:bg-[#414141] rounded-lg border p-2"
                                                />

                                                {/* Botón de aumentar */}
                                                <button
                                                    onClick={() => handleInputChange(index, field, neumatico[field as keyof typeof neumatico] + 1)}
                                                    className="bg-amber-300 text-black p-2 rounded-lg text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    ))}
                                    <td className="px-2 py-2 text-center">
                                        <button
                                            onClick={() => handleResetRow(index)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 mx-auto"
                                        >
                                            <FaRedo /> Reset
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Observaciones:</label>
                    <textarea className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>

                <div className='flex gap-x-4 justify-around'>
                    <button onClick={() => setIsOpen(true)} className="bg-amber-300 text-black w-48 px-4 font-bold py-2 rounded-lg mt-4">Confirmar Datos</button>
                    <button className="bg-amber-50 border border-black font-bold text-black w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>

            </section>

            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}
        </div>
    );
}
