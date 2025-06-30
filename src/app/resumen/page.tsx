import OldTyres from "@/components/common/charts/neumatico/OldTyres";
import TyresKPI from "@/components/features/res/KPI_Operational_Scrapped";
import TireHealthDashboard from "@/components/features/res/TireHealthDashboard";
export default function Page() {
    return (
        <div className="flex flex-col overflow-x-hidden bg-white dark:bg-[#212121] pt-4 p-2 dark:text-white  w-full o lg:p-3">
            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className="grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold">Resumen de Neumáticos</h1>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver un resumen de los neumáticos críticos y su estado.
                </p>
            </main>
            <TyresKPI />

            <TireHealthDashboard />
            <OldTyres />
            {/* <ScrapTyres />
            <OperationalTyres /> */}
            {/* <OperationalTyresHistograms /> */}
            {/* <ScrappedTyresChart /> */}
            {/* <ScrappedReaasonsChart /> */}

            {/* <TireAnalyticsDashboard /> */}
        </div>
    );
}