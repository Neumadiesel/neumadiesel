'use client';
import { useState } from 'react';
import { FaMinusCircle } from 'react-icons/fa';
import CustomModal from "@/components/ui/alerts/alert";
import Modal from "@/components/ui/modal/customModal";


export default function Page() {
    const [error, setError] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    const medidasNeumaticos = [
        {
            pos: 1,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
        {
            pos: 2,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
        {
            pos: 3,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
        {
            pos: 4,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
        {
            pos: 5,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
        {
            pos: 6,
            ext: 78,
            int: 78,
            pre: 78,
            tem: 78,
        },
    ];

    const handleConfirm = () => {
        setIsOpen(false); // Cerrar modal después de la acción
    };

    return (
        <div className="font-mono h-screen md:h-[100%] gap-y-2">
            <h1 className="text-2xl font-bold mb-2 border-b border-b-amber-200">Registrar Mediciones</h1>


            {/* Version movil */}
            <section className='h-screen '>

                <div>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Ingrese codigo del equipo:</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>

                {/* Tabla de los 6 neumaticos */}
                <div className="overflow-x-auto mt-4 w-[100%]">
                    <div className=' flex justify-between'>
                        <h2 className="text-lg font-semibold text-black dark:text-white">Medición Anterior del Equipo</h2>
                        <p className="text-black dark:text-white font-semibold text-lg">Fecha: 29/03/2025</p>
                    </div>
                    <small className="text-gray-700 dark:text-white text-xs">*Datos erroneos no seran aceptados por el sistema, <span className='font-bold'>Verifique sus datos</span></small>
                    <table className="w-full   shadow-md rounded-lg h-[50%]">
                        <thead>
                            <tr className="bg-amber-200 text-black">
                                <th className="  px-2 py-2 text-left">Pos</th>
                                <th className="  px-2 py-2 text-left">Ext</th>
                                <th className="  px-2 py-2 text-left">Int</th>
                                <th className="  px-2 py-2 text-left">Pre.</th>
                                <th className="  px-2 py-2 text-left">Tem.</th>
                                <th className="  px-2 py-2 text-left">Obs.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                medidasNeumaticos.map((neumatico, index) => (
                                    <tr key={index}>
                                        <td className="  px-1 py-2">{neumatico.pos}</td>
                                        <td className="  px-1 py-2">
                                            <input
                                                type="number"
                                                value={neumatico.ext}
                                                onChange={(e) => {
                                                    const updatedValue = parseFloat(e.target.value) || 0;
                                                    medidasNeumaticos[index].ext = updatedValue;
                                                }}
                                                className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300   p-2"
                                            />
                                        </td>
                                        <td className="  px-1 py-2">
                                            <input type="number" value={neumatico.int} className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300   p-2" />
                                        </td>
                                        <td className="  px-1 py-2">
                                            <input type="number" value={neumatico.pre} className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300   p-2" />
                                        </td>
                                        <td className="  px-1 py-2"> <input type="number" value={neumatico.tem} className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300   p-2" /></td>
                                        <td className="  px-1 py-2 flex justify-center items-center">

                                            <FaMinusCircle className="text-2xl text-red-500" />
                                        </td>
                                    </tr>
                                ))


                            }
                        </tbody>
                    </table>
                </div>
                {/* Cuadro de observacion */}
                <div>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Observaciones:</label>
                    <textarea className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                </div>
                {/* Botones */}
                <div className=''>
                    <div className='flex gap-x-4 justify-around'>
                        <button onClick={() => setIsOpen(true)} className="bg-amber-300 text-black w-48 px-4 font-bold py-2 rounded-lg mt-4">Confirmar Datos</button>
                        <button onClick={() => console.log("cancelar")} className="bg-amber-50 border border-black font-bold text-black w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                    </div>
                    <Modal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onConfirm={handleConfirm} // Pasando la función de confirmación
                        title="¿Estás seguro?"
                    >
                        <p>¿Quieres confirmar esta acción?</p>
                    </Modal>
                    <div className='flex justify-between'>
                        <p className="text-gray-400 text-xs mt-2">*Verifique que los datos sean correctos antes de confirmar</p>
                        <p className="text-gray-400 text-xs ml-2">*Los datos se guardarán en la base de datos</p>
                    </div>
                </div>
            </section>

            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}
        </div>
    );
}
