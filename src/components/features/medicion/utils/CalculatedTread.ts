export function calculateTreadProgress(tread: number, maxTread: number = 97): number {
    if (!tread || tread <= 0) return 100; // 100% gastado si no hay remanente
    if (tread >= maxTread) return 0; // 0% gastado si está nuevo

    const desgaste = maxTread - tread;
    const porcentaje = (desgaste / maxTread) * 100;
    return Math.min(100, Math.max(0, Math.round(porcentaje)));
}