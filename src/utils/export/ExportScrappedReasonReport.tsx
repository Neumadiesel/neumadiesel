'use client';

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { FileDown } from 'lucide-react';
import { useAuthFetch } from '@/utils/AuthFetch';

interface Props {
    data: any[]; // Tire[]
    processed: any[]; // resultado de useMemo
    selectedReasons: string[];
    year: number;
    semester: string;
}

export default function ExportScrappedReasonsReport({ data, processed, selectedReasons, year, semester }: Props) {
    const authFetch = useAuthFetch();

    const fetchImageAsBase64 = async (url: string): Promise<string> => {
        const response = await authFetch(url);
        if (!response || !response.ok) throw new Error(`Error al obtener imagen: ${response?.statusText}`);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();

        // ========== Hoja 1: Resumen Mensual ==========
        const resumenSheet = workbook.addWorksheet('Resumen Mensual');

        const titleStyle: Partial<ExcelJS.Style> = {
            font: { bold: true, size: 18 },
            alignment: { vertical: 'middle', horizontal: 'left' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFBF00' } },
        };

        const headerStyle: Partial<ExcelJS.Style> = {
            font: { bold: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFBF00' } },
            alignment: { horizontal: 'center' },
        };

        const infoStyle: Partial<ExcelJS.Style> = {
            alignment: { vertical: 'middle', horizontal: 'left' },
        };

        const titleCell = resumenSheet.getCell('A1');
        titleCell.value = `Resumen de Neumáticos Dados de Baja - ${year} S${semester}`;
        titleCell.style = titleStyle;
        resumenSheet.getRow(1).height = 40;

        const base64 = await fetchImageAsBase64('/NEUMASYSTEM.png');
        const imageId = workbook.addImage({ base64, extension: 'png' });
        resumenSheet.addImage(imageId, {
            tl: { col: 4, row: 0 },
            ext: { width: 240, height: 80 },
        });

        resumenSheet.addRow([]);
        resumenSheet.addRow([]);

        const headers = ['Mes'];
        selectedReasons.forEach((motivo) => {
            headers.push(`${motivo} (Horas Prom.)`);
            headers.push(`${motivo} (Cantidad)`);
        });
        const headerRow = resumenSheet.addRow(headers);
        headerRow.eachCell((cell) => (cell.style = headerStyle));

        processed.forEach((entry) => {
            const row = [entry.month];
            selectedReasons.forEach((motivo) => {
                row.push(entry[motivo] ?? 0);
                row.push(entry[`${motivo}_count`] ?? 0);
            });
            const dataRow = resumenSheet.addRow(row);
            dataRow.eachCell((cell) => (cell.style = infoStyle));
        });

        resumenSheet.columns.forEach((col) => (col.width = 20));

        // ========== Hoja 2: Lista de Neumáticos ==========
        const detalleSheet = workbook.addWorksheet('Neumáticos Analizados');

        const detalleHeaders = ['Código', 'Dimensión', 'Fecha Retiro', 'Horas', 'Motivo', 'Modelo de Equipo'];
        detalleSheet.addRow(detalleHeaders).eachCell((cell) => (cell.style = headerStyle));

        data.forEach((tire) => {
            tire.procedures.forEach((p: any) => {
                if (!p.retirementReason?.description) return;

                const date = new Date(p.startDate);
                const yearMatch = date.getFullYear() === year;
                const semMatch = semester === '1' ? date.getMonth() < 6 : date.getMonth() >= 6;
                if (!yearMatch || !semMatch) return;

                detalleSheet.addRow([
                    tire.code,
                    tire.model?.dimensions || '',
                    p.startDate?.split('T')[0],
                    p.tireHours || 0,
                    p.retirementReason.description,
                    p.vehicle?.model?.model || '',
                ]);
            });
        });

        detalleSheet.columns.forEach((col) => (col.width = 22));

        // ========== Exportar ==========
        const fileName = `Reporte_Baja_Neumaticos_${year}_S${semester}.xlsx`;
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, fileName);
    };

    return (
        <button
            onClick={exportToExcel}
            className="bg-green-600 text-white font-semibold p-2 rounded-sm hover:bg-green-700 transition-colors"
        >
            <FileDown className="inline mr-2" />
            Exportar Excel
        </button>
    );
}