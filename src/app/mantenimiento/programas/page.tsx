'use client'
import { useState } from "react";
import { programa_mantenimiento } from "@/mocks/programa.json";
import { FaAngleLeft, FaAngleRight, FaFileAlt, FaFileDownload, FaPen, FaPlusCircle } from "react-icons/fa";
import Link from "next/link";
import * as XLSX from "xlsx";
import { FaCircleXmark } from "react-icons/fa6";
import Modal from "@/components/common/modal/CustomModal";

export default function Programas() {

    const [isOpen, setIsOpen] = useState(false);
    const exportToExcel = () => {
        const table = document.querySelector("table");
        if (!table) return;

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Ajustar el ancho de la columna "Motivo" (según su índice, aquí es la columna B -> índice 1)
        worksheet["!cols"] = [
            { wch: 15 }, // Columna A (Ejemplo)
            { wch: 40 }, // Columna B (Motivo) - Ajustada para más espacio
            { wch: 15 }, // Columna C
            { wch: 15 }, // Columna D
            { wch: 15 }  // Columna E
        ];

        // Insertar una fila superior como título
        XLSX.utils.sheet_add_aoa(worksheet, [["Programa Semana"]], { origin: "A1" });

        // Aplicar estilo a la primera fila (Encabezados)
        const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                fill: { fgColor: { rgb: "FFFF00" } }, // Fondo amarillo
                font: { bold: true } // Texto en negrita
            };
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "Programa");
        XLSX.writeFile(workbook, "programa_mantenimiento.xlsx");
    };

    function getRangoDeFechas(semana: number): string {
        const inicioDelAnio = new Date(new Date().getFullYear(), 0, 1); // 1 de enero
        const diaInicioSemana = new Date(inicioDelAnio.getTime() + (semana - 1) * 7 * 24 * 60 * 60 * 1000);

        const diaFinSemana = new Date(diaInicioSemana);
        diaFinSemana.setDate(diaInicioSemana.getDate() + 6);

        const formatear = (fecha: Date) =>
            fecha.toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "short",
            });

        return `${formatear(diaInicioSemana)} - ${formatear(diaFinSemana)}`;
    }

    const handleConfirm = () => {
        setIsOpen(false); // Cerrar modal después de la acción
    };


    const [semana, setSemana] = useState(12);
    return (
        <div className="bg-[#f1f1f1] dark:bg-[#313131] lg:p-4 h-screen">
            <div className=" lg:p-4 bg-white dark:bg-[#212121] rounded-md shadow-lg h-[95%]" >

                <div className="flex flex-col gap-y-2 p-2">

                    <section className="lg:flex items-center justify-between gap-x-2">
                        <h1 className="text-2xl font-mono font-bold">Programa Semanal de Mantenciones</h1>

                        <div className="flex justify-center items-center w-[100%] lg:w-[50%]">
                            <button className="bg-amber-300 text-black font-bold py-1 px-2 rounded-l-md h-10" onClick={() => setSemana(semana - 1)}>
                                <FaAngleLeft className="text-2xl" />
                            </button>
                            <div className="text-center bg-gray-100 p-2 px-4 w-[80%] md:my-2 md:w-[60%] lg:w-[60%] flex justify-around items-center h-10">
                                <p className="text-md font-mono ">Semana {semana}</p>
                                <p className="text-lg text-black font-semibold dark:text-gray-300">{getRangoDeFechas(semana)}</p>
                            </div>
                            <button className="bg-amber-300 text-black font-bold py-1 px-2 rounded-r-md h-10" onClick={() => setSemana(semana + 1)}>
                                <FaAngleRight className="text-2xl" />
                            </button>
                        </div>
                    </section>
                    <div>
                        {/* botones de agregar mantenimientio y descargar */}
                        <section className="lg:flex gap-y-2 items-center justify-between gap-x-2 md:w-[70%] mx-auto lg:mx-0">

                            <Link href="/mantenimiento/programar-mantenimiento" className="bg-amber-300 lg:w-[50%] text-black text-lg font-bold h-10 px-4 rounded-md hover:bg-amber-200 transition-all flex justify-center gap-x-2 items-center"
                            >
                                <FaPlusCircle className="text-2xl" />
                                Agregar Mantenimiento
                            </Link>
                            <button
                                className="bg-amber-50 border border-amber-300 flex w-[100%] my-2 lg:w-[50%] justify-center items-center h-10 gap-x-2 text-black font-bold py-4 px-4 rounded-md hover:bg-amber-100 transition-all"
                                onClick={exportToExcel}
                            >
                                <FaFileDownload className="text-2xl" />
                                <p>Descargar</p>
                            </button>
                        </section>

                    </div>


                </div>
                {/* Programa semanal */}
                <div className="relative overflow-x-auto h-[85%] my-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-lg rounded-t-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Equipo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Motivo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Dia
                                </th>
                                <th scope="col" className="px-2 py-3">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                programa_mantenimiento.length === 0 && (
                                    <tr className="text-center">
                                        <td colSpan={6} className="py-4 h-[60vh] ">
                                            <div className="flex flex-col items-center justify-center gap-y-4">

                                                <FaFileAlt size={96} />
                                                <p className="text-lg">

                                                    No hay mantenimientos programados para esta semana.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            {
                                programa_mantenimiento.map((programa, index) => (
                                    <tr key={index} className="bg-[#f1f1f1] dark:bg-[#0b0a0a] h-16 dark:text-white border-b text-center hover:bg-slate-100 dark:hover:bg-gray-800 ease-in transition-all border-gray-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium ">{programa.equipo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm ">{programa.motivo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm ">{programa.dia}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm ">{programa.fecha}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm flex justify-between items-center ">
                                                <button
                                                    className=" text-red-500 hover:text-red-600 font-bold  rounded-full p-1  transition-all"
                                                    onClick={() => {
                                                        setIsOpen(true);
                                                    }}
                                                >
                                                    <FaCircleXmark size={25} />

                                                </button>
                                                <Link href={"/mantenimiento/programar-mantenimiento"}
                                                    className=" text-amber-300 hover:text-amber-400 font-bold  rounded-full p-1  transition-all"

                                                >
                                                    <FaPen size={25} />

                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>
            </div>
        </div>
    )
}