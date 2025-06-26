'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { CheckCircle, CheckCircle2, Gauge, Info, Search, Thermometer, Waves } from "lucide-react";
import { VehicleDTO } from "@/types/Vehicle";
import axios from 'axios';
import LoadingSpinner from '@/components/common/lodaing/LoadingSpinner';
import MineTruck from '@/components/common/icons/MineTruck';
import { useAuth } from '@/contexts/AuthContext';
import { CreateInspectionDTO } from '@/types/CreateInspection';
import CustomModal from '@/components/common/alerts/alert';


type InspectionWithPhotos = CreateInspectionDTO & {
    tempPhotoIds?: string[];
    previews?: string[];
    files?: File[];
};

export default function MedicionPorEquipo() {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [inspections, setInspections] = useState<InspectionWithPhotos[]>([]);

    const [initialKilometrage, setInitialKilometrage] = useState<number>(0);
    const [initialHours, setInitialHours] = useState<number>(0);

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [vehicleCode, setVehicleCode] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);

    const [disableKms, setDisableKms] = useState(false);
    const [skippedTires, setSkippedTires] = useState<number[]>([]);
    const [originalInspections, setOriginalInspections] = useState<Record<number, CreateInspectionDTO>>({});


    const [previewsByTire, setPreviewsByTire] = useState<Record<number, string[]>>({});

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
            const originals: Record<number, CreateInspectionDTO> = {};
            response.data.installedTires.forEach((tire: any) => {
                const last = tire.tire.lastInspection;
                originals[tire.tire.id] = {
                    tireId: tire.tire.id,
                    position: tire.position,
                    pressure: last?.pressure ?? 0,
                    temperature: last?.temperature ?? 0,
                    internalTread: last?.internalTread ?? 0,
                    externalTread: last?.externalTread ?? 0,
                    observation: last?.observation ?? "",
                    kilometrage: last?.kilometrage ?? 0,
                    hours: last?.hours ?? 0,
                    inspectionDate: new Date().toISOString(),
                    inspectorId: user?.user_id || 0,
                    inspectorName: `${user?.name} ${user?.last_name}`,
                };
            });
            setOriginalInspections(originals);
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
            const newInspection: InspectionWithPhotos = {
                ...existing,
                position: tire.position,
                externalTread: field === 'externalTread' ? Number(value) : existing?.externalTread ?? last.externalTread,
                internalTread: field === 'internalTread' ? Number(value) : existing?.internalTread ?? last.internalTread,
                pressure: field === 'pressure' ? Number(value) : existing?.pressure ?? last.pressure,
                temperature: field === 'temperature' ? Number(value) : existing?.temperature ?? last.temperature,
                observation: field === 'observation' ? String(value) : existing?.observation ?? last.observation,
                inspectionDate: new Date().toISOString(),
                kilometrage: (last.kilometrage ?? 0) + kmDiff,
                hours: (last.hours ?? 0) + hoursDiff,
                tireId: tire.tire.id,
                inspectorId: user?.user_id || 0,
                inspectorName: `${user?.name} ${user?.last_name}`,
                tempPhotoIds: existing?.tempPhotoIds ?? [],
                previews: existing?.previews ?? [],
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

    // Error al enviar inspecciones
    const [errorInspection, setErrorInspection] = useState<string | null>(null);
    const handleConfirm = async () => {
        setErrorInspection(null);
        setError(null);

        try {
            if (inspections.length === 0) {
                setError("Debes registrar al menos una inspección.");
                return;
            }

            const validInspections = inspections.filter(
                insp =>
                    !skippedTires.includes(insp.tireId) &&
                    (insp.pressure !== undefined ||
                        insp.temperature !== undefined ||
                        insp.internalTread !== undefined ||
                        insp.externalTread !== undefined)
            );

            // Crear inspecciones en paralelo
            await Promise.all(
                validInspections.map(async (insp) => {
                    const tempIds: string[] = [];

                    // 1. Subir fotos temporales
                    if (insp.files && insp.files.length > 0) {
                        for (let i = 0; i < insp.files.length; i++) {
                            const tempId = insp.tempPhotoIds?.[i] || crypto.randomUUID();
                            tempIds.push(tempId);

                            const formData = new FormData();
                            formData.append("file", insp.files[i]);
                            formData.append("tempId", tempId);
                            formData.append("uploadedById", String(user?.user_id || 1));

                            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/upload`, formData);
                        }
                    }
                    const {
                        tempPhotoIds,
                        previews,
                        files,
                        ...inspectionData
                    } = insp;
                    // 2. Crear la inspección
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections`, inspectionData);
                    const createdInspection = response.data;

                    // 3. Asociar las fotos
                    for (const tempId of tempIds) {
                        await axios.patch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/inspection-photos/assign/${createdInspection.id}`,
                            { tempId }
                        );
                    }

                    console.log(`✅ Inspección ${createdInspection.id} creada y fotos asociadas`);
                })
            );

            // Limpieza
            setIsOpen(false);
            setInspections([]);
            setVehicle(null);
            setVehicleCode(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setErrorInspection(message);
                setError(message);
            }
        }
    };

    // Funcion para resetear todos los campos de inspección
    const resetInspections = () => {
        setInspections([]);
        setKilometrage(vehicle?.kilometrage || null);
        setHours(vehicle?.hours || null);
        setSkippedTires([]);
        setSuccess(false);
        setError(null);
        setDisableKms(false);
        setOriginalInspections({});
    };

    const isModified = (field: keyof CreateInspectionDTO, id: number) => {
        const original = originalInspections[id];
        const edited = inspections.find(i => i.tireId === id);
        return original && edited && original[field] !== edited[field];
    };

    const isCardModified = (tireId: number): boolean => {
        const original = originalInspections[tireId];
        const current = inspections.find(i => i.tireId === tireId);
        if (!original || !current) return false;

        return (
            original.pressure !== current.pressure ||
            original.temperature !== current.temperature ||
            original.internalTread !== current.internalTread ||
            original.externalTread !== current.externalTread ||
            original.observation !== current.observation
        );
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
                    {!vehicle || (success || disableKms) && (
                        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-transparent   border-dashed border-2 ${(success || disableKms) ? "border-green-500" : "border-amber-500"} rounded-md`}>
                            <div className="text-center p-4">
                                {
                                    (success || disableKms) ?
                                        <CheckCircle className='w-12 h-12 text-green-500 mx-auto' />
                                        : <Info className="w-12 h-12 text-amber-500 mx-auto" />
                                }
                                <h3 className={`text-xl font-bold ${(success || disableKms) ? "text-green-500" : "text-amber-500"}`}>{(success || disableKms) ? "Continue con Paso 3" : "Complete Paso 1"}</h3>
                                <p className={`${(success || disableKms) ? "text-green-500" : "text-amber-500"} mt-2 font-semibold`}>
                                    {(success || disableKms) ? "Kilometros y horas ya ingresados, continue con paso 3" : "Debe ingresar un código de equipo válido antes de continuar."}
                                </p>
                            </div>
                        </div>
                    )}
                    <main className={`flex flex-col gap-x-4 my-5 w-full border bg-white p-3 rounded-md shadow-sm shadow-gray-200 dark:bg-neutral-800 dark:text-white dark:shadow-neutral-800
                ${!vehicle || (success || disableKms) ? 'opacity-40 ' : ''}
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
                                    disabled={loading || !vehicle || !hasChanges || disableKms || success}
                                    className={`bg-amber-300  text-black font-semibold px-4 py-2 rounded
                                    ${loading || !vehicle || !hasChanges || disableKms || success ? 'opacity-50 ' : 'hover:bg-amber-400'}
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
                                    ${loading || !vehicle || !hasChanges || disableKms || success ? 'opacity-50 ' : 'hover:cursor-pointer hover:bg-gray-400 dark:hover:bg-neutral-600'}
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
                        disabled={vehicle === null || success}
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
                        vehicle && (disableKms || success) == false
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
                        vehicle && (disableKms || success) == false
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
                                            const inspection = inspections.find(i => i.tireId === tire.tire.id);

                                            const values = inspection ?? {
                                                pressure: tire.tire.lastInspection.pressure ?? 0,
                                                temperature: tire.tire.lastInspection.temperature ?? 0,
                                                externalTread: tire.tire.lastInspection.externalTread ?? 0,
                                                internalTread: tire.tire.lastInspection.internalTread ?? 0,
                                                observation: tire.tire.lastInspection.observation ?? "",
                                                previews: [],
                                                tempPhotoIds: [],
                                                files: [],
                                            };

                                            return (
                                                <div
                                                    key={tire.id}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-colors
    ${isCardModified(tire.tire.id)
                                                            ? 'border-green-400 bg-yellow-50 dark:border-green-500 dark:bg-neutral-900'
                                                            : 'bg-white dark:bg-neutral-800'}
  `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={skippedTires.includes(tire.tire.id)}
                                                        onChange={() => toggleSkipTire(tire.tire.id)}
                                                        className="w-4 h-4 text-amber-300 accent-amber-400 rounded-lg bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 mr-2"
                                                    />
                                                    <label className="text-md text-gray-700 dark:text-white">
                                                        No inspeccionar este neumático
                                                    </label>

                                                    <h3 className="text-lg font-semibold">Neumático {tire.position}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">Código: {tire.tire.code}</p>

                                                    {/* Inputs de inspección */}
                                                    {/* Presión */}
                                                    <div className='flex flex-col gap-y-2 mt-2'>
                                                        <label className='text-md font-semibold text-gray-700 dark:text-white'>
                                                            <Gauge size={24} className="inline mr-2 text-blue-400" />
                                                            Presión:</label>
                                                        <input
                                                            disabled={skippedTires.includes(tire.tire.id)}
                                                            type="number"
                                                            min={0}
                                                            value={values.pressure ?? ""}
                                                            onChange={(e) => updateInspection(tire, 'pressure', parseFloat(e.target.value))}
                                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 ${isModified('pressure', tire.tire.id) ? 'border-yellow-500' : ''}`}
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
                                                            className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 
                                                                ${isModified('temperature', tire.tire.id) ? 'border-yellow-500' : ''}
                                                                `}
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
                                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 
                                                                    ${isModified('internalTread', tire.tire.id) ? 'border-yellow-500' : ''}`}
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
                                                                className={`w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2 
                                                                    ${isModified('externalTread', tire.tire.id) ? 'border-yellow-500' : ''}`}
                                                                placeholder="Externo"
                                                            />
                                                        </div>

                                                    </div>

                                                    {/* Comentario */}
                                                    <div className="flex flex-col gap-y-2 mt-2">
                                                        <label className="text-md font-semibold text-gray-700 dark:text-white">
                                                            Comentario adicional:
                                                        </label>
                                                        <input
                                                            disabled={skippedTires.includes(tire.tire.id)}
                                                            type="text"
                                                            value={values.observation}
                                                            onChange={(e) => updateInspection(tire, "observation", e.target.value)}
                                                            className="w-full bg-gray-50 dark:bg-[#414141] rounded-sm border border-gray-300 p-2"
                                                            placeholder="Ingrese observaciones"
                                                        />
                                                    </div>

                                                    {/* Subida de fotos */}
                                                    <div className="flex flex-col gap-y-2 mt-4">
                                                        <label className="text-md font-semibold text-gray-700 dark:text-white">Fotos:</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            disabled={skippedTires.includes(tire.tire.id)}

                                                            onChange={(e) => {
                                                                const selected = Array.from(e.target.files || []);
                                                                const previews = selected.map(file => URL.createObjectURL(file));
                                                                const tempIds = selected.map(() => crypto.randomUUID());

                                                                setInspections(prev =>
                                                                    prev.map(i =>
                                                                        i.tireId === tire.tire.id
                                                                            ? {
                                                                                ...i,
                                                                                previews: [...(i.previews || []), ...previews],
                                                                                tempPhotoIds: [...(i.tempPhotoIds || []), ...tempIds],
                                                                                files: [...(i.files || []), ...selected],
                                                                            }
                                                                            : i
                                                                    )
                                                                );
                                                            }}
                                                            className="block w-full text-sm text-gray-900 dark:text-white"
                                                        />
                                                        {/* Mostrar previews */}
                                                        {values.previews && values.previews.length > 0 && (
                                                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                                                {values.previews.map((src, i) => (
                                                                    <div key={i} className="relative w-[100px] h-[80px] flex-shrink-0">
                                                                        <img
                                                                            src={src}
                                                                            alt={`Preview ${i}`}
                                                                            className="object-cover w-full h-full rounded"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
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
                    {/* Boton de reset */}
                    <button
                        onClick={() => {
                            resetInspections();
                            window.location.reload();
                        }}
                        className="bg-amber-50 border border-black font-bold text-black w-full lg:w-48 px-4 py-2 rounded-lg mt-4">Cancelar</button>
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

                {
                    errorInspection &&
                    <CustomModal isOpen={!!errorInspection} onClose={() => setErrorInspection(null)} title="Error" message={errorInspection} />
                }

            </section >
            <LoadingSpinner isOpen={loading} />

        </div >
    );
}