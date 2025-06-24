'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { Camera, File, Gauge, Search, Thermometer, Waves } from "lucide-react";
import { VehicleDTO } from "@/types/Vehicle";
import axios from 'axios';
import LoadingSpinner from '@/components/common/lodaing/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { CreateInspectionDTO } from '@/types/CreateInspection';
import { TireDTO } from '@/types/Tire';

export default function MedicionPorEquipo() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [inspection, setInspeciton] = useState<CreateInspectionDTO | null>(null);

    // Buscar neumatico por codigo

    const [tireCode, setTireCode] = useState<string | null>(null);
    const [tire, setTire] = useState<TireDTO | null>(null);

    // Estados para las fotos
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [tempId, setTempId] = useState<string>(() => crypto.randomUUID());

    const fetchTire = async () => {
        if (!tireCode) {
            setError("Por favor, ingrese un código de neumático.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tires/code/${tireCode}/site/1`);
            setTire(response.data);
            setError(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
                setError("Error inesperado al buscar el neumático.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!inspection) return;
        try {
            setUploading(true);

            const tempIds: string[] = []; // ✅ debe estar acá arriba

            // Subir todas las fotos temporalmente
            if (files.length > 0) {
                for (const file of files) {
                    const fileTempId = crypto.randomUUID(); // ✅ distinto para cada archivo
                    tempIds.push(fileTempId);

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("tempId", fileTempId);
                    formData.append("uploadedById", String(user?.user_id || 1));

                    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/upload`, formData);
                }
            }

            // Crear inspección
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections`, inspection);
            const createdInspection = response.data;

            // Asociar todas las fotos al ID de inspección
            for (const tempId of tempIds) {
                await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/assign/${createdInspection.id}`, {
                    tempId
                });
            }
            console.log("✅ Fotos asociadas a la inspección");

            // Reset
            setFiles([]);
            setPreviews([]);
            setIsOpen(false);
            setInspeciton(null);
            setTire(null);
            setTireCode(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setUploading(false);
        }
    };

    const updateInspection = (
        tire: TireDTO,
        field: keyof CreateInspectionDTO,
        value: string | number
    ) => {
        setInspeciton(prev => {
            const newInspection: CreateInspectionDTO = {
                position: tire.lastInspection?.position ?? "",
                externalTread: field === 'externalTread' ? Number(value) : prev?.externalTread ?? tire.lastInspection.externalTread,
                internalTread: field === 'internalTread' ? Number(value) : prev?.internalTread ?? tire.lastInspection.internalTread,
                pressure: field === 'pressure' ? Number(value) : prev?.pressure ?? tire.lastInspection.pressure,
                temperature: field === 'temperature' ? Number(value) : prev?.temperature ?? tire.lastInspection.temperature,
                observation: field === 'observation' ? String(value) : prev?.observation ?? tire.lastInspection.observation,
                inspectionDate: new Date().toISOString(),
                kilometrage: tire.lastInspection.kilometrage ?? 0,
                hours: tire.lastInspection.hours ?? 0,
                tireId: tire.id,
                inspectorId: user?.user_id || 0,
                inspectorName: `${user?.name ?? ""} ${user?.last_name ?? ""}`.trim(),
            };
            return newInspection;
        });
    };

    const resetData = () => {
        setTireCode(null);
        setTire(null);
        setInspeciton(null);
        setError(null);
        setFiles([]);
        setPreviews([]);
    };

    const removePhoto = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (tire?.lastInspection) {
            setInspeciton({
                position: tire.lastInspection.position ?? "",
                externalTread: tire.lastInspection.externalTread ?? 0,
                internalTread: tire.lastInspection.internalTread ?? 0,
                pressure: tire.lastInspection.pressure ?? 0,
                temperature: tire.lastInspection.temperature ?? 0,
                observation: tire.lastInspection.observation ?? "",
                inspectionDate: new Date().toISOString(),
                kilometrage: tire.lastInspection.kilometrage ?? 0,
                hours: tire.lastInspection.hours ?? 0,
                tireId: tire.id,
                inspectorId: user?.user_id || 0,
                inspectorName: `${user?.name ?? ""} ${user?.last_name ?? ""}`.trim(),
            });
        }
    }, [tire, user]);

    return (
        <div className="  p-4 gap-y-2 bg-white dark:bg-[#212121] dark:text-white">
            <h1 className='text-2xl lg:text-3xl mb-2 font-bold'>Inspección Individual de Neumático</h1>
            <p className='text-gray-700 dark:text-white text-sm mb-4'>
                Ingresa el código para inspeccionar un neumático específico
            </p>
            <section className=' max-auto'>
                {/* Seccion buscador */}
                <section className='flex flex-col gap-2 bg-neutral-800 p-3 rounded-md border dark:border-neutral-700'>
                    {/* Subtitulo de busqueda */}
                    <h3 className="text-2xl mb-1 text-black font-semibold dark:text-white ">
                        <Search className="w-6 h-6 inline mr-1" />
                        Buscar Neumático
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-white">Ingrese el código del equipo para inspeccionar un neumático específico</p>
                    <div className='flex gap-x-2 items-center mt-4'>
                        <input
                            onChange={(e) => setTireCode(e.target.value.toUpperCase())}
                            value={tireCode || ""}
                            placeholder="Código Neumático"
                            name='tireCode'
                            type="text" className="w-2/3 bg-gray-50 dark:bg-[#414141] rounded-lg border dark:border-neutral-700 p-2" />
                        <button onClick={() => fetchTire()} className="bg-amber-300 hover:bg-amber-400 hover:cursor-pointer text-black p-2 font-bold rounded-lg">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                    <div>
                        {error && <div className="text-red-500 flex justify-between text-sm w-80 bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                            <button onClick={() => setError("")} className=" text-red-500">
                                X
                            </button>
                        </div>
                        }
                    </div>
                </section>

                {/* Seccion detalles de la inspeccion, nombre del inspector, fecha de hoy */}
                <section className='flex flex-col gap-4 bg-neutral-800 p-3 rounded-md border dark:border-neutral-700 mt-4'>
                    <h3 className="text-2xl mb-1 text-black items-center font-semibold dark:text-white ">
                        <File className="w-6 h-6 inline mr-1" />
                        Detalles de Inspección
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-white">Seleccione un neumático para inspeccionar</p>
                    <div className='flex justify-between gap-x-2 items-center mt-4'>
                        <div className=' flex flex-col gap-y-2'>
                            <p className='text-black dark:text-white '>Inspector:</p>
                            <p className='text-black dark:text-white font-semibold'>{user?.name || "Usuario No Disponible"}
                                {user?.last_name ? ` ${user.last_name}` : ""}
                            </p>
                        </div>
                        {/* Fecha de inspeccion */}
                        <div className='flex flex-col gap-y-2'>
                            <p className='text-black dark:text-white '>Fecha de Inspección:</p>
                            <p className='text-black dark:text-white font-semibold'>{new Date().toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })}</p>
                        </div>
                        {/* Posicion del neumatico */}
                        <div className='flex flex-col gap-y-2'>
                            <p className='text-black dark:text-white'>Posición:</p>
                            <p className='text-black dark:text-white font-semibold'>
                                {tire ? tire.lastInspection.position : "Seleccione un neumático"}
                            </p>
                        </div>
                        {/* Equipo */}
                        <div className='flex flex-col gap-y-2'>
                            <p className='text-black dark:text-white'>Equipo:</p>
                            <p className='text-black dark:text-white font-semibold'>
                                {tire?.installedTires[0] ? tire.installedTires[0].vehicle.code : "Equipo No Disponible"}
                            </p>
                        </div>
                    </div>
                </section>
                {
                    tire &&

                    <main
                        className={`p-4 rounded-lg mt-3 border cursor-pointer transition-colors bg-white dark:bg-neutral-800 dark:border-neutral-700`}

                    >
                        <h3 className='text-lg font-semibold'>Neumático {tire?.lastInspection.position}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>Código: {tire?.code}</p>
                        {/* Input de presion */}
                        <div className='flex flex-col gap-y-2 mt-2'>
                            <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                <Gauge size={24} className="inline mr-2 text-blue-400" />
                                Presión:</label>
                            <input
                                type="number"
                                min={0}
                                value={inspection?.pressure ?? ""}
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
                                value={inspection?.temperature ?? ""}
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
                                    max={(tire?.lastInspection.internalTread ?? 0) + 5}
                                    value={inspection?.internalTread ?? ""}
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
                                    max={(tire?.lastInspection.externalTread ?? 0) + 5}
                                    value={inspection?.externalTread ?? ""}
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
                                value={inspection?.observation ?? ""}
                                onChange={(e) => updateInspection(tire, 'observation', e.target.value)}
                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 `}
                                placeholder="Ingrese observaciones"
                            />

                        </div>
                        {/* Input para fotos,  */}
                        <section className="flex gap-x-4 mt-4 w-full">
                            {/* Columna izquierda: selector de archivo */}
                            <div className="flex flex-col gap-y-2 w-1/3">
                                <label className="text-md font-semibold text-gray-700 dark:text-white">
                                    Foto del Neumático
                                </label>
                                <div className="relative w-full h-full hover:bg-amber-50 dark:hover:bg-neutral-900 transition-colors">
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.files || []);
                                            setFiles(prev => [...prev, ...selected]);
                                            setPreviews(prev => [...prev, ...selected.map((file) => URL.createObjectURL(file))]);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="flex flex-col border-dashed justify-center items-center h-[100%] w-full border-2 border-amber-300 text-center py-2 font-semibold rounded-md cursor-pointer text-amber-300 hover:bg-amber-400 transition-colors"
                                    >
                                        <Camera size={45} className="inline mr-2" />
                                        {files.length > 0 ? "Cambiar Foto" : "Subir Foto"}
                                    </label>
                                </div>
                            </div>

                            {/* Columna derecha: carrusel horizontal de previews */}
                            <div className="w-2/3 overflow-x-auto">
                                {previews.length > 0 && (
                                    <div className="flex gap-2 flex-nowrap min-w-max mt-1">
                                        {previews.map((src, i) => (
                                            <div
                                                key={i}
                                                className="relative group w-[120px] h-[100px] flex-shrink-0"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Preview ${i}`}
                                                    className="object-cover w-full h-full border rounded shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(i)}
                                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition"
                                                    title="Eliminar foto"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                }

                <div className='lg:flex gap-x-4 lg:justify-around'>
                    {/* Boton de confirmar */}
                    <button disabled={tire == null} onClick={() => setIsOpen(true)} className={`bg-amber-300 text-black w-full lg:w-48 px-4 font-bold py-2 rounded-lg mt-4
                        ${tire == null ? "opacity-50 " : "hover:bg-amber-400 hover:cursor-pointer"}
                        `}>Confirmar Datos
                    </button>
                    {/* Boton de cancelar */}
                    <button onClick={resetData} className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
                </div>

                {/* Disclaimer */}
                <small className="text-gray-700 dark:text-white text-xs">*Datos erróneos no serán aceptados por el sistema, <span className='font-bold'>Recuerde verificar sus datos</span></small>

                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} title="¿Estás seguro?">
                    <p>¿Quieres confirmar esta acción?</p>
                </Modal>

            </section>
            <LoadingSpinner isOpen={loading} />

        </div>
    );
}