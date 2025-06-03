
export interface BudgetData {
    id: number;
    month: number;
    site: {
        id: number;
        name: string;
        region: string;
        isActive: boolean;
    }
    siteId: number;
    tireCount: number;
    year: number;
}