'use client'
import MineTruck from "@/components/common/icons/MineTruck";
import { AlertTriangle, Calendar, Check, CircleDot, Donut, FileText, Gauge, MessageCircle, Thermometer, TriangleAlert, User } from "lucide-react";
import { InspectionDTO } from "@/types/Inspection";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Link from "next/link";
import Modal from "@/components/common/modal/CustomModal";


export default function Page() {

    const { user } = useAuth();
    const params = useParams<{ id: string }>();
    const id = params.id

    const [error, setError] = useState<string | null>(null);
    const [errorComment, setErrorComment] = useState<string | null>(null);

    // state to hold inspection data
    const [inspectionData, setInspectionData] = useState<InspectionDTO | null>(null);
    const fetchInspectionData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la inspección');
            }
            const data = await response.json();
            console.log('Datos de la inspección:', data);
            setInspectionData(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                console.error("Error al obtener los datos de la inspección:", message);
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        }
    };

    // Funcion para aprobar inspección
    const aproveInspection = async () => {

        const approvedById = user?.user_id; // ID del usuario que aprueba la inspección, puedes obtenerlo del contexto o estado global
        const approvedByName = user?.name + " " + user?.last_name; // Nombre del usuario que aprueba la inspección
        const inspectionId = id; // ID de la inspección que se está aprobando
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${inspectionId}/approve`,
                {
                    approvedUserId: approvedById, // ID del usuario que aprueba la inspección
                    approvedUserName: approvedByName, // Nombre del usuario que aprueba la inspección
                }
            );
            console.log("Inspección aprobada:", response.data);
            // Actualizar la lista de inspecciones pendientes
            fetchInspectionData(); // Refrescar los datos de la inspección después de aprobar
        } catch (error) {
            console.error("Error approving inspection:", error);
            setDenyModalOpen(false); // Cerrar el modal de confirmación si ocurre un error
            return [];
        }
    };

    const [denyModalOpen, setDenyModalOpen] = useState(false);

    // Denegar inspección
    const denyInspection = async () => {

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/${id}/deny`
            );
            console.log("Inspección denegada:", response.data);
            // Actualizar la lista de inspecciones pendientes
            setDenyModalOpen(false); // Cerrar el modal de confirmación
            // quiero redirigirme a la pagina de inspecciones
            window.location.href = '/medicion';
        } catch (error) {
            console.error("Error denying inspection:", error);
            return [];
        }
    }


    // Funcion para subir comentario
    const [comment, setComment] = useState('');
    const submitComment = async () => {
        if (!comment.trim()) return;
        const userName = user?.name + ' ' + user?.last_name || 'Usuario Anónimo';

        if (!id) {
            console.error("ID de inspección no disponible");
            setError("ID de inspección no disponible");
            return;
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-comments`, {
                inspectionId: Number(id),
                userId: user?.user_id,
                userName,
                message: comment,
                isVisible: true,
            });
            console.log('Comentario guardado:', res.data);

            fetchInspectionData(); // Refresh inspection data after adding comment
            setComment('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || "Error desconocido";
                // console.error("Error al enviar el comentario:", errorMessage);
                setErrorComment(errorMessage);
            } else {
                console.error("Error inesperado:", err);
            }
        }
    };
    const getInternalLifePercent = () => {
        if (!inspectionData) return 0;
        const { tire, internalTread } = inspectionData;
        if (!tire?.initialTread || internalTread == null) return 0;
        return Math.round((internalTread / tire.initialTread) * 100);
    };

    const getExternalLifePercent = () => {
        if (!inspectionData) return 0;
        const { tire, externalTread } = inspectionData;
        if (!tire?.initialTread || externalTread == null) return 0;
        return Math.round((externalTread / tire.initialTread) * 100);
    };

    function getBarColor(percent: number) {
        if (percent > 85) return 'bg-green-500';
        if (percent <= 40) return 'bg-red-500';
        if (percent < 60) return 'bg-yellow-400';
        return 'bg-blue-500'; // Color neutro
    }

    function calculateAverageTread(external: number, internal: number) {
        const average = (external + internal) / 2;
        const percentage = Math.round((average / 97) * 100);

        let color = 'bg-blue-500'; // Por defecto, color neutro

        if (percentage > 85) {
            color = 'bg-green-500';
        } else if (percentage <= 20) {
            color = 'bg-red-600';
        } else if (percentage <= 40) {
            color = 'bg-yellow-400';
        }

        return { percentage, color };
    }

    console.log("Inspection Id: ", id);

    function getGeneralStatusAlert(position: number, external: number, internal: number) {
        const alerts = [];

        const averageTread = (external + internal) / 2;

        // 🔁 Nueva alerta: diferencia > 10 → invertir neumático
        if (Math.abs(external - internal) > 10) {
            alerts.push({
                icon: <AlertTriangle size={24} className="inline" />,
                color: 'bg-orange-500',
                message: 'Inversión Requerida.',
            });
        }

        // ⚠️ Rotación en posición 1 o 2 con desgaste bajo
        if ((position === 1 || position === 2) && Math.min(external, internal) <= 70) {
            alerts.push({
                icon: <AlertTriangle size={24} className="inline" />,
                color: 'bg-yellow-400 text-black',
                message: 'Rotación requerida por desgaste en posición 1',
            });
        }

        // 🔴 Fin de vida útil
        if (external <= 20 || internal <= 20) {
            alerts.push({
                icon: <TriangleAlert size={24} className="inline" />,
                color: 'bg-red-600',
                message: 'Neumático llegando al fin de su vida útil',
            });
        }

        // 🟡 Desgaste avanzado
        if (averageTread <= 50) {
            alerts.push({
                icon: <Donut size={24} className="inline" />,
                color: 'bg-yellow-400',
                message: 'Alerta de desgaste avanzado',
            });
        }

        // ✅ Estado neutro si no hay alertas
        if (alerts.length === 0) {
            return {
                icon: <Check size={24} className="inline" />,
                color: 'bg-green-600',
                message: 'Condición óptima',
            };
        }


        return alerts[0];
    }

    const position = inspectionData?.position ?? 0;


    const external = inspectionData?.externalTread ?? 0;
    const internal = inspectionData?.internalTread ?? 0;

    const { percentage, color } = calculateAverageTread(external, internal);

    const alert = getGeneralStatusAlert(position, external, internal);

    useEffect(() => {
        fetchInspectionData();
    }, []);
    return (
        <div className="p-3 bg-neutral-50 dark:bg-[#212121] dark:text-white flex flex-col gap-4">
            {/* Seccion de titulo y boton de exportación */}
            <div className="w-full flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Medición de Neumático</h1>
                    <p className="text-gray-700 font-semibold">Código: {inspectionData?.tire?.code || "No Disponible"} <span className="font-normal text-gray-500">| Posición {inspectionData?.position}</span></p>
                </div>
                {/* Bototn de exportar */}
                <div className="flex justify-end mt-2">
                    {/* <button className="bg-amber-300 text-black px-4 py-2 rounded flex justify-between items-center gap-2 hover:bg-amber-400 transition-colors">
                        <FileDown size={32} />
                        <p className="text-lg font-semibold">
                            Exportar a Excel
                        </p>
                    </button> */}
                </div>
            </div>
            {/* Seccion con dos columnas, loa izquierda para informacion general que usara 2/3 y la derecha para detalles como un aside que usara 1/3 */}
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Columna izquierda: Información General */}
                <div className="col-span-2 ">
                    {/* Cuadro de error */}
                    {error && (
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                            <p className="font-semibold">Error:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {/* div de informacion del equipo */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg ">
                        <div className="flex items-center mb-4 gap-2">
                            <MineTruck className="w-10" />
                            <h2 className="text-2xl font-semibold">
                                Información General</h2>
                        </div>
                        <div className=" w-full grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Equipo:</p>
                                <span className="font-bold text-xl">
                                    {inspectionData?.tire?.installedTires?.[0]?.vehicle?.code || "No Disponible"}
                                </span>
                            </div>
                            {/* Insoeccionado por */}
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">
                                    <User size={20} className="inline mr-1" />
                                    Inspeccionado por:
                                </p>
                                <span className="font-bold text-xl"> {inspectionData?.inspectorName || "Sistema"}</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Posición:</p>
                                <span className="font-bold text-xl">{inspectionData?.position}</span>
                            </div>
                            {/* Aprobado por */}
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">
                                    <User size={20} className="inline mr-1" />
                                    Aprobado por:
                                </p>
                                <span className="font-bold text-xl"> {inspectionData?.approvedByName || "Sistema"}</span>
                            </div>
                            <div className="flex flex-col">

                                <p className="text-gray-500 dark:text-gray-300"><Calendar size={20} className="inline mr-1" /> Fecha de Inspección:</p>
                                <span className="font-bold text-xl">
                                    {inspectionData?.inspectionDate
                                        ? new Date(inspectionData.inspectionDate).toLocaleDateString()
                                        : "Fecha no disponible"
                                    }

                                </span>
                            </div>
                            {/* HORAS */}
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Horas:</p>
                                <span className="font-bold text-xl">{inspectionData?.hours || "0"}</span>
                            </div>
                            {/* Kilometraje */}
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Kilometraje:</p>
                                <span className="font-bold text-xl">{inspectionData?.kilometrage || "0"}</span>
                            </div>
                        </div>
                    </section>
                    {/* Medición Actual */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <Gauge size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Medición Actual</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Aquí puedes ver los datos actuales del neumático, incluyendo presión, temperatura y remanente.
                        </p>
                        {/* Seccion de datos */}
                        <section className="grid grid-cols-1 gap-4 mt-4">
                            {/* Presion y temperatura */}
                            <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-2">
                                <div className="flex flex-col gap-2">
                                    <Gauge size={28} className="inline mr-2 text-blue-500" />
                                    <p className="text-blue-700 dark:text-gray-300">Presión:</p>
                                    <span className="text-xl font-semibold">{inspectionData?.pressure || "No Disponible"} PSI</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Thermometer size={28} className="inline mr-2 text-red-500" />
                                    <p className="text-gray-700 dark:text-gray-300">Temperatura:</p>
                                    <span className="text-xl font-semibold">{inspectionData?.temperature || "No Disponible"} °C</span>
                                </div>
                            </div>

                            {/* Remanente Interno */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <CircleDot size={28} className="inline mr-2 text-amber-600" />
                                    <p className="text-gray-700 dark:text-gray-300">Remanente Interno:</p>
                                    <span className="text-xl font-bold">{inspectionData?.internalTread}</span>
                                </div>

                                {inspectionData?.internalTread !== undefined && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                            className={`h-2.5 rounded-full ${getBarColor(getInternalLifePercent())}`}
                                            style={{ width: `${getInternalLifePercent()}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            {/* Remanente Externo */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <CircleDot size={28} className="inline mr-2 text-amber-600" />
                                    <p className="text-gray-700 dark:text-gray-300">Remanente Externo:</p>
                                    <span className="text-xl font-bold">{inspectionData?.externalTread}</span>
                                </div>

                                {inspectionData?.externalTread !== undefined && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                            className={`h-2.5 rounded-full ${getBarColor(getExternalLifePercent())}`}
                                            style={{ width: `${getExternalLifePercent()}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </section>
                    {/* Seccion de fotograficas */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <FileText size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Fotografías</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Aquí puedes ver las fotografías del neumático para una mejor visualización del estado actual.
                        </p>
                        {/* Galería de fotos */}
                        <div className="flex gap-4 w-full overflow-x-auto">
                            {/* Aquí se pueden mapear las fotos */}
                            {(inspectionData?.photos?.length ?? 0) === 0 && (
                                <p className="text-gray-500 dark:text-gray-300">No hay fotos disponibles.</p>
                            )}
                            {(inspectionData?.photos ?? []).map(photo => (
                                <div key={photo.id} className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 rounded-md shadow-sm w-[35vh] flex flex-col">
                                    <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${photo.url}`} alt="Foto del Neumático" className="rounded-t-md object-cover w-full " />

                                </div>
                            ))
                            }
                        </div>
                    </section>
                    {/* Seccion de comentarios */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <MessageCircle size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Comentarios</h2>
                        </div>
                        {/* Seccion de comentarios */}
                        <div className="border-b pb-4 mb-2">
                            {/* Comentario 1 */}
                            {(inspectionData?.comments?.length ?? 0) === 0 && (
                                <p className="text-gray-500 dark:text-gray-300">No hay comentarios disponibles.</p>
                            )}
                            {(inspectionData?.comments ?? []).map(comment => (
                                <div key={comment.id} className="flex items-center gap-4 mb-4 bg-neutral-50 rounded-md p-2">
                                    <div className="bg-white text-xl font-bold border rounded-full p-4 h-12 w-12 flex items-center justify-center">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">

                                            <p className="text-xl font-semibold">
                                                {comment.userName}
                                            </p>

                                            <span className="text-gray-800  font-semibold text-lg">
                                                {comment.createdAt
                                                    ? new Date(comment.createdAt).toLocaleDateString()
                                                    : "Fecha no disponible"}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {comment.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Formulario para agregar un nuevo comentario */}
                        <div className="mt-4 flex flex-col gap-2">
                            <h3 className="text-lg font-bold">Agregar Comentario</h3>
                            {/* Div de error */}
                            {errorComment && (
                                <div className="bg-red-100 text-red-800 p-2 rounded-lg mb-2">
                                    <p className="font-semibold">Error: <span className="font-normal">{errorComment}</span></p>
                                </div>
                            )}
                            <textarea
                                placeholder="Agregar comentario"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                onClick={submitComment}
                                disabled={!id || !comment.trim()}
                                className="px-4 py-2 bg-purple-600 text-white rounded"
                            >
                                Enviar Comentario
                            </button>
                        </div>
                    </section>

                </div>

                {/* ------------------------------------ */}
                {/* ------------------------------------ */}

                {/* Columna derecha: Detalles del Neumático */}
                <aside className="flex flex-col col-span-2 lg:col-span-1 gap-4">
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg ">
                        <h3 className="text-xl font-semibold mb-2">Estado General</h3>
                        <p className="text-gray-700 font-semibold dark:text-gray-300 mb-2">Condición</p>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`text-black    font-semibold px-2 py-1 rounded-full ${alert.color}`}>
                                {alert.icon} {alert.message}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-xl font-semibold mb-2">Promedio Remanente</h3>
                                <p className="text-gray-700 font-semibold dark:text-gray-300 mb-2">
                                    {percentage}%
                                </p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div
                                    className={`h-2.5 rounded-full ${color}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                        {/* Observaciones */}
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Observaciones</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {inspectionData?.observation || "No hay observaciones disponibles."}
                            </p>
                        </div>

                    </div>
                    {/* Panel de acciones programar mantenimiento, ver neumatico, generar informe */}
                    <div className="  bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg font-semibold ">
                        <div className="flex items-center mb-4">
                            <FileText size={32} className="inline mr-2 text-black dark:text-white " />
                            <h3 className="text-xl font-semibold ">Acciones</h3>
                        </div>

                        <Link
                            href={inspectionData?.tireId ? `/neumaticos/${inspectionData.tireId}` : "#"}
                            className=""
                            tabIndex={inspectionData?.tireId ? 0 : -1}
                            aria-disabled={!inspectionData?.tireId}
                            onClick={e => {
                                if (!inspectionData?.tireId) e.preventDefault();
                            }}
                        >
                            <div
                                className={`bg-blue-600 text-white border border-blue-700 px-4 py-2 rounded-md mb-2 w-full flex items-center justify-center ${!inspectionData?.tireId ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-blue-700 transition-colors"
                                    }`}
                            >
                                <CircleDot size={24} className="inline mr-2" />
                                Ver Neumático
                            </div>
                        </Link>
                        {
                            !inspectionData?.approved && (

                                <button onClick={aproveInspection} className="bg-amber-400 cursor-pointer text-black px-4 py-2 rounded-md hover:bg-amber-500 transition-colors mb-2 w-full">
                                    <Donut size={24} className="inline mr-2" />
                                    Aprobar Inspección
                                </button>
                            )
                        }
                        {
                            !inspectionData?.approved && (

                                <button onClick={() => setDenyModalOpen(true)} className="bg-gray-50 cursor-pointer dark:bg-neutral-800 text-black dark:text-white border border-red-400 px-4 py-2 rounded-md hover:bg-white hover:dark:bg-neutral-900 transition-colors mb-2 w-full">
                                    <FileText size={24} className="inline mr-2 text-red-500" />
                                    Rechazar Inspección
                                </button>
                            )
                        }
                    </div>
                </aside>
                {/* ------------------------------------ */}
                {/* ------------------------------------ */}
                {
                    denyModalOpen && (
                        <Modal isOpen={denyModalOpen} onClose={() => setDenyModalOpen(false)} onConfirm={denyInspection} title="¿Estás seguro?">
                            <p>
                                Esta Inspección será denegada y no podrá ser aprobada nuevamente. ¿Deseas continuar?
                            </p>
                        </Modal>
                    )
                }
            </section>

        </div>
    );
}
