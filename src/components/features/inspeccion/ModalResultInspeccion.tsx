import { BadgeCheck } from "lucide-react";

interface RegistrosDTO {
    id: number;
    success: boolean;
    error: string;
    equipmentCode: string;
    position: string;
}

interface ModalResultInspeccionProps {
    isOpen: boolean;
    registros: RegistrosDTO[];
    title?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ModalResultInspeccion({ isOpen, title, onClose, onConfirm, registros }: ModalResultInspeccionProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            {/* Fondo oscuro con opacidad */}
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>

            <div className="relative p-6 rounded-lg">
                {/* Cuadro blanco que muestre informacion */}
                <div className="bg-white p-4 w-[80dvh] h-[70dvh] rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-center">{title}</h2>
                    <button onClick={onClose} className=" text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="overflow-y-auto h-[50dvh]">

                        {registros.length === 0
                            ? <p className="text-center text-gray-500">No hay registros para mostrar</p>
                            :
                            registros.map((registro) => (
                                <div key={registro.id} className="border-b border-gray-300 py-2 flex gap-2 items-center">
                                    {
                                        !registro.success &&
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm">Equipo: {registro.equipmentCode}</p>

                                            <p className="text-sm">Posición: {registro.position}</p>
                                        </div>
                                    }

                                    {
                                        registro.success &&
                                        <BadgeCheck className="w-8 h-8 text-green-500 inline-block mr-1" />
                                    }
                                    <p className={`text-sm ${registro.success ? 'text-gray-700' : 'text-red-500'}`}>
                                        {registro.error}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                    <button
                        onClick={onConfirm}
                        className="bg-amber-300 text-black font-semibold px-4 py-2 rounded-lg w-full hover:bg-amber-400 mt-4"
                    >
                        Aceptar
                    </button>

                </div>

            </div>
            {/* Texto que diga cargando informacion, espera un momento */}


        </div>
    );
}
