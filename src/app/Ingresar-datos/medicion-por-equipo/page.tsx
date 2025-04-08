'use client';
import { useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import CustomModal from "@/components/ui/alerts/alert";
import Modal from "@/components/ui/modal/customModal";

export default function Page() {
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const medidasNeumaticosIniciales = [
        { pos: 1, ext: 95, int: 93, pre: 78, tem: 78 },
        { pos: 2, ext: 90, int: 88, pre: 78, tem: 78 },
        { pos: 3, ext: 85, int: 83, pre: 78, tem: 78 },
        { pos: 4, ext: 80, int: 78, pre: 78, tem: 78 },
        { pos: 5, ext: 75, int: 73, pre: 78, tem: 78 },
        { pos: 6, ext: 70, int: 68, pre: 78, tem: 78 },
    ];

    const [nuevasMedidas, setNuevasMedidas] = useState([...medidasNeumaticosIniciales]);

    const handleInputChange = (index: number, field: string, value: number) => {
        const valorOriginal = medidasNeumaticosIniciales[index][field as keyof typeof medidasNeumaticosIniciales[0]];

        if (value < 1) {
            setError("El valor no puede ser inferior a 1");
        } else if (value > valorOriginal && field !== "tem" && field !== "pre") {
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
        <div className="font-mono py-5 gap-y-2">
            <h1 className='text-2xl lg:text-3xl mb-2 font-bold'>Ingresar datos de Equipo</h1>
            <section className=''>
                <div className='flex items-center gap-x-2 border-b border-b-amber-300 pb-3'>
                    <label className="text-lg mb-1 text-black font-semibold dark:text-white ">Ingrese código del equipo:</label>
                    <input type="text" className="w-[40%] bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>

                {/* Fecha medicion anterior */}
                <div className='flex justify-between my-2'>
                    <p className="text-sm text-gray-700 dark:text-white">Ultima medición del equipo <span className='font-semibold'>29/03/2025</span></p>
                </div>
                <div className="overflow-x-auto mt-4 w-[100%]">
                    <div className='flex gap-x-2 justify-between mb-2'>
                        {
                            nuevasMedidas.map((neumatico, index) => (


                                <section key={index} className='border bg-gray-50 border-amber-300 rounded-lg p-2 my-2 py-4 lg:hidden'>
                                    <p className='text-xl font-bold'>Posición {neumatico.pos}</p>
                                    <p className='font-semibold'>Codigo del neumatico: WHE393</p>
                                    <p>Remanente de la goma</p>
                                    {/* Medicion exterior */}
                                    <div className='flex flex-col'>
                                        <div className="flex items-center mt-2 ">
                                            <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Exterior:</label>
                                            {/* Botón de disminuir */}
                                            <button
                                                onClick={() => handleInputChange(0, "ext", neumatico.ext - 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                            >
                                                -
                                            </button>

                                            {/* Input numérico */}
                                            <input
                                                type="number"
                                                value={neumatico.ext}
                                                onChange={(e) => handleInputChange(0, "ext", parseFloat(e.target.value) || 0)}
                                                className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                            />

                                            {/* Botón de aumentar */}
                                            <button
                                                onClick={() => handleInputChange(0, "ext", neumatico.ext + 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* Medicion interior */}
                                        <div className="flex items-center mt-2">
                                            <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Interior:</label>
                                            {/* Botón de disminuir */}
                                            <button
                                                onClick={() => handleInputChange(0, "int", neumatico.int - 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                            >
                                                -
                                            </button>
                                            {/* Input numérico */}
                                            <input
                                                type="number"
                                                value={neumatico.int}
                                                onChange={(e) => handleInputChange(0, "int", parseFloat(e.target.value) || 0)}
                                                className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                            />
                                            {/* Botón de aumentar */}
                                            <button
                                                onClick={() => handleInputChange(0, "int", neumatico.int + 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* medicion presion */}
                                        <div className="flex items-center mt-2">
                                            <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Presión:</label>
                                            {/* Botón de disminuir */}
                                            <button
                                                onClick={() => handleInputChange(0, "pre", neumatico.pre - 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                            >
                                                -
                                            </button>
                                            {/* Input numérico */}
                                            <input
                                                type="number"
                                                value={neumatico.pre}
                                                onChange={(e) => handleInputChange(0, "pre", parseFloat(e.target.value) || 0)}
                                                className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                            />
                                            {/* Botón de aumentar */}
                                            <button
                                                onClick={() => handleInputChange(0, "pre", nuevasMedidas[0].pre + 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* medicion temperatura */}
                                        <div className="flex items-center mt-2">
                                            <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Temperatura:</label>
                                            {/* Botón de disminuir */}
                                            <button
                                                onClick={() => handleInputChange(0, "tem", nuevasMedidas[0].tem - 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                            >
                                                -
                                            </button>
                                            {/* Input numérico */}
                                            <input
                                                type="number"
                                                value={nuevasMedidas[0].tem}
                                                onChange={(e) => handleInputChange(0, "tem", parseFloat(e.target.value) || 0)}
                                                className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                            />
                                            {/* Botón de aumentar */}
                                            <button
                                                onClick={() => handleInputChange(0, "tem", nuevasMedidas[0].tem + 1)}
                                                className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            ))
                        }
                    </div>
                    {/* Tabla version escritorio */}
                    <div className='hidden lg:block w-[100%]'>
                        <table className="w-full shadow-md rounded-lg h-[50%] ">
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
                            <tbody className='bg-gray-50 dark:bg-[#414141] w-[100%]'>
                                {nuevasMedidas.map((neumatico, index) => (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="px-2 py-2 text-center">{neumatico.pos}</td>
                                        {["ext", "int", "pre", "tem"].map((field) => (
                                            <td key={field} className="px-1 py-2 text-center">
                                                <div className="inline-flex items-center justify-center ">
                                                    {/* Botón de disminuir */}
                                                    <button
                                                        onClick={() => handleInputChange(index, field, neumatico[field as keyof typeof neumatico] - 1)}
                                                        className="bg-amber-50 border border-amber-500 text-black p-2 h-12 rounded-l-lg text-sm"
                                                    >
                                                        -
                                                    </button>
                                                    {/* Input numérico */}
                                                    <input
                                                        type="text"
                                                        value={neumatico[field as keyof typeof neumatico]}
                                                        onChange={(e) => handleInputChange(index, field, parseFloat(e.target.value) || 0)}
                                                        className="w-20 text-center bg-white dark:bg-[#414141]  border-y border-y-amber-300 p-2 h-12"
                                                    />

                                                    {/* Botón de aumentar */}
                                                    <button
                                                        onClick={() => handleInputChange(index, field, neumatico[field as keyof typeof neumatico] + 1)}
                                                        className="bg-amber-50 text-black p-2 h-12 rounded-r-lg text-sm border border-amber-500"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                        ))}


                                        <td className="px-2 py-2 text-center">
                                            <button
                                                onClick={() => handleResetRow(index)}
                                                className="bg-red-200 border border-red-500 h-12 w-32 text-black font-semibold px-3 py-1 rounded-lg text-sm flex items-center  justify-center gap-2 mx-auto"
                                            >
                                                <FaRedo /> Deshacer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Observaciones:</label>
                    <textarea className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>

                <div className='lg:flex gap-x-4 lg:justify-around'>
                    <button onClick={() => setIsOpen(true)} className="bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4">Confirmar Datos</button>
                    <button className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>
                <small className="text-gray-700 dark:text-white text-xs">*Datos erróneos no serán aceptados por el sistema, <span className='font-bold'>Recuerde verificar sus datos</span></small>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>

            </section>

            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}
        </div>
    );
}
