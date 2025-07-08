
import TyresKPI from "@/components/features/res/KPI_Operational_Scrapped";
import StatusVehicle from "@/components/features/res/StatusVehicle";
import TireKPIOverview from "@/components/features/res/TireAlerts/TireKPIOverview";
export default function Page() {
    return (
        <div className="flex flex-col overflow-x-hidden gap-y-4 lg:gap-y-5 bg-white dark:bg-[#212121] pt-4 p-2 dark:text-white  w-full lg:p-3">
            <main className="w-[100%] lg:rounded-md mx-auto lg:p-4 ">
                <div className="grid grid-cols-1 lg:flex w-full justify-between gap-2">
                    <h1 className="text-2xl font-bold">Monitor General de Flota</h1>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver un resumen de los neumáticos críticos y su estado.
                </p>
            </main>
            <TyresKPI />
            <TireKPIOverview />
            <StatusVehicle />
        </div>
    );
}