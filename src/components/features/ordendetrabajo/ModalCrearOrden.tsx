"use client";

import { useState, useEffect } from "react";
import Label from "@/components/common/forms/Label";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LoadingSpinner from "@/components/common/lodaing/LoadingSpinner";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import Cross from "@/components/common/icons/Cross";
import { useAuthFetch } from "@/utils/AuthFetch";

// Extender con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface ModalCrearOrdenProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

interface ProgramasDTO {
    id: number;
    description: string;
    scheduledDate: string;
    vehicle: {
        id: number;
        code: string;
    }
    tyreCode: string;
    date: string;
    status?: string; // Programada, En ejecución, Completada, Cancelada
    scheduledTime?: number; // Time in hours for the scheduled maintenance
    workDate?: string; // Date when the maintenance work was actually performed
    siteId?: number; // ID of the site where the maintenance is scheduled
}

export default function ModalCrearOrden({
    visible,
    onClose,
    onGuardar,
}: ModalCrearOrdenProps) {
    const [actionDate, setActionDate] = useState(() =>
        dayjs().tz('America/Santiago')
    );
    const [executeTime, setExecuteTime] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    const [programMaintenance, setProgramMaintenance] = useState<ProgramasDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });

    // Use state formulario
    const [vehicleCode, setVehicleCode] = useState<string>("");




    const fetchData = async () => {
        const authFetch = useAuthFetch();
        const fechaInicio = new Date(startDate);
        const fechaFin = new Date(startDate);
        fechaFin.setDate(fechaInicio.getDate() + 6);

        const isoInicio = formatearFechaLocal(fechaInicio);
        const isoFin = formatearFechaFinUTC(fechaFin);

        try {
            console.log("Fechas:", isoInicio, isoFin);
            setLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/time-period/${isoInicio}/${isoFin}`);
            const data = await response.json();
            console.log("Programas", data);
            setProgramMaintenance(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching:", error);
            setProgramMaintenance([]);
        }

    }

    useEffect(() => {
        fetchData();
    }, []);



    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <section className="relative max-lg:w-full bg-white dark:bg-[#212121] dark:text-white placeholder:dark:text-white p-3 lg:p-6 rounded-md flex max-lg:flex-col shadow-lg h-full lg:h-[85dvh] overflow-y-scroll">

                <main className=" w-full lg:w-[75dvh]  lg:border-r border-gray-300 lg:pr-4">
                    <div>
                        <h2 className="text-2xl font-bold ">Nueva Órden de Trabajo</h2>
                        {/* x para cerrar el modal */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            title="Cerrar"
                        >
                            <Cross />
                        </button>
                    </div>
                    <p className="text-sm mb-4">
                        Completa los campos necesarios para crear una nueva orden de trabajo.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <Label title="Fecha Programada" isNotEmpty={true} />
                        {/* Input de fecha solamente */}
                        <input
                            type="datetime-local"
                            value={actionDate.format('YYYY-MM-DDTHH')}
                            onChange={(e) => setActionDate(dayjs(e.target.value).tz('America/Santiago'))}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Input descripcion del trabajo */}
                        <Label title="Descripción del Trabajo" isNotEmpty={true} />
                        <input
                            type="text"
                            placeholder="Descripción del trabajo a realizar"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Ubicacion donde se desarrollara Select */}
                        <Label title="Ubicación" isNotEmpty={true} />
                        <select className="border border-gray-300 p-2 rounded">
                            <option value="">Seleccione una ubicación</option>
                            <option value="sucursal1">Losa</option>
                            <option value="sucursal2">Terreno</option>
                            <option value="sucursal3">Truck Shop</option>
                        </select>
                        {/* Select turno dia noche */}
                        <Label title="Turno" isNotEmpty={true} />
                        <select className="border border-gray-300 p-2 rounded">
                            <option value="">Seleccione un turno</option>
                            <option value="diurno">Diurno</option>
                            <option value="nocturno">Nocturno</option>
                        </select>
                        {/* Select tipo de intervencion */}
                        <Label title="Tipo de Intervención" isNotEmpty={true} />
                        <select className="border border-gray-300 p-2 rounded">
                            <option value="">Seleccione un tipo de intervención</option>
                            <option value="apoyo">Apoyo Mecanico</option>
                            <option value="correctivo">Correctivo</option>
                            <option value="programada">Programada</option>
                            <option value="imprevisto">Imprevisto</option>
                        </select>
                        {/* Cantidad estimada de personas */}
                        <Label title="Cantidad de Personas" isNotEmpty={true} />
                        <input
                            type="number"
                            placeholder="Cantidad de personas estimadas"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Fecha y hora de ingreso */}
                        <Label title="Fecha y Hora de Ingreso" isNotEmpty={true} />
                        <input
                            type="datetime-local"
                            value={actionDate.format('YYYY-MM-DDTHH')}
                            onChange={(e) => setActionDate(dayjs(e.target.value).tz('America/Santiago'))}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Fecha y hora de despacho */}
                        <Label title="Fecha y Hora de Despacho" isNotEmpty={true} />
                        <input
                            type="datetime-local"
                            value={actionDate.format('YYYY-MM-DDTHH')}
                            onChange={(e) => setStartDate(dayjs(e.target.value).tz('America/Santiago').toDate())}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Tiempo estimado de ejecucion */}
                        <Label title="Tiempo Estimado de Ejecución (Horas)" isNotEmpty={true} />
                        <input
                            type="number"
                            placeholder="Tiempo estimado en horas"
                            value={executeTime ?? ''}
                            onChange={(e) => setExecuteTime(Number(e.target.value))}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Supervisor */}
                        <Label title="Supervisor" isNotEmpty={true} />
                        <select className="border border-gray-300 p-2 rounded">
                            <option value="">Seleccione un supervisor</option>
                            <option value="supervisor1">Supervisor 1</option>
                            <option value="supervisor2">Supervisor 2</option>
                            <option value="supervisor3">Supervisor 3</option>
                        </select>
                        {/* Codigo de Equipo */}
                        <Label title="Código de Equipo" isNotEmpty={true} />
                        <input
                            type="text"
                            value={vehicleCode}
                            onChange={(e) => setVehicleCode(e.target.value.toUpperCase())}
                            placeholder="Código del equipo"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* 6 Check box para seleccionar que posiciones se desintalaran */}
                        <Label title="Posiciones a Desinstalar" isNotEmpty={true} />
                        <div className="grid grid-cols-3 gap-2">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 1
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 2
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 3
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 4
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 5
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Pos 6
                            </label>
                        </div>
                    </div>
                </main>

                {/* Lista de neumaticos */}
                <aside className=" w-full max-lg:border-t max-lg:mt-4 max-lg:pt-2 border-t-gray-200 lg:w-[50dvh] lg:pl-4">
                    <h2 className="text-xl font-bold mb-4">Programa semanal</h2>
                    <p className="text-sm mb-4">
                        Seleccione el código del vehículo para ver los programas semanales asociados.
                    </p>
                    {/* Mostrar listado de programa semanal que su vehicle code sea igual al vehcile code ingresado en el input anterior */}
                    <div className="h-[75%] overflow-y-auto">

                        {

                            loading ? (
                                <p>Cargando programas...</p>
                            ) : (
                                programMaintenance.filter((program) => program.vehicle.code === vehicleCode).length === 0 ? (
                                    <p>No hay programas disponibles para el vehículo ingresado.</p>
                                ) : (
                                    // Filtrar los programas por el vehicle code ingresado
                                    vehicleCode === "" ? (
                                        <p>Ingrese un código de vehículo para ver los programas.</p>
                                    ) :
                                        // Mapear los programas filtrados
                                        (programMaintenance
                                            .filter((program) => program.vehicle.code === vehicleCode) // Filtrar por vehicle code ingresado
                                            .map((program) => (
                                                <div key={program.id} className=" bg-gray-50 border p-2 mb-2 rounded">
                                                    <h3 className="font-semibold">{program.description}</h3>
                                                    <p>Fecha Programada: {dayjs(program.scheduledDate).format('DD/MM/YYYY')}</p>
                                                </div>
                                            ))
                                        )
                                )
                            )}
                    </div>


                    <div className="flex justify-end gap-2 mt-6">
                        <ButtonWithAuthControl loading={loading} onClick={onGuardar}>
                            Guardar Cambios
                        </ButtonWithAuthControl>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                        >
                            Cancelar
                        </button>
                    </div>
                    {/* Mostrar error si existe */}
                    {error && <div className="text-red-500 flex justify-between text-sm h-[10dvh] mt-2 overflow-y-scroll bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                        <button onClick={() => setError("")} className=" text-red-500 pr-2">
                            X
                        </button>
                    </div>}
                </aside>
                <LoadingSpinner isOpen={false} />

            </section>
        </div>
    );
}


function formatearFechaLocal(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}T00:00:00.000`;
}

function formatearFechaFinUTC(fecha: Date): string {
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);
    return fin.toISOString(); // Devuelve en formato UTC con la Z
}