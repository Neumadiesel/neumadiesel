
import * as React from "react";
import ScrapTyres from "@/components/features/res/ScrapTyres";
import OperationalTyres from "@/components/features/res/OperationalTyres";
import OperationalTyresHistograms from "@/components/features/res/OperationalTyresHistograms";
import ScrappedTyresChart from "@/components/features/res/ScrappedTyresChart";
import ScrappedReasonsChart from "@/components/features/res/ScrappedReasonsChart";
import TreadWearChart from "@/components/features/res/TreadWearChart";
import TireHealthChart from "@/components/features/res/TireHealthChart";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
import GraficoCumplimientoPrograma from "@/components/features/mantenimiento/GraficoCumplimientoPrograma";
// import { toPng } from "html-to-image";
// import PatternComparisonChart from "@/components/features/res/PatternComparisonChart";
export default function Page() {

    // const IDs_DE_GRAFICOS = [
    //     "grafico-cumplimiento",
    //     "grafico-bajas",
    //     "grafico-desgaste",
    //     "chart-area",
    //     "grafico-bajo-neumaticos",
    //     "chart-last-inspection",
    // ];

    // const exportarPDF = async () => {
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     let y = 10;

    //     for (const id of IDs_DE_GRAFICOS) {
    //         const element = document.getElementById(id);
    //         if (!element) continue;

    //         element.style.backgroundColor = '#ffffff';

    //         const canvas = await html2canvas(element, {
    //             scale: 2,
    //             useCORS: true,
    //             backgroundColor: null,
    //         });
    //         const imgData = canvas.toDataURL('image/png');

    //         const comentario = element.getAttribute('data-comentario') || 'Sin comentario';
    //         const pageWidth = pdf.internal.pageSize.getWidth();
    //         const pageHeight = pdf.internal.pageSize.getHeight();

    //         const imgProps = pdf.getImageProperties(imgData);
    //         const imgWidth = pageWidth - 20;
    //         const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    //         if (y + imgHeight + 30 > pageHeight) {
    //             pdf.addPage();
    //             y = 10;
    //         }

    //         pdf.setFontSize(12);
    //         pdf.text(comentario, 10, y);
    //         y += 5;
    //         pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
    //         y += imgHeight + 20;
    //     }

    //     pdf.save('informe-graficos.pdf');
    // };

    return (
        <div className="flex flex-col overflow-x-hidden bg-gray-50 dark:bg-[#212121] pt-4  dark:text-white text-center w-full mx-auto gap-y-2 lg:gap-y-6 lg:p-3">

            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className=" grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold ">Reportabilidad de Rendimientos</h1>
                </div>
            </main>
            {/* <div className="flex items-center justify-end">
                <button
                    onClick={exportarPDF}
                    className="px-4 py-2 bg-blue-600 font-semibold text-white rounded mt-4"
                >
                    Exportar PDF
                </button>
            </div> */}

            <ScrappedReasonsChart />
            <GraficoCumplimientoPrograma />

            <TreadWearChart />
            <TireHealthChart />
            <ScrapTyres />
            <OperationalTyres />
            <OperationalTyresHistograms />
            {/* <PatternComparisonChart /> */}
            <ScrappedTyresChart />
        </div>
    );
}
