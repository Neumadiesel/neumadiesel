import { VehicleDTO } from "@/types/Vehicle";
import CardTireInstalled from "./CardTireInstalled";
import Link from "next/link";

type CardVehicleStatusProps = {
    vehicle: VehicleDTO;
};

export default function CardVehicleStatus({ vehicle }: CardVehicleStatusProps) {
    const wheelCount = vehicle.model.wheelCount;

    const renderRearTires = () => {
        if (wheelCount === 4) {
            return (
                <>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-2">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[2]?.tire} />
                    </div>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-4">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[3]?.tire} />
                    </div>
                </>
            );
        } else if (wheelCount === 6) {
            return (
                <>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-1 ">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[2]?.tire} />
                    </div>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-2">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[3]?.tire} />
                    </div>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-4">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[4]?.tire} />
                    </div>
                    <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 row-start-2 col-start-5">
                        <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[5]?.tire} />
                    </div>
                </>
            );
        }
        return null; // En caso de que sea un vehículo sin ruedas o desconocido
    };

    return (
        <div className="rounded-md border shadow-sm border-gray-200 bg-gray-50 dark:bg-neutral-800 mb-4 p-2">
            <h2 className="font-semibold text-md">Equipo - {vehicle.code}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Modelo: {vehicle.model.brand} {vehicle.model.model}
            </p>

            {/* Sección de neumáticos */}
            <section className="mt-2 grid grid-cols-5 gap-1">
                {/* Delanteros */}
                <div className="w-full text-sm h-20 rounded-md bg-gray-100 border border-gray-200 col-start-2 flex items-center justify-center">
                    <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[0]?.tire} />
                </div>
                <Link href={`/maquinaria/${vehicle.id}`} className="w-full h-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center rounded-[5px] col-start-3 hover:bg-gray-200 transition-all duration-75 ease-in-out">
                    <p className="font-bold text-xl">{vehicle.code}</p>
                </Link>
                <div className="w-full h-20 rounded-md bg-gray-100 border border-gray-200 col-start-4 flex items-center justify-center">
                    <CardTireInstalled wheelCount={vehicle.model.wheelCount} tire={vehicle.installedTires[1]?.tire} />
                </div>

                {/* Traseros (dinámicos) */}
                {renderRearTires()}
            </section>
        </div>
    );
}
