'use client';
import LabelLoading from "@/components/common/forms/LabelLoading";
import Breadcrumb from "@/components/layout/BreadCrumb";
import { TireDTO } from "@/types/Tire";
import { Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface HistoryDTO {
    id: number;
    action: string;
    excecutionDate: string;
    exceutionTime: number;
    description: string;
    position: string;
}

export default function TirePage() {
    const { id } = useParams();

    const [tire, setTires] = useState<TireDTO>();
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<HistoryDTO[]>([]);
    const fetchTires = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://inventory-service-emva.onrender.com/tires/${id}`);
            const data = await response.json();
            setTires(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://inventory-service-emva.onrender.com/maintenance/tire/${id}`);
            const data = await response.json();
            setRecords(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tyre models:", error);
        }
    }
    useEffect(() => {
        fetchHistory();
        fetchTires();
    }, []);

    // funcion de porcentaje de desgaste
    const calculateWearPercentage = (initialTread: number | null, currentTread: number | null) => {
        if (initialTread === null || currentTread === null) return 0;
        if (initialTread === 0) return 0;
        console.log("initialTread", initialTread);
        console.log("currentTread", currentTread);
        console.log("result", ((initialTread - currentTread) / initialTread) * 100);
        return (((initialTread - currentTread) / initialTread) * 100).toFixed(2);
    };

    return (
        <div className="p-3 bg-white h-[110vh] dark:bg-[#212121] relative shadow-sm">
            <Breadcrumb />
            <h1 className="text-2xl font-bold">Información del Neumático: {tire?.code}</h1>
            {/* Add your tire details component here */}
            {/* Section cuadro de informacion */}
            <section className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                    <div className="bg-gray-50 p-4 rounded-md border grid grid-cols-3">
                        <div className="grid grid-cols-2 gap-2">

                            <LabelLoading loading={loading} title="Marca:" text={tire?.model.brand || ""} />
                            <LabelLoading loading={loading} title="Patron:" text={tire?.model.pattern || ""} />
                            <LabelLoading loading={loading} title="Código:" text={tire?.model.code || ""} />
                            <LabelLoading loading={loading} title="Medidas:" text={tire?.model.dimensions || ""} />
                            <LabelLoading loading={loading} title="OTD:" text={tire?.model.originalTread?.toString() || ""} />
                        </div>
                        <div className="px-4 grid grid-cols-2 gap-2 border-x border-gray-200">
                            <LabelLoading loading={loading} title="Desgaste Interior:" text={tire?.lastInspection?.internalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Desgaste Exterior:" text={tire?.lastInspection?.externalTread.toString() || ""} />
                            <LabelLoading loading={loading} title="Kilometraje:" text={tire?.lastInspection?.kilometrage?.toString() || ""} />
                            <LabelLoading loading={loading} title="Horas:" text={tire?.initialHours?.toString() || ""} />
                            {
                                tire &&
                                <LabelLoading loading={loading} title="% de Desgaste:" text={`${calculateWearPercentage(tire?.initialTread, tire?.lastInspection?.externalTread)}%`} />
                            }
                        </div>
                        <div className="px-4 flex flex-col gap-2 ">
                            <LabelLoading loading={loading} title="Ubicación:" text={tire?.location.name || ""} />
                            <LabelLoading loading={loading} title="Equipo:" text={tire?.installedTires[0]?.vehicle?.code || ""} />
                            <LabelLoading loading={loading} title="Posicion:" text={tire?.installedTires[0]?.position?.toString() || ""} />
                        </div>


                    </div>
                </div>
            </section>
            {/* Section historial */}
            <section
                className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-sm bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead className="text-xs text-black uppercase bg-amber-300  ">
                        <tr>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Codigo
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Ubicacion
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Posicion
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Horas
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Int
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Ext
                                </p>
                            </th>
                            <th className="p-4">
                                <p className="block font-sans text-sm antialiased font-semibold leading-none text-black">
                                    Acciones
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center p-8 dark:bg-neutral-900">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Cargando modelos...
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-8">
                                    <div className="flex flex-col items-center justify-center space-y-4  animate-pulse">
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No se encontraron modelos.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) :
                            records.map((record) => (
                                <tr key={record.id} className="bg-white border-b dark:bg-neutral-800 dark:border-amber-300 border-gray-200 dark:text-white">
                                    <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {record.description}
                                        </p>
                                    </td>
                                    <td className="p-4 ">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {record.excecutionDate}
                                        </p>
                                    </td>
                                    <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {record.exceutionTime}
                                        </p>
                                    </td>
                                    <td className="p-4  bg-gray-50 dark:bg-neutral-900">
                                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                            {record.position}
                                        </p>
                                    </td>


                                    <td className="dark:bg-neutral-900 px-2">
                                        <div className="flex gap-2">
                                            {/* Botón editar */}
                                            <button
                                                onClick={() => {
                                                    console.log("Edit button clicked for record:", record);
                                                }
                                                }
                                                className="p-2 text-green-500 hover:text-green-600 bg-green-50 border border-green-300 rounded-md flex items-center justify-center"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
}