'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { Gauge, Search, Thermometer, Waves } from "lucide-react";
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



    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [vehicleCode, setVehicleCode] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);

    const fetchVehicle = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1/${vehicleCode}`);
            console.log("Vehículo", response.data);
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
        setInspections(prev => {
            const existing = prev.find(i => i.tireId === tire.tire.id);
            const newInspection: CreateInspectionDTO = {
                position: tire.position,
                externalTread: field === 'externalTread' ? Number(value) : existing?.externalTread ?? tire.tire.lastInspection.externalTread,
                internalTread: field === 'internalTread' ? Number(value) : existing?.internalTread ?? tire.tire.lastInspection.internalTread,
                pressure: field === 'pressure' ? Number(value) : existing?.pressure ?? tire.tire.lastInspection.pressure,
                temperature: field === 'temperature' ? Number(value) : existing?.temperature ?? tire.tire.lastInspection.temperature,
                observation: field === 'observation' ? String(value) : existing?.observation ?? tire.tire.lastInspection.observation,
                inspectionDate: new Date().toISOString(),
                kilometrage: vehicle?.kilometrage ?? 0,
                hours: vehicle?.hours ?? 0,
                tireId: tire.tire.id,
                inspectorId: user?.user_id || 0,
                inspectorName: `${user?.name} ${user?.last_name}`,
            };

            const filtered = prev.filter(i => i.tireId !== tire.tire.id);
            return [...filtered, newInspection];
        });
    };

    const totalTires = vehicle?.installedTires.length ?? 0;
    const completed = inspections.length;
    const progress = totalTires > 0 ? Math.round((completed / totalTires) * 100) : 0;


    const handleConfirm = async () => {
        try {
            if (inspections.length === 0) {
                setError("Debes registrar al menos una inspección.");
                return;
            }

            // Enviar todas las inspecciones en paralelo
            await Promise.all(
                inspections.map((insp) =>
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
                <div className='flex flex-col gap-x-4 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800'>
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

                </div>
                <div className="my-4 w-full">
                    <label className="text-sm font-semibold">Progreso de inspección: {progress}%</label>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                        <div
                            className="bg-amber-400 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                {/* Seccion de mediciones de los neumaticos */}
                <section className='flex flex-col gap-y-2 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800'>
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

                    </section>
                </section>
                {/* Barra de progreso */}
                <div className="my-4 w-full">
                    <label className="text-sm font-semibold">Progreso de inspección: {progress}%</label>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                        <div
                            className="bg-amber-400 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                {/* Botones de confirmación */}
                <div className='lg:flex gap-x-4 lg:justify-around'>
                    <button
                        disabled={progress < 80}
                        onClick={() => setIsOpen(true)} className={`bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4
                        ${progress < 80 ? 'opacity-50 ' : ''}
                        `}>Confirmar Datos</button>
                    <button className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>
                <small className="text-gray-700 dark:text-white text-xs">*Datos erróneos no serán aceptados por el sistema, <span className='font-bold'>Recuerde verificar sus datos</span></small>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>

            </section>
            <LoadingSpinner isOpen={loading} />

        </div>
    );
}