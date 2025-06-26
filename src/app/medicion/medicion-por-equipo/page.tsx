'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { Gauge, Info, Search, Thermometer, Waves } from "lucide-react";
import { VehicleDTO } from "@/types/Vehicle";
import axios from 'axios';
import LoadingSpinner from '@/components/common/lodaing/LoadingSpinner';
import MineTruck from '@/components/common/icons/MineTruck';
import { useAuth } from '@/contexts/AuthContext';
import { CreateInspectionDTO } from '@/types/CreateInspection';

export default function MedicionPorEquipo() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [inspections, setInspections] = useState<CreateInspectionDTO[]>([]);

    const [initialKilometrage, setInitialKilometrage] = useState<number>(0);
    const [initialHours, setInitialHours] = useState<number>(0);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [vehicleCode, setVehicleCode] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);

    const [disableKms, setDisableKms] = useState(false);
    const [skippedTires, setSkippedTires] = useState<number[]>([]);

    const toggleSkipTire = (tireId: number) => {
        setSkippedTires((prev) =>
            prev.includes(tireId)
                ? prev.filter((id) => id !== tireId)
                : [...prev, tireId]
        );
    };

    // Estado para las horas y kilometraje

    const [kilometrage, setKilometrage] = useState<number | null>(vehicle?.kilometrage || null);
    const [hours, setHours] = useState<number | null>(vehicle?.hours || null);
    const [success, setSuccess] = useState<boolean>(false);

    const hasChanges =
        vehicle &&
        (kilometrage !== vehicle.kilometrage || hours !== vehicle.hours);

    // Enviar al backend
    const handleSave = async () => {
        setError(null);
        setSuccess(false);
        if (!vehicle || hours === null || kilometrage === null) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const isInvalid = (val: any) =>
            val === null ||
            isNaN(val) ||
            typeof val !== "number" ||
            val < 0 ||
            val.toString().includes("-") ||         // negativo
            val.toString().startsWith("000") ||     // ceros no naturales
            val.toString().endsWith(".");           // formato incompleto

        if (isInvalid(kilometrage) || isInvalid(hours)) {
            setError("Formato inválido. Se restauraron los valores originales.");
            setKilometrage(vehicle.kilometrage);
            setHours(vehicle.hours);
            return;
        }

        if (kilometrage < vehicle.kilometrage) {

            setKilometrage(vehicle.kilometrage);
            setHours(vehicle.hours);
            setError("El kilometraje no puede ser menor al actual.");
            return;
        }

        if (hours < vehicle.hours) {

            setKilometrage(vehicle.kilometrage);
            setHours(vehicle.hours);
            setError("Las horas no pueden ser menores a las actuales.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/updateKms/${vehicle.id}`,
                {
                    hours,
                    kilometrage,
                    hoursAdded: hours - vehicle.hours,
                    kilometrageAdded: kilometrage - vehicle.kilometrage,
                }
            );
            setSuccess(true);
        } catch (err) {
            setError("Error al actualizar. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicle = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1/${vehicleCode}`);
            console.log("Vehículo", response.data);
            setInitialKilometrage(response.data.kilometrage);
            setInitialHours(response.data.hours);
            setVehicle(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateInspection = (
        tire: VehicleDTO["installedTires"][0],
        field: keyof CreateInspectionDTO,
        value: string | number
    ) => {
        const kmDiff = (vehicle?.kilometrage ?? 0) - initialKilometrage;
        const hoursDiff = (vehicle?.hours ?? 0) - initialHours;

        const last = tire.tire.lastInspection;

        setInspections(prev => {
            const existing = prev.find(i => i.tireId === tire.tire.id);
            const newInspection: CreateInspectionDTO = {
                position: tire.position,
                externalTread: field === 'externalTread' ? Number(value) : existing?.externalTread ?? last.externalTread,
                internalTread: field === 'internalTread' ? Number(value) : existing?.internalTread ?? last.internalTread,
                pressure: field === 'pressure' ? Number(value) : existing?.pressure ?? last.pressure,
                temperature: field === 'temperature' ? Number(value) : existing?.temperature ?? last.temperature,
                observation: field === 'observation' ? String(value) : existing?.observation ?? last.observation,
                inspectionDate: new Date().toISOString(),

                // Acá está lo que pediste:
                kilometrage: (last.kilometrage ?? 0) + kmDiff,
                hours: (last.hours ?? 0) + hoursDiff,

                tireId: tire.tire.id,
                inspectorId: user?.user_id || 0,
                inspectorName: `${user?.name} ${user?.last_name}`,
            };

            const filtered = prev.filter(i => i.tireId !== tire.tire.id);
            return [...filtered, newInspection];
        });
    };

    const inspectedIds = inspections.map(i => i.tireId);
    const manuallySkippedIds = skippedTires;

    const autoSkippedCount = vehicle?.installedTires.filter(
        tire =>
            !inspectedIds.includes(tire.tire.id) &&
            !manuallySkippedIds.includes(tire.tire.id)
    ).length ?? 0;

    useEffect(() => {
        if (vehicle) {
            setKilometrage(vehicle.kilometrage);
            setHours(vehicle.hours);
        }
    }, [vehicle]);


    const handleConfirm = async () => {
        try {
            if (inspections.length === 0) {
                setError("Debes registrar al menos una inspección.");
                return;
            }

            // Enviar todas las inspecciones en paralelo
            await Promise.all(
                inspections
                    .filter(insp =>
                        !skippedTires.includes(insp.tireId) &&
                        // asegurarte de que al menos un campo fue modificado
                        (insp.pressure !== undefined || insp.temperature !== undefined || insp.internalTread !== undefined || insp.externalTread !== undefined)
                    )
                    .map((insp) =>
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections`, insp)
                    )
            );

            // Limpieza posterior
            setIsOpen(false);
            setInspections([]);
            setVehicle(null);
            setVehicleCode(null);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        }
    };

    return (
        <div className="  p-4 gap-y-2 bg-white dark:bg-[#212121] dark:text-white">
            <h1 className='text-2xl lg:text-3xl mb-2 font-bold'>Nueva Inspección por Equipo</h1>
            <section className=''>
                <div className='flex flex-col gap-y-2 border-b border-b-gray-100 py-4'>
                    <label className="text-xl mb-1 text-black font-semibold dark:text-white ">Ingrese código del equipo:</label>
                    <div className='flex gap-2 items-center w-full'>

                        {/* contenedor del input y boton */}
                        <div className='flex gap-x-2 items-center w-full'>
                            <input
                                onChange={(e) => setVehicleCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    console.log("Key pressed:", e.key);
                                    if (e.key === "Enter") {
                                        fetchVehicle();
                                    }
                                }}
                                value={vehicleCode || ""}
                                placeholder="Código equipo"
                                type="text"
                                className="w-[70%] bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-100 p-2"
                            />
                            <button
                                onClick={() => fetchVehicle()}
                                className="bg-amber-300 hover:bg-amber-400 hover:cursor-pointer text-black p-2 font-bold rounded-lg"
                            >
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Error */}

                        <div className='w-full flex justify-end items-center bg-emeral-400'>
                            {error && <div className="text-red-500 dark:text-red-50 font-semibold flex justify-between items-center text-sm w-full bg-red-50 dark:bg-[#212121] dark:border-red-500 border border-red-300 p-3 rounded-sm">{error}
                                <button onClick={() => setError("")} className=" text-xl text-red-500">
                                    x
                                </button>
                            </div>
                            }

                        </div>
                    </div>

                </div>

                {/* Informacion del Equipo */}
                <div className="relative">
                    {!vehicle && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent   border-dashed border-2 border-amber-500 rounded-md">
                            <div className="text-center p-4">
                                <Info className="w-12 h-12 text-amber-500 mx-auto" />
                                <h3 className="text-xl font-bold text-amber-500">Complete Paso 1</h3>
                                <p className="text-amber-500 mt-2 font-semibold">Debe ingresar un código de equipo válido antes de continuar.</p>
                            </div>
                        </div>
                    )}
                    <main className={`flex flex-col gap-x-4 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800
                ${!vehicle ? 'opacity-40 ' : ''}
                `}>
                        <div className='flex items-center gap-x-2'>
                            <MineTruck className='w-10 h-10 text-amber-400' />
                            <h2 className='text-4xl font-bold'>Información del Equipo</h2>
                        </div>
                        {/* Datps generales del equipo y la inspeccioon */}
                        <p className="text-lg text-gray-700 dark:text-white">Datos generales del equipo y la inspección</p>
                        {/* Detalles */}
                        <section className=' flex justify-between w-full gap-x-2 my-5 border-b border-b-gray-200 pb-4'>
                            <div className='flex flex-col gap-y-1'>
                                <p className="text-sm text-gray-700 dark:text-white">Código: </p>
                                <span className='font-semibold'>{vehicle?.code}</span>
                            </div>
                            <div className='flex flex-col gap-y-1'>
                                <p className="text-sm text-gray-700 dark:text-white">Inspector: </p>
                                <span className='font-semibold'>{user?.name} {user?.last_name}</span>
                            </div>
                            <div className='flex flex-col gap-y-1'>
                                <p className="text-sm text-gray-700 dark:text-white">Modelo: </p>
                                <span className='font-semibold'>{vehicle?.model.model}</span>
                            </div>
                            <div className='flex flex-col gap-y-1'>
                                <p className="text-sm text-gray-700 dark:text-white">Fecha: </p>
                                <span className='font-semibold'>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                }</span>
                            </div>
                        </section>
                        {/* Horas y Kilometraje actual input para ingresar los nuevos */}
                        <section className='flex justify-between w-full gap-x-2 my-5'>
                            <div className='flex flex-col gap-y-1 w-[50%]'>
                                <label className="text-sm text-gray-700 dark:text-white">Kilometraje Actual:</label>
                                <input
                                    type="number"
                                    min={vehicle?.kilometrage || 0}
                                    disabled={!vehicle || disableKms}
                                    value={kilometrage === null ? "" : kilometrage}
                                    onChange={(e) => {
                                        setError(null);
                                        const val = e.target.value;
                                        setKilometrage(val === "" ? null : Number(val));
                                        setSuccess(false);
                                    }}
                                    className="w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2"
                                />
                            </div>
                            <div className='flex flex-col gap-y-1 w-[50%]'>
                                <label className="text-sm text-gray-700 dark:text-white">Horas de Trabajo:</label>
                                <input
                                    type="number"
                                    min={vehicle?.hours || 0}
                                    disabled={!vehicle || disableKms}
                                    value={hours === null ? "" : hours}
                                    onChange={(e) => {
                                        setError(null);
                                        const val = e.target.value;
                                        setHours(val === "" ? null : Number(val));
                                        setSuccess(false);
                                    }}
                                    className="w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2"
                                />
                            </div>
                        </section>
                        <section className='flex justify-between w-full gap-x-2 my-5'>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={loading || !vehicle || !hasChanges || disableKms}
                                    className={`bg-amber-300  text-black font-semibold px-4 py-2 rounded
                                    ${loading || !vehicle || !hasChanges || disableKms ? 'opacity-50 ' : 'hover:bg-amber-400'}
                                    `}
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>

                                <button
                                    onClick={() => {
                                        if (vehicle) {
                                            setKilometrage(vehicle.kilometrage);
                                            setHours(vehicle.hours);
                                            setError(null);
                                            setSuccess(false);
                                        }
                                    }}
                                    className={`bg-gray-300  dark:bg-neutral-700  font-semibold dark:text-white text-black px-4 py-2 rounded
                                    ${loading || !vehicle || !hasChanges || disableKms ? 'opacity-50 ' : 'hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-neutral-600'}
                                    `}
                                >
                                    Cancelar
                                </button>
                            </div>


                            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                            {success && <p className="text-sm text-green-600 mb-2">Cambios guardados correctamente.</p>}
                        </section>
                    </main>
                </div>
                {/* Checkbox para no querer hacer cambios de kilometraje */}
                <div className="flex items-center mt-4 gap-x-2">
                    <input
                        type="checkbox"
                        id="disableKms"
                        checked={disableKms}
                        onChange={(e) => setDisableKms(e.target.checked)}
                        className="w-5 h-5 text-amber-300 accent-amber-400 rounded-lg bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="disableKms" className="text-md text-gray-700 dark:text-white">
                        No quiero modificar las horas y los kilómetros
                    </label>
                </div>
                {/* Seccion de mediciones de los neumaticos */}
                <div className="relative">
                    {/* quiero un div negro con opacity 70 que se vea disablekms */}
                    {
                        disableKms == false
                        && (
                            <div className="absolute inset-0 z-20 flex items-start pt-20 justify-center bg-transparent   border-dashed border-2 border-amber-500 rounded-md">
                                <div className="text-center p-4 px-10">
                                    <Info className="w-12 h-12 text-amber-500 mx-auto" />
                                    <h3 className="text-xl font-bold text-amber-500">Complete Paso 2</h3>
                                    <p className="text-amber-500 mt-2 font-semibold">
                                        Ingrese los kilometros y horas actuales del equipo o seleccione la opción de omitir ese paso para acceder al paso 3
                                    </p>
                                </div>
                            </div>
                        )
                    }


                    {
                        disableKms == false
                        && (
                            <div className="absolute inset-0 z-10 flex items-start pt-10 justify-center bg-black opacity-60  border-dashed border-2 border-amber-500 rounded-md">

                            </div>
                        )}

                    {
                        vehicle && (
                            <section className={`flex flex-col gap-y-2 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800
                    ${vehicle ? 'opacity-70 ' : ''}
                    `}>
                                {/* Titulo */}
                                <div className='flex items-center gap-x-2'>
                                    <Waves className='w-6 h-6 text-amber-400' />
                                    <h2 className='text-2xl font-bold'>Mediciones de Neumáticos</h2>
                                </div>
                                <p className='text-gray-700 dark:text-white'>Registre las mediciones para cada uno de los neumáticos</p>
                                {/* Seccion para las cards de los neumaticos */}
                                <section className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                    {
                                        vehicle?.installedTires.map((tire) => {
                                            const existing = inspections.find(i => i.tireId === tire.tire.id);

                                            const values = existing ?? {
                                                pressure: tire.tire.lastInspection.pressure ?? 0,
                                                temperature: tire.tire.lastInspection.temperature ?? 0,
                                                externalTread: tire.tire.lastInspection.externalTread ?? 0,
                                                internalTread: tire.tire.lastInspection.internalTread ?? 0,
                                                observation: tire.tire.lastInspection.observation ?? "",
                                            };
                                            return (

                                                <div
                                                    key={tire.id}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-colors bg-white dark:bg-neutral-800 `}

                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={skippedTires.includes(tire.tire.id)}
                                                        onChange={() => toggleSkipTire(tire.tire.id)}
                                                    />

                                                    <label className="text-sm text-gray-700 dark:text-white">
                                                        No inspeccionar este neumático
                                                    </label>
                                                    <h3 className='text-lg font-semibold'>Neumático {tire.position}</h3>
                                                    <p className='text-sm text-gray-600 dark:text-gray-300'>Código: {tire.tire.code}</p>
                                                    {/* Input de presion */}
                                                    <div className='flex flex-col gap-y-2 mt-2'>
                                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                            <Gauge size={24} className="inline mr-2 text-blue-400" />
                                                            Presión:</label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            disabled={skippedTires.includes(tire.tire.id)}
                                                            value={values.pressure ?? ""}
                                                            onChange={(e) => updateInspection(tire, 'pressure', parseFloat(e.target.value))}
                                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 `}
                                                        />
                                                    </div>
                                                    {/* Input de temperatura */}
                                                    <div className='flex flex-col gap-y-2 mt-2'>
                                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                            <Thermometer size={24} className="inline mr-2 text-red-500" />
                                                            Temperatura:</label>
                                                        <input
                                                            disabled={skippedTires.includes(tire.tire.id)}
                                                            type="number"
                                                            min={0}
                                                            value={values.temperature ?? ""}
                                                            onChange={(e) => updateInspection(tire, 'temperature', parseFloat(e.target.value))}
                                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 `}
                                                        />
                                                    </div>
                                                    {/* Input de remanente, en el mismo contenedor deben estar el interno y el externo */}
                                                    <div className='flex items-center gap-x-2 mt-2'>
                                                        <div className='flex flex-col gap-y-2 w-full'>
                                                            <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                                <Waves size={24} className="inline mr-2 text-green-500" />
                                                                Rem. Int.:</label>
                                                            <input
                                                                disabled={skippedTires.includes(tire.tire.id)}
                                                                type="number"
                                                                min={0}
                                                                max={tire.tire.lastInspection.internalTread + 5}
                                                                value={values.internalTread}
                                                                onChange={(e) => updateInspection(tire, 'internalTread', parseFloat(e.target.value))}
                                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 $`}
                                                                placeholder="Interno"
                                                            />
                                                        </div>
                                                        <div className='flex flex-col gap-y-2 w-full'>
                                                            <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                                <Waves size={24} className="inline mr-2 text-green-500" />
                                                                Rem. Ext.:</label>
                                                            <input
                                                                disabled={skippedTires.includes(tire.tire.id)}
                                                                type="number"
                                                                min={0}
                                                                max={tire.tire.lastInspection.externalTread + 5}
                                                                value={values.externalTread}
                                                                onChange={(e) => updateInspection(tire, 'externalTread', parseFloat(e.target.value))}
                                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 $`}
                                                                placeholder="Externo"
                                                            />
                                                        </div>

                                                    </div>
                                                    {/* Input para agregar comentario a cada neumatico */}
                                                    <div className='flex flex-col gap-y-2 mt-2'>
                                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>Comentario adicional:</label>
                                                        <input
                                                            disabled={skippedTires.includes(tire.tire.id)}
                                                            type="text"
                                                            value={values.observation ?? ""}
                                                            onChange={(e) => updateInspection(tire, 'observation', e.target.value)}
                                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 `}
                                                            placeholder="Ingrese observaciones"
                                                        />

                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {autoSkippedCount > 0 && (
                                        <p className="text-yellow-600 text-md font-semibold">
                                            {autoSkippedCount} neumático(s) serán omitidos automáticamente por falta de datos.
                                        </p>
                                    )}
                                </section>
                            </section>
                        )
                    }
                </div>
                {/* Botones de confirmación */}
                <div className='lg:flex gap-x-4 lg:justify-around'>
                    <button
                        disabled={autoSkippedCount == 6 ||
                            vehicle === null
                        }
                        onClick={() => setIsOpen(true)} className={`bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4
                        ${autoSkippedCount == 6 || vehicle == null ? 'opacity-50 ' : ''}
                        `}>Confirmar Datos</button>
                    <button className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>
                <small className="text-gray-700 dark:text-white text-xs">*Datos erróneos no serán aceptados por el sistema, <span className='font-bold'>Recuerde verificar sus datos</span></small>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>

                    {
                        autoSkippedCount > 0 &&
                        <p className="text-yellow-600 text-md font-semibold">
                            {autoSkippedCount} neumático(s) serán omitidos automáticamente por falta de datos.
                        </p>
                    }
                </Modal>

            </section >
            <LoadingSpinner isOpen={loading} />

        </div >
    );
}