import { toPng } from 'html-to-image';

export const downloadChartAsImage = async (elementId: string, filename = 'grafico.png') => {
    const node = document.getElementById(elementId);
    if (!node) {
        console.warn(`No se encontró el elemento con id "${elementId}"`);
        return;
    }

    try {
        const dataUrl = await toPng(node);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.click();
    } catch (error) {
        console.error('Error al generar la imagen:', error);
    }
};
