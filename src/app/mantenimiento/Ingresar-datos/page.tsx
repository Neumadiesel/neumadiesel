'use client';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { FaFileExcel, FaRegFile } from 'react-icons/fa';
import CustomModal from "@/components/ui/alerts/alert";
import Modal from "@/components/ui/modal/customModal";

type RowData = {
    [key: string]: string | number;
};

export default function Page() {
    const [data, setData] = useState<RowData[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const validExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            if (!validExtensions.includes(file.type)) {
                setError('El archivo seleccionado no es un archivo Excel válido.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const result = e.target?.result;
                    if (!result) throw new Error('No se pudo leer el archivo.');

                    const data = new Uint8Array(result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData: RowData[] = XLSX.utils.sheet_to_json<RowData>(worksheet);

                    if (jsonData.length > 0) {
                        setHeaders(Object.keys(jsonData[0]));
                    }
                    setData(jsonData);
                } catch (error) {
                    console.error(error);
                    setError('Error al procesar el archivo. Asegúrese de que sea un Excel válido.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleCancel = () => {
        setData([]);
        setHeaders([]);
    };

    const handleConfirm = () => {
        setIsOpen(false); // Cerrar modal después de la acción
    };

    return (
        <div className="font-mono h-screen md:h-[100%] gap-y-2">
            <h1 className="text-2xl font-bold mb-2 border-b border-b-amber-200">Registrar Mediciones</h1>
            {/* Input de archivos excel */}
            <div className='  w-[100%] h-[25%]'>
                <div className="w-full py-9 bg-gray-50 dark:bg-[#414141] rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                    <div className="grid gap-1">
                        <FaFileExcel className="mx-auto text-4xl text-gray-500 dark:text-gray-300 " />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex flex-col items-center justify-center ">
                            <label className="text-xs mb-1 text-gray-400 dark:text-gray-300 ">Seleccione un archivo de Excel</label>
                            <label>
                                <input type="file" hidden onChange={handleFileUpload} />
                                <div className="flex w-40 h-9 px-2 flex-col bg-amber-300 rounded-full shadow text-black text-xs font-semibold leading-4 items-center text-center justify-center cursor-pointer focus:outline-none">
                                    Seleccione archivo
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lista de datos extraidos del excel */}
            <div className='h-[50%]  block overflow-y-scroll'>
                {data.length === 0 && (
                    <div className="text-center flex pt-10 flex-col justify-center items-center text-gray-400">
                        <FaRegFile className="text-5xl text-gray-500" />
                        <p>No hay datos para mostrar</p>
                    </div>
                )}
                {data.length > 0 && (
                    <div className="overflow-x-auto mt-4 w-[120vh]">
                        <table className="w-full  shadow-md rounded-lg h-[60%]">
                            <thead>
                                <tr className="bg-amber-200 text-black">
                                    {headers.map((key) => (
                                        <th key={key} className=" px-2 py-2 text-left">
                                            {key.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-amber-100 hover:text-black">
                                        {headers.map((key) => (
                                            <td key={key} className=" px-1 py-2">
                                                {row[key] || '—'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className='flex w-[100%] justify-center items-center flex-col'>
                <div className='flex gap-x-4'>
                    <button onClick={() => setIsOpen(true)} className="bg-amber-300 text-black w-48 px-4 font-bold py-2 rounded-lg mt-4">Confirmar Datos</button>
                    <button onClick={handleCancel} className="bg-amber-50 border border-black font-bold text-black w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleConfirm} // Pasando la función de confirmación
                    title="¿Estás seguro?"
                >
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>
                <p className="text-gray-400 text-xs mt-2">*Verifique que los datos sean correctos antes de confirmar</p>
                <p className="text-gray-400 text-xs ml-2">*Los datos se guardarán en la base de datos</p>
            </div>
            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}
        </div>
    );
}
