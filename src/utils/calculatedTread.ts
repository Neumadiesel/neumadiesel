// utils/calculateTread.ts

/**
 * Calcula el porcentaje de desgaste del neumático basado en el remanente actual.
 * @param currentTread Valor actual del remanente.
 * @param originalTread Valor original del remanente, por defecto 97.
 * @returns Porcentaje de vida restante (0 a 100).
 */
export function calculateTreadProgress(currentTread: number, originalTread = 97): number {
    if (!originalTread || originalTread <= 0) return 0;
    const percent = (currentTread / originalTread) * 100;
    return Math.min(100, Math.max(0, Math.round(percent)));
}

/**
 * Devuelve un color según el porcentaje de desgaste.
 * @param percent Porcentaje de vida restante.
 * @returns Color de tailwind (bg-green-500, bg-yellow-400, etc.)
 */
export function getColorByTread(percent: number): string {
    if (percent <= 15) return 'bg-red-500';
    if (percent <= 40) return 'bg-yellow-400';
    if (percent >= 85) return 'bg-green-500';
    return 'bg-blue-500';
}