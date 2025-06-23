'use client';

import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { TireDTO } from '@/types/Tire';
import { FileDown } from 'lucide-react';

interface UnifiedRecord {
    id: number;
    type: 'inspection' | 'procedure';
    date: string;
    position: number | string;
    description: string;
    internalTread?: number;
    externalTread?: number;
    procedureName?: string;
}

interface Props {
    tireCritical: TireDTO[];
}

export default function ExportOldTyresReport({ tireCritical }: Props) {
    const fetchImageAsBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Neumático');

        // === ESTILOS ===
        const titleStyle: Partial<ExcelJS.Style> = {
            font: { bold: true, size: 18 },
            alignment: { vertical: 'middle', horizontal: 'left' },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFBF00' },
            },
        };

        const subheaderStyle: Partial<ExcelJS.Style> = {
            font: { bold: true },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFBF00' },
            },
            alignment: { horizontal: 'center' },
        };

        const dataStyle: Partial<ExcelJS.Style> = {
            font: { color: { argb: 'FF000000' } },
            alignment: { vertical: 'middle', horizontal: 'left' },
        };

        const infoRowStyle: Partial<ExcelJS.Style> = {
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFFFF' },
            },
        };

        // === CABECERA: TEXTO Y LOGO ===
        const titleCell = sheet.getCell('A1');
        titleCell.value = `Información de Neumáticos Críticos`;
        titleCell.style = titleStyle;
        sheet.getRow(1).height = 44;

        ['B1', 'C1', 'D1', 'E1'].forEach((cellRef) => {
            const cell = sheet.getCell(cellRef);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFBF00' },
            };
        });

        const base64 = await fetchImageAsBase64('/NEUMASYSTEM.png');
        const imageId = workbook.addImage({ base64, extension: 'png' });
        sheet.addImage(imageId, {
            tl: { col: 3, row: 0 },
            ext: { width: 240, height: 80 },
        });
        const emptyRowInitial = sheet.addRow(['', '', '', '', '']);
        emptyRowInitial.eachCell(cell => {
            cell.style = infoRowStyle;
        });

        // // === INFO GENERAL ===
        // const infoRows = [
        //     ['Marca', tire.model.brand, 'Patrón', tire.model.pattern, ''],
        //     ['Código', tire.model.code, 'Medidas', tire.model.dimensions, ''],
        //     ['OTD', tire.initialTread, '', '', ''],
        //     ['Desgaste Interior', tire.lastInspection?.internalTread || 'N/A', 'Desgaste Exterior', tire.lastInspection?.externalTread || 'N/A', ''],
        //     ['Kilometraje', tire.lastInspection?.kilometrage || 'N/A', 'Horas', tire.lastInspection.hours?.toString() || 'N/A', ''],
        //     ['Ubicación', tire.location.name, 'Código Vehículo', tire.installedTires[0]?.vehicle.code || 'N/A', ''],
        //     ['Posición', tire.installedTires[0]?.position?.toString() || 'N/A', '', '', '']
        // ];

        // infoRows.forEach(row => {
        //     const infoRow = sheet.addRow(row);
        //     infoRow.eachCell((cell) => {
        //         cell.style = { ...dataStyle, ...infoRowStyle };
        //     });
        // });

        const emptyRow = sheet.addRow(['', '', '', '', '']);
        emptyRow.eachCell(cell => {
            cell.style = infoRowStyle;
        });

        // // === SECCIÓN MOVIMIENTOS ===
        // const historyTitleRow = sheet.addRow(['Historial de Movimientos', '', '', '', '']);
        // historyTitleRow.eachCell(cell => {
        //     cell.style = titleStyle;
        // });

        // // Unir las primeras 5 columnas para el título
        // sheet.mergeCells(`A${historyTitleRow.number}:E${historyTitleRow.number}`);

        const headerRow = sheet.addRow(['CÓDIGO', 'EQUIPO', 'POSICIÓN', 'HORAS', 'KILOMETRAJE']);
        headerRow.eachCell((cell) => {
            cell.style = subheaderStyle;
        });

        tireCritical.forEach((tire) => {
            const row = sheet.addRow([
                tire.code,
                tire.installedTires[0].vehicle.code,
                tire.lastInspection.position,
                tire.lastInspection.hours,
                tire.lastInspection.kilometrage
            ]);
            row.eachCell((cell, colNumber) => {
                const baseStyle = { ...dataStyle, ...infoRowStyle };

                // Columna Acción (2) y Posición (4)
                if (colNumber === 2 || colNumber === 4) {
                    cell.style = {
                        ...baseStyle,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFeFeFeF' }, // gris más oscuro
                        },
                    };
                } else {
                    cell.style = baseStyle;
                }
            });
        });

        // === AJUSTE DE COLUMNAS ===
        sheet.columns = [
            { width: 65 },
            { width: 20 },
            { width: 20 },
            { width: 15 },
            { width: 20 },
        ];

        // === EXPORTAR ===
        const today = new Date().toISOString().split('T')[0];
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `Resumen_Neumaticos_Críticos-${today}.xlsx`);
    };

    return (
        <button onClick={exportToExcel} className=" bg-amber-300 font-semibold p-2 rounded-sm hover:bg-amber-400 transition-colors">
            <FileDown className="inline mr-2" />
            Exportar Excel
        </button>
    );
}