'use client';
import { useState } from 'react';
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

    const [skippedTires, setSkippedTires] = useState<number[]>([]);

    const toggleSkipTire = (tireId: number) => {
        setSkippedTires((prev) =>
            prev.includes(tireId)
                ? prev.filter((id) => id !== tireId)
                : [...prev, tireId]
        );
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
    const totalTires = vehicle?.installedTires.length ?? 0;

    const inspectedIds = inspections.map(i => i.tireId);
    const manuallySkippedIds = skippedTires;

    const autoSkippedCount = vehicle?.installedTires.filter(
        tire =>
            !inspectedIds.includes(tire.tire.id) &&
            !manuallySkippedIds.includes(tire.tire.id)
    ).length ?? 0;

    const completed = inspectedIds.length + manuallySkippedIds.length + autoSkippedCount;


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
                        <div className=' flex gap-x-2 items-center w-full'>
                            <input
                                onChange={(e) => setVehicleCode(e.target.value.toUpperCase())}
                                value={vehicleCode || ""}
                                placeholder="Código equipo"

                                type="text" className="w-[70%] bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-100 p-2" />
                            <button onClick={() => fetchVehicle()} className="bg-amber-300 hover:bg-amber-400 hover:cursor-pointer text-black p-2 font-bold rounded-lg">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Error */}

                        <div className='w-full flex justify-end items-center'>
                            {error && <div className="text-red-500 font-semibold flex justify-between text-sm w-[80%] bg-red-50 border border-red-300 p-3 rounded-sm">{error}
                                <button onClick={() => setError("")} className=" text-red-500">
                                    X
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
                                    disabled={!vehicle}
                                    value={vehicle?.kilometrage || ""}
                                    onChange={(e) =>
                                        setVehicle((prev) =>
                                            prev
                                                ? { ...prev, kilometrage: parseFloat(e.target.value) }
                                                : prev // or null
                                        )
                                    }
                                    className="w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2"
                                />
                            </div>
                            <div className='flex flex-col gap-y-1 w-[50%]'>
                                <label className="text-sm text-gray-700 dark:text-white">Horas de Trabajo:</label>
                                <input
                                    type="number"
                                    disabled={!vehicle}
                                    value={vehicle?.hours || ""}
                                    onChange={(e) =>
                                        setVehicle((prev) =>
                                            prev
                                                ? { ...prev, hours: parseFloat(e.target.value) }
                                                : prev // or null
                                        )
                                    }
                                    className="w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2"
                                />
                            </div>
                        </section>

                    </main>
                </div>
                {/* Seccion de mediciones de los neumaticos */}
                {
                    vehicle && (
                        <section className={`flex flex-col gap-y-2 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800
                    ${!vehicle ? 'opacity-50 ' : ''}
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
                                                className={`p-4 rounded-lg border cursor-pointer transition-colors bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900`}

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

            </section>
            <LoadingSpinner isOpen={loading} />

        </div>
    );
}