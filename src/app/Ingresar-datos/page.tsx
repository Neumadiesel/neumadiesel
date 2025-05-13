'use client';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import { FaFileExcel, FaRegFile } from 'react-icons/fa';
import CustomModal from "@/components/common/alerts/alert";
import Modal from "@/components/common/modal/CustomModal";
import axios from 'axios';
import LoadingSpinner from '@/components/common/lodaing/LoadingSpinner';
import ModalResultInspeccion from '@/components/features/inspeccion/ModalResultInspeccion';
interface RegistrosDTO {
    id: number;
    success: boolean;
    error: string;
    equipmentCode: string;
    position: string;
}

type Inspection = {
    date: string;
    equipmentCode: string;
    hubodometer: number;
    position: number;
    externalTread: number;
    internalTread: number;
    temperature: number;
    pressure: number;
};


type InspectionField = "externalTread" | "internalTread" | "temperature" | "pressure";

export default function Page() {
    const [data, setData] = useState<Inspection[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [openRegistros, setOpenRegistros] = useState(false);
    const [openRegistrosMalos, setOpenRegistrosMalos] = useState(false);
    const [registrosCorrectos, setRegistrosCorrectos] = useState<RegistrosDTO[]>([]);
    const expectedSuffixes = {
        "Ext": "externalTread",
        "Int": "internalTread",
        "Tem": "temperature",
        "Pre": "pressure"
    };

    const excelDateToJSDate = (serial: number): string => {
        const excelEpoch = new Date(1900, 0, 1); // 1 de enero de 1900
        const jsDate = new Date(excelEpoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000); // Ajuste por días
        return jsDate.toISOString().split("T")[0]; // Devuelve en formato "YYYY-MM-DD"
    };
    const validateAndTransformExcel = (jsonData: any[]): Inspection[] => {
        const transformed: Inspection[] = [];

        jsonData.forEach((row, rowIndex) => {
            let date = row["Fecha"] || row["fecha"] || row["FECHA"];
            let equipmentCode = row["Código"] || row["codigo"] || row["Código Equipo"] || row["EQUIPO"];
            const hubodometer = row["Hodómetro"] || row["hubodometro"] || row["Hubodometro"];

            if (typeof date === "number") {
                date = excelDateToJSDate(date);
            }

            if (!date || !equipmentCode || hubodometer === undefined) {
                console.warn(`Fila ${rowIndex + 1} omitida por falta de datos generales`);
                return;
            }

            equipmentCode = equipmentCode.toString().toUpperCase().replace(/[-\s]/g, "");

            const grouped: {
                [position: string]: Partial<Inspection> & Pick<Inspection, 'date' | 'equipmentCode' | 'hubodometer'>
            } = {};

            const rowKeys = Object.keys(row);
            for (const key of rowKeys) {
                const match = key.match(/^P(\d+)\s(Ext|Int|Tem|Pre)$/i);
                if (match) {
                    const posNumber = parseInt(match[1]); // 👈 Solo el número
                    const field = expectedSuffixes[match[2] as keyof typeof expectedSuffixes] as InspectionField;
                    if (!grouped[posNumber]) {
                        grouped[posNumber] = {
                            date,
                            equipmentCode,
                            hubodometer: Number(hubodometer),
                            position: posNumber,
                        };
                    }
                    grouped[posNumber][field] = Number(row[key]);
                }
            }

            Object.values(grouped).forEach((entry) => {
                if (
                    entry.externalTread !== undefined &&
                    entry.internalTread !== undefined &&
                    entry.temperature !== undefined &&
                    entry.pressure !== undefined
                ) {
                    transformed.push(entry as Inspection);
                } else {
                    console.warn(`Fila ${rowIndex + 1} incompleta para alguna posición, se omite.`);
                }
            });
        });

        return transformed;
    };



    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const validExtensions = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
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
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    const transformedData = validateAndTransformExcel(jsonData);
                    if (transformedData.length === 0) {
                        throw new Error('El archivo no contiene datos válidos.');
                    }

                    setData(transformedData);
                } catch (err) {
                    console.error(err);
                    setError('Error al procesar el archivo. Asegúrese de que siga el formato correcto.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleCancel = () => {
        setData([]);
    };

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            console.log("Datos a enviar:", data);
            const response = await axios.post('http://localhost:3002/inspections/bulk', data);
            console.log('Inspecciones enviadas exitosamente:', response.data);
            // tengo que destructurar el response.data para recibir solo data.equipmentCode, data.position, success, error
            console.log('Response:', response.data);
            const registros = response.data.map((registro: any, index: number) => {
                const data = registro.success ? registro.inspection : registro.data;

                return {
                    id: index,
                    success: registro.success,
                    error: registro.error ?? registro.message,
                    equipmentCode: data?.equipmentCode,
                    position: data?.position ?? 'N/A',
                };
            });

            setRegistrosCorrectos(registros);
            console.log('Registros:', registros);

            setOpenRegistros(true);
            setData([]); // Limpiar los datos después de enviar
            setError(null); // Limpiar el error si hubo uno
            setLoading(false);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        }

        console.log("Datos listos para enviar:", data);
    };

    return (
        <div className="font-mono h-full gap-y-2 p-3">
            <h1 className="text-2xl font-bold mb-2 border-b border-b-amber-200">Registrar Mediciones</h1>
            <div className='w-full h-[25%]'>
                <div className="w-full py-9 bg-gray-50 dark:bg-[#414141] rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                    <div className="grid gap-1">
                        <FaFileExcel className="mx-auto text-4xl text-gray-500 dark:text-gray-300 " />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex flex-col items-center justify-center">
                            <label className="text-xs mb-1 text-gray-400 dark:text-gray-300">
                                Seleccione un archivo de Excel con columnas como: "P1 Ext", "P1 Int", "P1 Tem", "P1 Pre"
                            </label>
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

            <div className='max-h-[50vh] min-h-[35vh] w-full rounded-lg block overflow-y-scroll'>
                {data.length === 0 ? (
                    <div className="text-center flex pt-10 flex-col justify-center items-center text-gray-400">
                        <FaRegFile className="text-5xl text-gray-500" />
                        <p>No hay datos para mostrar</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto mt-4 w-full">
                        <table className="w-full shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-amber-200 text-black">
                                    <th className="px-2 py-2 text-left">Fecha</th>
                                    <th className="px-2 py-2 text-left">Equipo</th>
                                    <th className="px-2 py-2 text-left">Hodómetro</th>
                                    <th className="px-2 py-2 text-left">Posición</th>
                                    <th className="px-2 py-2 text-left">Ext</th>
                                    <th className="px-2 py-2 text-left">Int</th>
                                    <th className="px-2 py-2 text-left">Temp</th>
                                    <th className="px-2 py-2 text-left">Presión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} className="hover:bg-amber-100 hover:text-black">
                                        <td className="px-2 py-2">{row.date}</td>
                                        <td className="px-2 py-2">{row.equipmentCode}</td>
                                        <td className="px-2 py-2">{row.hubodometer}</td>
                                        <td className="px-2 py-2">{row.position}</td>
                                        <td className="px-2 py-2">{row.externalTread}</td>
                                        <td className="px-2 py-2">{row.internalTread}</td>
                                        <td className="px-2 py-2">{row.temperature}</td>
                                        <td className="px-2 py-2">{row.pressure}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>

            <div className='flex w-full justify-center items-center flex-col'>
                <div className='lg:flex gap-x-4 w-full lg:justify-center'>
                    <button onClick={() => handleConfirm()} className="bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4">
                        Confirmar Datos
                    </button>
                    <button onClick={handleCancel} className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">
                        Cancelar
                    </button>
                </div>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>
                <p className="text-gray-400 text-xs mt-2">*Verifique que los datos sean correctos antes de confirmar</p>
                <p className="text-gray-400 text-xs ml-2">*Los datos se guardarán en la base de datos</p>
            </div>

            {error && <CustomModal isOpen={!!error} onClose={() => setError(null)} title="Error" message={error} />}
            <LoadingSpinner isOpen={loading} />
            <ModalResultInspeccion
                isOpen={openRegistros}
                registros={registrosCorrectos.filter((registro) => registro.success)}
                onClose={() => setOpenRegistros(false)}
                onConfirm={() => { setOpenRegistros(false); setOpenRegistrosMalos(true) }}
                title='Registros ingresados correctamente'
            />
            <ModalResultInspeccion
                isOpen={openRegistrosMalos}
                registros={registrosCorrectos.filter((registro) => !registro.success)}
                onClose={() => setOpenRegistrosMalos(false)}
                onConfirm={() => setOpenRegistrosMalos(false)}
                title='Registros con errores'
            />
        </div>
    );
}
