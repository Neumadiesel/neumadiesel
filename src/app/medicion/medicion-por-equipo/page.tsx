'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { Gauge, Search, Thermometer, Waves } from "lucide-react";
import { VehicleDTO } from "@/types/Vehicle";
import axios from 'axios';
import LoadingSpinner from '@/components/common/lodaing/LoadingSpinner';
import MineTruck from '@/components/common/icons/MineTruck';
import { useAuth } from '@/contexts/AuthContext';

export default function MedicionPorEquipo() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);
    const [vehicleCode, setVehicleCode] = useState<string | null>(null);
    const [tireSelected, setTireSelected] = useState<VehicleDTO["installedTires"][0] | null>(null);


    const [tireInspected, setTireInspected] = useState({
        position: 0,
        externalTread: 0,
        internalTread: 0,
        kilometrage: 0,
        pressure: 0,
        temperature: 0,
        observation: "",
        inspectionDate: new Date().toISOString(),
        tireId: 0
    });

    useEffect(() => {
        if (tireSelected) {
            setTireInspected({
                position: tireSelected.position,
                externalTread: tireSelected.tire.lastInspection.externalTread,
                internalTread: tireSelected.tire.lastInspection.internalTread,
                kilometrage: vehicle?.kilometrage || 0,
                pressure: tireSelected.tire.lastInspection.pressure,
                temperature: tireSelected.tire.lastInspection.temperature,
                observation: tireSelected.tire.lastInspection.observation,
                inspectionDate: new Date().toISOString(),
                tireId: tireSelected.tire.id
            });
        }
    }, [tireSelected, vehicle]);

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

    const handleInputChange = (
        type: "ext" | "int" | "pre" | "tem",
        value: number
    ) => {
        setTireInspected((prev) => ({
            ...prev,
            ...(type === "ext" && { externalTread: value }),
            ...(type === "int" && { internalTread: value }),
            ...(type === "pre" && { pressure: value }),
            ...(type === "tem" && { temperature: value }),
        }));
    };
    const resetData = () => {
        setTireSelected(null);
        setTireInspected({
            position: 0,
            externalTread: 0,
            internalTread: 0,
            kilometrage: 0,
            pressure: 0,
            temperature: 0,
            observation: "",
            inspectionDate: new Date().toISOString(),
            tireId: 0
        });
    }

    useEffect(() => {
        console.log(loading)
        if (!tireSelected) {
            setTireInspected({
                position: 0,
                externalTread: 0,
                internalTread: 0,
                kilometrage: 0,
                pressure: 0,
                temperature: 0,
                observation: "",
                inspectionDate: new Date().toISOString(),
                tireId: 0
            });
        }
    }, [tireSelected]);

    const handleConfirm = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections`, tireInspected);
            setIsOpen(false);
            resetData();
            return response.data;
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
                            vehicle?.installedTires.map((tire) => (
                                <div
                                    key={tire.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${tireSelected?.id === tire.id ? "bg-gray-50 dark:bg-neutral-900" : "bg-white dark:bg-neutral-800"} hover:bg-gray-100 dark:hover:bg-neutral-900`}
                                    onClick={() => {
                                        setTireSelected(tire);
                                        setTireInspected({
                                            position: tire.position,
                                            externalTread: tire.tire.lastInspection.externalTread,
                                            internalTread: tire.tire.lastInspection.internalTread,
                                            kilometrage: vehicle?.kilometrage || 0,
                                            pressure: tire.tire.lastInspection.pressure,
                                            temperature: tire.tire.lastInspection.temperature,
                                            observation: tire.tire.lastInspection.observation,
                                            inspectionDate: new Date().toISOString(),
                                            tireId: tire.tire.id
                                        });
                                    }}
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
                                            value={tireInspected.pressure}
                                            disabled={!tireSelected}
                                            onChange={(e) => handleInputChange("pre", parseFloat(e.target.value))}
                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${tireSelected ? "" : "opacity-50"}`}
                                        />
                                    </div>
                                    {/* Input de temperatura */}
                                    <div className='flex flex-col gap-y-2 mt-2'>
                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                            <Thermometer size={24} className="inline mr-2 text-red-500" />
                                            Temperatura:</label>
                                        <input
                                            type="number"
                                            value={tireInspected.temperature}
                                            disabled={!tireSelected}
                                            onChange={(e) => handleInputChange("tem", parseFloat(e.target.value))}
                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${tireSelected ? "" : "opacity-50"}`}
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
                                                value={tireInspected.externalTread}
                                                disabled={!tireSelected}
                                                onChange={(e) => handleInputChange("ext", parseFloat(e.target.value))}
                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${tireSelected ? "" : "opacity-50"}`}
                                                placeholder="Externo"
                                            />
                                        </div>
                                        <div className='flex flex-col gap-y-2 w-full'>
                                            <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                <Waves size={24} className="inline mr-2 text-green-500" />
                                                Rem. Ext.:</label>
                                            <input
                                                type="number"
                                                value={tireInspected.internalTread}
                                                disabled={!tireSelected}
                                                onChange={(e) => handleInputChange("int", parseFloat(e.target.value))}
                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${tireSelected ? "" : "opacity-50"}`}
                                                placeholder="Interno"
                                            />
                                        </div>
                                    </div>
                                    {/* Input para agregar comentario a cada neumatico */}
                                    <div className='flex flex-col gap-y-2 mt-2'>
                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>Comentario adicional:</label>
                                        <input
                                            type="text"
                                            value={""}
                                            disabled={!tireSelected}
                                            onChange={(e) =>
                                                setTireInspected((prev) => ({ ...prev, observation: e.target.value }))
                                            }
                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${tireSelected ? "" : "opacity-50"}`}
                                            placeholder="Ingrese observaciones"
                                        />

                                    </div>

                                </div>
                            ))
                        }

                    </section>

                </section>

                <div className={`${tireSelected ? "" : "opacity-50"}`}>
                    <label className="text-md mb-1 text-black font-semibold dark:text-white ">Observaciones:</label>
                    <textarea
                        disabled={!tireSelected}
                        value={tireInspected.observation}
                        onChange={(e) =>
                            setTireInspected((prev) => ({ ...prev, observation: e.target.value }))
                        }
                        className="w-full bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2"
                    />

                </div>

                <div className='lg:flex gap-x-4 lg:justify-around'>
                    <button onClick={() => setIsOpen(true)} className="bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4">Confirmar Datos</button>
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