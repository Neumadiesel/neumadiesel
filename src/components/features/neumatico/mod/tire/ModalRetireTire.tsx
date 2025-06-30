"use client";

import { useState, useEffect } from "react";

import { TireDTO } from "@/types/Tire";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, CircleX } from "lucide-react";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuthFetch } from "@/utils/AuthFetch";
import axios from "axios";


interface ModalRetireTireProps {
    visible: boolean;
    onClose: () => void;
    tire: TireDTO | null;
    onGuardar: () => void;
}

interface MaintenanceReasonDTO {
    id: number;
    description: string;
}



export default function ModalRetireTire({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalRetireTireProps) {
    const { user } = useAuth();

    const client = useAxiosWithAuth();
    const [tireEdited, setTireEdited] = useState({
        code: "",
        locationId: null as number | null,
        usedHours: "",
        usedKilometrage: "",
        locationMaintenanceId: null as number | null,
        date: "",
        maintenanceReasonId: null as number | null,
        executionTime: null as number | null,
        internalTread: tire?.lastInspection.internalTread || null,
        externalTread: tire?.lastInspection.externalTread || null,
    });

    const [executionDate, setExecutionDate] = useState<Date>(new Date());
    const [finalKilometrage, setFinalKilometrage] = useState<number>(tire?.lastInspection.kilometrage || 0);
    const [finalHours, setFinalHours] = useState<number>(tire?.lastInspection.hours || 0);
    const [finalInternalTread, setFinalInternalTread] = useState<number>(tire?.lastInspection.internalTread || 0);
    const [finalExternalTread, setFinalExternalTread] = useState<number>(tire?.lastInspection.externalTread || 0);
    const [retirementReason, setRetirementReason] = useState<string>("");
    const [finalComment, setFinalComment] = useState<string>("");

    // Estado para las fotos 
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const authFetch = useAuthFetch();

    const [maintenanceReasons, setMaintenanceReasons] = useState<MaintenanceReasonDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const fetchReasons = async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-reason`);
            const data = await response.json();
            setLoading(false);
            setMaintenanceReasons(
                Array.isArray(data)
                    ? data.filter(
                        (reason: MaintenanceReasonDTO) =>
                            !/Desinstalaci[oó]n|Instalaci[oó]n|Baja/i.test(reason.description)
                    )
                    : []
            );
        } catch (error) {
            console.error("Error fetching maintenance reasons:", error);
            setLoading(false);
            setError("Error al cargar las razones de mantenimiento");
        }
    };

    useEffect(() => {
        if (tire) {
            setTireEdited({
                code: tire.code,
                locationId: tire.location.id,
                usedHours: tire.usedHours?.toString() ?? "",
                usedKilometrage: tire.lastInspection.kilometrage?.toString() ?? "",
                maintenanceReasonId: null,
                locationMaintenanceId: 0,
                date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
                executionTime: 0,
                internalTread: tire.lastInspection.internalTread,
                externalTread: tire.lastInspection.externalTread,
            });
            setFinalHours(tire.lastInspection.hours || 0);
            setFinalKilometrage(tire.lastInspection.kilometrage || 0);
            setFinalInternalTread(tire.lastInspection.internalTread || 0);
            setFinalExternalTread(tire.lastInspection.externalTread || 0);
        }
    }, [tire]);

    useEffect(() => {
        fetchReasons();
    }, []);

    useEffect(() => {
        fetchReasons();
    }, [user]);
    if (!visible || !tire) return null;


    const handleSubmit = async () => {
        setError("");
        setLoading(true);



        const { code, locationId, usedHours, usedKilometrage } = tireEdited;

        if (
            !code ||
            usedHours === "" ||
            usedKilometrage === ""
            || locationId === null
            || tireEdited.date === ""
            || tireEdited.executionTime === null
            || tireEdited.externalTread === null
            || tireEdited.internalTread === null
        ) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        console.log("Locacion", tireEdited.locationId)
        try {

            setUploading(!uploading);

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


                    await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tire-retire-photos/upload`, formData);
                }
            }


            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/tire-retirement`,
                {
                    tireId: tire.id,
                    retirementReasonId: Number(retirementReason),
                    finalInternalTread: finalInternalTread,
                    finalExternalTread: finalExternalTread,
                    retirementDate: executionDate.toISOString().split("T")[0], // yyyy-mm-dd
                    finalKilometrage: finalKilometrage,
                    finalHours: finalHours,
                    finalComment: finalComment,
                },
            );

            const retireTire = response.data.tireRetirement;

            console.log("✅ Neumático retirado:", retireTire);
            console.log("✅ Neumático retirado ID:", retireTire.id);

            // Asociar todas las fotos al ID de del neumático retirado
            for (const tempId of tempIds) {

                await client.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tire-retire-photos/assign/${retireTire.id}`, {
                    tempId
                });
            }
            console.log("✅ Fotos asociadas al neumático retirado:", retireTire.id);

            setFiles([]);
            setPreviews([]);

            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error desconocido";
                setError(message);
            } else {
                console.error("Error inesperado:", error);
            }
        } finally {
            setUploading(false);
            setLoading(false);
        }
    };


    const removePhoto = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setError("");
        setTireEdited({
            code: "",
            locationId: null,
            usedHours: "",
            usedKilometrage: "",
            locationMaintenanceId: null,
            date: "",
            maintenanceReasonId: null,
            executionTime: null,
            internalTread: null,
            externalTread: null,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className=" grid grid-cols-2 rounded-md h-[80dvh] shadow-lg">

                <main className="relative bg-white dark:text-white border-l-10 border-l-red-500 dark:bg-[#212121] p-6 max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-4">
                        Dar De Baja Neumático
                    </h2>

                    {/* Mostrar error si existe */}
                    {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                        <button onClick={() => setError("")} className=" text-red-500">
                            X
                        </button>
                    </div>}
                    <div className="grid grid-cols-2 gap-1">
                        {/* Codigo Neumatico */}
                        <Label title="Código Neumático" isNotEmpty={true} />
                        <input
                            disabled={true}
                            name="Codigo Neumatico"
                            value={tire.code}

                            placeholder="Código Neumático"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Razon de mantencion */}
                        <Label title="Razón de Baja" isNotEmpty={true} />
                        <select
                            value={retirementReason || ""}
                            onChange={(e) =>
                                setRetirementReason(e.target.value)
                            }
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="">Seleccionar Razón</option>
                            {maintenanceReasons.map((reason) => (
                                <option key={reason.id} value={reason.id}>
                                    {reason.description}
                                </option>
                            ))}
                        </select>
                        {/* Input de fecha de Baja */}
                        <Label title="Fecha y Hora de Baja" isNotEmpty={true} />
                        <input
                            type="datetime-local"
                            value={executionDate.toISOString().slice(0, 16)}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                if (!isNaN(date.getTime())) {
                                    setExecutionDate(date);
                                }
                            }}
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Horas Acumuladas */}
                        <Label title="Horas Finales" isNotEmpty={true} />
                        <input
                            name="Horas Finales"
                            type="number"
                            min="0"
                            value={finalHours}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) { // solo dígitos
                                    setFinalHours(Number(value));
                                }
                            }}
                            onBlur={() => {
                                if (finalHours.toString() == "") {
                                    setFinalHours(0);
                                }
                            }}
                            placeholder="Horas Finales"
                            className="border border-gray-300 p-2 rounded"
                        />
                        {/* Kilometraje Usado */}
                        <Label title="Kilometraje Final" isNotEmpty={true} />
                        <input
                            name="Kilometraje Final"
                            type="number"
                            min="0"
                            value={finalKilometrage}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setFinalKilometrage(Number(value));
                                }
                            }}
                            onBlur={() => {
                                if (finalKilometrage.toString() === "") {
                                    setFinalKilometrage(0);
                                }
                            }}
                            placeholder="Kilometraje Usado"
                            className="border border-gray-300 p-2 rounded"
                        />


                        {/* Remanente interno */}
                        <Label title="Remanente Interno" isNotEmpty={true} />
                        <input
                            name="Remanente Interno"
                            type="number"
                            min="0"
                            placeholder="Remanente Interno"
                            className="border border-gray-300 p-2 rounded"
                            value={finalInternalTread}
                            onChange={(e) => {
                                setFinalInternalTread(e.target.value.trim() === "" ? 0 : Number(e.target.value));
                            }
                            }
                        />
                        {/* Remantente externo */}
                        <Label title="Remanente Externo" isNotEmpty={true} />
                        <input
                            name="Remanente Externo"
                            type="number"
                            min="0"
                            placeholder="Remanente Externo"
                            className="border border-gray-300 p-2 rounded"
                            value={finalExternalTread}
                            onChange={(e) => {
                                setFinalExternalTread(e.target.value.trim() === "" ? 0 : Number(e.target.value));
                            }}
                        />

                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                            Guardar Cambios
                        </ButtonWithAuthControl>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                        >
                            Cancelar
                        </button>
                    </div>
                </main>
                {/* Aside para dejar comnetarios y subir fotos */}
                <aside className="relative bg-white dark:text-white  dark:bg-[#212121] p-6  max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-4">Observaciones y Fotos</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Aquí puedes agregar observaciones adicionales o subir fotos relacionadas con el neumático.
                    </p>
                    {/* Aquí podrías agregar un formulario para comentarios y fotos */}
                    <textarea
                        value={finalComment}
                        onChange={(e) => setFinalComment(e.target.value)}
                        placeholder="Agregar comentarios..."
                        className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
                    ></textarea>
                    {/* Fotos  */}
                    {/* Input para fotos,  */}
                    <section className="flex gap-x-4 mt-4 w-full h-[30dvh]">
                        {/* Columna izquierda: selector de archivo */}
                        <div className="flex flex-col gap-y-2 w-1/3">

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
                                    Subir Foto
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
                                            className="relative group w-[250px] h-[180px] flex-shrink-0"
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
                                                <CircleX className="w-10 h-10" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </aside>
            </div>

        </div>
    );
}
