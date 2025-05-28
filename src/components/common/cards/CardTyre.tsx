import { ArrowLeftRight, CircleDot, Clock, Info, Thermometer, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ToolTipCustom from "@/components/ui/ToolTipCustom";

interface CardTireProps {
    code?: string;
    position: number;
    externalTread?: number;
    internalTread?: number;
    kilometrage?: number;
    hours?: number;
    pressure?: number;
    temperature?: number;
    tireId?: number;
    onDesinstalar?: () => void;
    loading: boolean;
}

export default function CardTire(props: CardTireProps) {
    const {
        code,
        position,
        externalTread,
        internalTread,
        kilometrage,
        hours,
        pressure,
        temperature,
        tireId,
        onDesinstalar,
        loading
    } = props;

    return (
        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-700 shadow-md rounded-xl p-4 flex flex-col justify-center items-center w-full max-w-md mx-auto min-h-[160px]">
            {loading ? (
                <div className="animate-spin text-yellow-500">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                </div>
            ) : !tireId ? (
                <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400 text-sm">
                    <AlertTriangle className="w-6 h-6 mb-1" />
                    Sin neumático instalado
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Posición: <span className="font-bold">{position}</span>
                        </p>
                        {code && (
                            <span className="text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded">
                                {code}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between w-full mt-2">
                        <div className="text-sm space-y-1 text-gray-700 dark:text-gray-200">
                            <p>
                                <CircleDot className="inline mr-1" size={16} />
                                Profundidad: Int: {internalTread ?? "N/A"} / Ext: {externalTread ?? "N/A"}
                            </p>
                            <p>
                                <Clock className="inline mr-1" size={16} />
                                Horas: {hours ?? 0} / Kms: {kilometrage ?? 0}
                            </p>
                            <p>
                                <Thermometer className="inline mr-1" size={16} />
                                PSI: {pressure ?? "N/A"} / {temperature ?? "N/A"} °C
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 justify-end mt-1">
                            <ToolTipCustom content="Ver Detalles">
                                <Link
                                    href={`/neumaticos/${tireId}`}
                                    className="p-2 text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-neutral-800 border border-indigo-300 rounded-md flex items-center justify-center"
                                >
                                    <Info className="w-4 h-4" />
                                </Link>
                            </ToolTipCustom>

                            <ToolTipCustom content="Desinstalar Neumático">
                                <button
                                    onClick={onDesinstalar}
                                    className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 bg-red-50 dark:bg-neutral-800 border border-red-400 rounded-md flex items-center justify-center"
                                >
                                    <ArrowLeftRight className="w-4 h-4" />
                                </button>
                            </ToolTipCustom>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
