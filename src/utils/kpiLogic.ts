// utils/kpiLogic.ts

import { TireDTO } from "@/types/Tire";
type KpiKey = 'inversion' | 'rotacion' | 'finVida' | 'temperatura' | 'posicionCritica';

export const kpiItems: {
    key: KpiKey;
    title: string;
    criterio: string;
    color: string;
}[] = [
        {
            key: 'inversion',
            title: 'Inversión',
            criterio: 'Diferencia de goma interna y externa mayor a 10mm.',
            color: 'orange', // naranja
        },
        {
            key: 'rotacion',
            title: 'Rotación',
            criterio: 'Desgaste mayor al 25% en posiciones 1 o 2.',
            color: 'blue', // azul
        },
        {
            key: 'finVida',
            title: 'Fin de Vida',
            criterio: 'Desgaste igual o mayor al 75% de la banda original.',
            color: 'red', // rojo
        },
        {
            key: 'temperatura',
            title: 'Temperatura',
            criterio: 'Temperatura mayor a 75°C.',
            color: 'amber', // amarillo
        },
        {
            key: 'posicionCritica',
            title: 'Posición Crítica',
            criterio: 'Posición con mayor desgaste promedio.',
            color: 'emerald', // verde
        },
    ];

export const getKpiData = (tires: TireDTO[]) => {
    const porPosicion: Record<string, number[]> = {};

    const kpiData = {
        inversion: tires.filter(t =>
            Math.abs((t.lastInspection.externalTread ?? 0) - (t.lastInspection.internalTread ?? 0)) > 10
        ),

        rotacion: tires.filter(t =>
            [1, 2].includes(t.lastInspection.position) &&
            t.initialTread > 0 &&
            (1 - ((t.lastInspection.externalTread + t.lastInspection.internalTread) / 2) / t.initialTread) > 0.25
        ),

        finVida: tires.filter(t =>
            t.initialTread > 0 &&
            (1 - ((t.lastInspection.externalTread + t.lastInspection.internalTread) / 2) / t.initialTread) >= 0.75
        ),

        temperatura: tires.filter(t => (t.lastInspection.temperature ?? 0) > 75),



        posicionCritica: [] as TireDTO[],
    };

    // Promedio de desgaste por posición
    tires.forEach(t => {
        const pos = t.lastInspection.position;
        const desgaste = t.initialTread - ((t.lastInspection.externalTread + t.lastInspection.internalTread) / 2);
        if (!porPosicion[pos]) porPosicion[pos] = [];
        porPosicion[pos].push(desgaste);
    });

    const desgastePromedio = Object.entries(porPosicion).map(([pos, desgastes]) => ({
        position: pos,
        avgDesgaste: desgastes.reduce((a, b) => a + b, 0) / desgastes.length
    }));

    const posicionTop = Number(
        desgastePromedio.sort((a, b) => b.avgDesgaste - a.avgDesgaste)[0]?.position
    );
    kpiData.posicionCritica = tires.filter(t => t.lastInspection.position === posicionTop);
    return kpiData;
};
