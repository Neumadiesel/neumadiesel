'use client';
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaFileAlt } from "react-icons/fa";


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Modal from "@/components/common/modal/CustomModal";
import Button from "@/components/common/button/Button";
import ModalProgramaMantenimiento from "@/components/features/mantenimiento/ModalProgramaMantenimiento";

import { CheckCircle, CircleX } from "lucide-react";
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuthFetch } from "@/utils/AuthFetch";
import { useAuth } from "@/contexts/AuthContext";

interface ProgramasDTO {
    id: number;
    description: string;
    scheduledDate: string;
    vehicle: {
        id: number;
        code: string;
    }
    tyreCode: string;
    date: string;
    status?: string; // Programada, En ejecución, Completada, Cancelada
    scheduledTime?: number; // Time in hours for the scheduled maintenance
    workDate?: string; // Date when the maintenance work was actually performed
    siteId?: number; // ID of the site where the maintenance is scheduled
}

export default function Programas() {
    const authFetch = useAuthFetch();
    const { user } = useAuth();
    const client = useAxiosWithAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [programMaintenance, setProgramMaintenance] = useState<ProgramasDTO[]>([]);
    const [startDate, setStartDate] = useState(new Date()); // NUEVO: fecha base

    const exportToExcel = async () => {
        const table = document.querySelector("table") as HTMLTableElement;
        if (!table) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Programa");


        const fechaInicio = new Date(startDate).toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })

        const fechaFin = new Date(startDate);
        fechaFin.setDate(fechaFin.getDate() + 6);
        const formattedFechaFin = fechaFin.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        // Título
        worksheet.addRow([`Programa Semana ${fechaInicio} - ${formattedFechaFin}`]);
        worksheet.mergeCells('A1:C1'); // Ajusta si tienes más o menos columnas
        const titleCell = worksheet.getCell('A1');
        titleCell.font = { size: 14, bold: true };
        titleCell.alignment = { horizontal: 'center' };

        // Leer encabezados y encontrar el índice de la columna "Acciones"
        const ths = Array.from(table.querySelectorAll("thead th"));
        const headers = ths.map(th => th.textContent ?? "");
        const accionIndex = headers.findIndex(h => h.toLowerCase().includes("acciones"));

        // Filtrar encabezados
        const filteredHeaders = headers.filter((_, i) => i !== accionIndex);
        const headerRow = worksheet.addRow(filteredHeaders);

        // Estilos de encabezado
        headerRow.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' },
            };
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Filtrar y agregar filas
        const rows = Array.from(table.querySelectorAll("tbody tr")).map(row =>
            Array.from(row.querySelectorAll("td"))
                .filter((_, i) => i !== accionIndex)
                .map(td => td.textContent)
        );
        rows.forEach(row => worksheet.addRow(row));

        // Ajustar ancho automático
        worksheet.columns.forEach(column => {
            let maxLength = 10;
            column.eachCell?.({ includeEmpty: true }, (cell) => {
                const len = cell.value?.toString().length ?? 0;
                if (len > maxLength) maxLength = len;
            });
            column.width = maxLength + 2;
        });

        // Descargar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, ` "programa_mantenimiento_semana_${fechaInicio}_${formattedFechaFin}.xlsx`);
    };




    // NUEVO: función para rango de 7 días desde fecha base
    function getRangoDeFechas(fecha: Date): string {
        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);

        const fin = new Date(inicio);
        fin.setDate(inicio.getDate() + 6);
        fin.setHours(23, 59, 59, 999);

        const formatear = (fecha: Date) =>
            fecha.toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "short"
            });

        return `${formatear(inicio)} - ${formatear(fin)}`;
    }

    function formatearFechaLocal(fecha: Date): string {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${año}-${mes}-${dia}T00:00:00.000`;
    }

    function formatearFechaFinUTC(fecha: Date): string {
        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);
        return fin.toISOString(); // Devuelve en formato UTC con la Z
    }

    const handleDeleteProgram = async (id: number) => {
        try {
            setLoading(true);
            const response = await client.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/${id}`);
            fetchData();
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar el programa:", error);
        }
    };

    const handleConfirm = () => {
        setIsOpen(false);
    };

    const fetchData = async () => {
        const fechaInicio = new Date(startDate);
        const fechaFin = new Date(startDate);
        fechaFin.setDate(fechaInicio.getDate() + 6);

        const isoInicio = formatearFechaLocal(fechaInicio);
        const isoFin = formatearFechaFinUTC(fechaFin);

        try {
            console.log("Fechas:", isoInicio, isoFin);
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/time-period/${isoInicio}/${isoFin}`);
            const data = await response.json();
            console.log("Programas", data);
            setProgramMaintenance(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching:", error);
        }

    }

    useEffect(() => {
        fetchData();
    }, [startDate, isOpenModal, user]);



    return (
        <div className="bg-[#f1f1f1] dark:bg-[#313131]">
            <div className="lg:p-3 bg-white dark:bg-[#212121] dark:text-white h-[95%]">
                <div className="flex flex-col gap-y-2 p-2">
                    <section className="lg:flex items-center justify-between gap-x-2">
                        <h1 className="text-2xl   font-bold">Programa Semanal de Mantenciones</h1>

                    </section>

                    <section className="lg:flex gap-y-2 items-center justify-between gap-x-2 md:w-[100%] mx-auto lg:mx-0">
                        <div className="flex items-center w-[100%] lg:w-[50%]">
                            <button
                                className="bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 border dark:border-neutral-700 hover:bg-gray-200 font-bold py-1 px-2 rounded-l-md h-10"
                                onClick={() =>
                                    setStartDate(prev => {
                                        const nueva = new Date(prev);
                                        nueva.setDate(prev.getDate() - 7);
                                        return nueva;
                                    })
                                }
                            >
                                <FaAngleLeft className="text-2xl" />
                            </button>
                            <div className="text-center bg-gray-50 dark:bg-neutral-800   dark:border-neutral-700 border-y p-2 px-4 w-[80%] md:my-2 md:w-[60%] lg:w-[40%] flex justify-around items-center h-10">
                                <p className="text-lg text-gray-600 dark:text-gray-300">{getRangoDeFechas(startDate)}</p>
                            </div>
                            <button
                                className="bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700  dark:border-neutral-700 border hover:bg-gray-200 text-black dark:text-white font-bold py-1 px-2 rounded-r-md h-10"
                                onClick={() =>
                                    setStartDate(prev => {
                                        const nueva = new Date(prev);
                                        nueva.setDate(prev.getDate() + 7);
                                        return nueva;
                                    })
                                }
                            >
                                <FaAngleRight className="text-2xl" />
                            </button>
                        </div>
                        <div className="flex gap-x-2">

                            <Button
                                disabled={loading}
                                text="Agregar Mantenimiento"
                                onClick={() => { setIsOpenModal(true); }}
                            />
                            <Button
                                disabled={loading}
                                text="Descargar Programa"
                                onClick={exportToExcel}
                            />
                        </div>
                    </section>
                </div>

                <div className="relative overflow-x-auto h-[85%] my-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-lg rounded-t-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-amber-300 text-center">
                            <tr>
                                <th scope="col" className="px-6 py-3">Equipo</th>
                                <th scope="col" className="px-6 py-3">Motivo</th>
                                <th scope="col" className="px-6 py-3">Neumático</th>
                                <th scope="col" className="px-2 py-3">Programado</th>
                                <th scope="col" className="px-6 py-3 w-32">Realizado</th>
                                <th scope="col" className="px-6 py-3 w-32">Estado</th>
                                <th scope="col" className="px-6 py-3 w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programMaintenance.length === 0 ? (
                                <tr className="text-center">
                                    <td colSpan={7} className="py-4 h-[60vh]">
                                        <div className="flex flex-col items-center justify-center gap-y-4">
                                            <FaFileAlt size={96} />
                                            <p className="text-lg">No hay mantenimientos programados para este rango.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                programMaintenance.map((programa, index) => (
                                    <tr key={index} className="bg-gray-50 dark:bg-neutral-800 h-16 dark:text-white border-b text-center border-gray-200 dark:border-neutral-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium">{programa.vehicle.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 bg-white dark:bg-neutral-800 py-4 whitespace-nowrap">
                                            <div className="text-sm">{programa.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">{programa.tyreCode}</div>
                                        </td>
                                        <td className="px-6 bg-white dark:bg-neutral-800 py-4 whitespace-nowrap">
                                            <div className="text-sm">{new Date(programa.scheduledDate).toLocaleDateString("es-CL", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            })}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">{programa.workDate
                                                ? new Date(programa.workDate).toLocaleDateString("es-CL", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                })
                                                : "—"}</div>
                                        </td>
                                        <td className="px-6 bg-white dark:bg-neutral-800 py-4 whitespace-nowrap">
                                            <div className="text-sm">{programa.status}</div>
                                        </td>
                                        <td className="px-6  py-4 whitespace-nowrap">
                                            <div className="text-sm flex justify-center items-center">
                                                {/* button check */}
                                                <button className="text-emerald-500 hover:text-emerald-600 font-bold rounded-full p-1 transition-all mr-2" onClick={() => setIsOpenModal(true)}>
                                                    <CheckCircle size={25} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-600 font-bold rounded-full p-1 transition-all" onClick={() => handleDeleteProgram(programa.id)}>
                                                    <CircleX size={25} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <LoadingSpinner isOpen={loading} />

                <ModalProgramaMantenimiento
                    visible={isOpenModal}
                    onClose={() => setIsOpenModal(false)}
                    onGuardar={() => { setIsOpenModal(false) }}
                />

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>
            </div>
        </div>
    );
}
