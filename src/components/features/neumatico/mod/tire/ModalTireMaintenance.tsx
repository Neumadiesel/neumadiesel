"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { TireDTO } from "@/types/Tire";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";


interface ModalTireMaintenanceProps {
    visible: boolean;
    onClose: () => void;
    tire: TireDTO | null;
    onGuardar: () => void;
}

interface MaintenanceReasonDTO {
    id: number;
    description: string;
}

interface LocationMaintenanceDTO {
    id: number;
    description: string;
}

export default function ModalTireMaintenance({
    visible,
    onClose,
    tire,
    onGuardar,
}: ModalTireMaintenanceProps) {
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


    const [maintenanceReasons, setMaintenanceReasons] = useState<MaintenanceReasonDTO[]>([]);
    const [locationMaintenance, setLocationMaintenance] = useState<LocationMaintenanceDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const fetchLocationsMaintenance = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/location-maintenance/`);
            const data = await response.json();
            setLoading(false);
            setLocationMaintenance(data);
        } catch (error) {
            console.error("Error fetching locations for maintenance:", error);
            setLoading(false);
            setError("Error al cargar las ubicaciones de mantenimiento");
        }
    };

    const fetchReasons = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-reason`);
            const data = await response.json();
            setLoading(false);
            setMaintenanceReasons(
                data.filter(
                    (reason: MaintenanceReasonDTO) =>
                        !/Desinstalaci[oó]n|Instalaci[oó]n|Baja/i.test(reason.description)
                )
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
        }
    }, [tire]);

    useEffect(() => {
        fetchReasons();
        fetchLocationsMaintenance();
    }, []);

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
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance/`,
                {
                    tireId: tire.id,
                    locationMaintenanceId: tireEdited.locationMaintenanceId, // Asignar la primera ubicación de mantenimiento
                    maintenanceReasonId: tireEdited.maintenanceReasonId,
                    executionDate: tireEdited.date,
                    executionTime: tireEdited.executionTime,
                    externalTread: tireEdited.externalTread,
                    internalTread: tireEdited.internalTread,
                    hours: Number(usedHours),
                    kilometrage: Number(usedKilometrage),
                },
            );

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
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative bg-white dark:text-white border-l-10 border-l-amber-300 dark:bg-[#212121] p-6 rounded-md shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">
                    Realizar Mantenimiento de Neumático: {tire.code}
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
                        value={tireEdited.code}
                        onChange={
                            (e) => setTireEdited({ ...tireEdited, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Código Neumático"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Razon de mantencion */}
                    <Label title="Razón de Mantenimiento" isNotEmpty={true} />
                    <select
                        value={tireEdited.maintenanceReasonId ?? ""}
                        onChange={(e) => setTireEdited({ ...tireEdited, maintenanceReasonId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Razón</option>
                        {maintenanceReasons.map((reason) => (
                            <option key={reason.id} value={reason.id}>
                                {reason.description}
                            </option>
                        ))}
                    </select>
                    {/* Locacion de mantencion */}
                    <Label title="Ubicación de Mantenimiento" isNotEmpty={true} />
                    <select
                        value={tireEdited.locationMaintenanceId ?? ""}
                        onChange={(e) => setTireEdited({ ...tireEdited, locationMaintenanceId: Number(e.target.value) })}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="">Seleccionar Ubicación</option>
                        {locationMaintenance.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.description}
                            </option>
                        ))}
                    </select>
                    {/* Input de fecha de modificacion */}
                    <Label title="Fecha y Hora de Mantenimiento" isNotEmpty={true} />
                    <input
                        type="datetime-local"
                        value={tireEdited.date}
                        onChange={(e) => setTireEdited({ ...tireEdited, date: e.target.value })}
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Tiempo de ejecucion */}
                    <Label title="Tiempo de Ejecución" isNotEmpty={true} />
                    <input
                        name="Tiempo de Ejecución"
                        type="number"
                        min="0"
                        value={tireEdited.executionTime === null ? "" : tireEdited.executionTime}
                        onChange={(e) => {
                            setTireEdited({
                                ...tireEdited,
                                executionTime: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}
                        placeholder="Tiempo de Ejecución"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Horas Usadas */}
                    <Label title="Horas Usadas" isNotEmpty={true} />
                    <input
                        name="Horas del Neumático"
                        type="number"
                        min="0"
                        value={tireEdited.usedHours}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // solo dígitos
                                setTireEdited({ ...tireEdited, usedHours: value });
                            }
                        }}
                        onBlur={() => {
                            if (tireEdited.usedHours === "") {
                                setTireEdited({ ...tireEdited, usedHours: "0" });
                            }
                        }}
                        placeholder="Horas Usadas"
                        className="border border-gray-300 p-2 rounded"
                    />
                    {/* Kilometraje Usado */}
                    <Label title="Kilometraje Acumulado" isNotEmpty={true} />
                    <input
                        name="Kilometraje del Neumático"
                        type="number"
                        min="0"
                        value={tireEdited.usedKilometrage}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setTireEdited({ ...tireEdited, usedKilometrage: value });
                            }
                        }}
                        onBlur={() => {
                            if (tireEdited.usedKilometrage === "") {
                                setTireEdited({ ...tireEdited, usedKilometrage: "0" });
                            }
                        }}
                        placeholder="Kilometraje Acumulado"
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
                        value={tireEdited.internalTread === null ? "" : tireEdited.internalTread}
                        onChange={(e) => {
                            setTireEdited({
                                ...tireEdited,
                                internalTread: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
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
                        value={tireEdited.externalTread === null ? "" : tireEdited.externalTread}
                        onChange={(e) => {
                            setTireEdited({
                                ...tireEdited,
                                externalTread: e.target.value.trim() === "" ? null : Number(e.target.value),
                            });
                        }}
                    />


                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
