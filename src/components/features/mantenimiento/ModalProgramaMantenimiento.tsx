"use client";
import { useEffect, useState } from "react";

import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthFetch } from "@/utils/AuthFetch";
import { VehicleDTO } from "@/types/Vehicle";
import Select from "react-select";
import VehicleSelect from "@/components/common/select/SelectVehicle";

interface ProgramDTO {
    code: string;
    date: string;
    description: string;
    status?: string; // Programada, En ejecución, Completada, Cancelada
    scheduledTime?: number; // Time in hours for the scheduled maintenance
    scheduledDate?: string; // Date when the maintenance is scheduled
    workDate?: string; // Date when the maintenance work was actually performed
    siteId?: number; // ID of the site where the maintenance is scheduled
    vehicleCode?: string; // Code of the vehicle associated with the maintenance program
}

interface ModalProgramaMantenimientoProps {
    visible: boolean;
    onClose: () => void;
    onGuardar: () => void;
}

export default function ModalProgramaMantenimiento({
    visible,
    onClose,
    onGuardar,
}: ModalProgramaMantenimientoProps) {
    const [newProgram, setNewProgram] = useState<ProgramDTO>({
        code: "",
        date: "",
        description: "",
        status: "Programada", // Default status
        scheduledTime: 0, // Default scheduled time
        scheduledDate: "", // Default scheduled date
        workDate: "", // Default work date
        siteId: 1, // Default site ID
        vehicleCode: "", // Default vehicle code
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { siteId, user } = useAuth();
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]); // Adjust type as needed
    const client = useAxiosWithAuth();
    const authFetch = useAuthFetch();

    const fetchVehicles = async () => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/${siteId}`);
            if (!response) {
                console.warn("No se pudo obtener la respuesta (res es null).");
                return;
            }
            const data = await response.json();

            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles([]); // Asegura que siempre sea un array
        }
    };

    useEffect(() => {
        if (user) {
            fetchVehicles();
        }
    }, [user, siteId]);

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        const { code, date, description, status } = newProgram;
        if (
            !code ||
            !date ||
            !description
        ) {
            setError("Por favor, completa los campos obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const response = await client.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/`,
                {
                    vehicleCode: code,
                    siteId: 1,
                    status: status,
                    scheduledDate: date,
                    description: description,
                },
            );

            setNewProgram({
                code: "",
                date: "",
                description: "",
                status: "Programada", // Reset to default status
                scheduledTime: 0, // Reset to default scheduled time
                scheduledDate: "", // Reset to default scheduled date
                workDate: "", // Reset to default work date
                siteId: 1, // Reset to default site ID
                vehicleCode: "", // Reset to default vehicle code
            });
            onGuardar();
            onClose();
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al actualizar el modelo");
        } finally {
            setLoading(false);
        }
    };


    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
            <div className="relative  lg:h-[70dvh] text-white bg-[#212121] p-6 rounded-md shadow-lg max-w-4/5 lg:max-w-2/3 w-full">
                <h2 className="text-xl font-bold ">Programar Nuevo Mantenimiento</h2>
                <p className="text-sm text-gray-300 mb-4">Completa los campos para programar un nuevo mantenimiento.</p>
                {/* Mostrar error si existe */}
                {error && <div className="text-red-500 flex justify-between text-sm bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                    <button onClick={() => setError("")} className=" text-red-500">
                        X
                    </button>
                </div>}
                <div className="grid grid-cols-2 gap-1">
                    {/* Codigo */}
                    <Label title="Codigo Equipo" isNotEmpty={true} />
                    {/* <input
                        name="Codigo Equipo"
                        value={newProgram.code}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Codigo"
                        className="border border-gray-300 p-2 rounded"
                    /> */}
                    <VehicleSelect
                        vehicles={vehicles}
                        value={newProgram.vehicleCode ?? ""}
                        onChange={(code) =>
                            setNewProgram((prev) => ({ ...prev, vehicleCode: code }))
                        }
                    />
                    {/* Fecha de Mantenimiento */}
                    <Label title="Fecha Programada" isNotEmpty={true} />
                    <input
                        name="fechaMantenimiento"
                        type="date"
                        value={newProgram.date}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, date: e.target.value })
                        }
                        placeholder="Fecha Programada"
                        className="border border-gray-300 bg-[#313131] p-2 rounded"
                    />
                    {/* Estado */}
                    <Label title="Estado" isNotEmpty={false} />
                    <select
                        name="estado"
                        value={newProgram.status}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, status: e.target.value })
                        }
                        className="border border-gray-300 bg-[#313131] p-2 rounded"
                    >
                        <option value="Programada">Programada</option>
                        <option value="Imprevisto">Imprevisto</option>
                        <option value="Completada">Completada</option>
                        {/* <option value="Cancelada">Cancelada</option> */}
                    </select>
                    {/* Descripcion del trabajo */}
                    <Label title="Motivo" isNotEmpty={true} />
                    <textarea
                        name="descripcionTrabajo"
                        value={newProgram.description}
                        onChange={
                            (e) => setNewProgram({ ...newProgram, description: e.target.value.toUpperCase() })
                        }
                        placeholder="Descripcion del trabajo"
                        className="border border-gray-300 bg-[#313131] h-[20dvh] p-2 rounded"
                    />

                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                        Guardar Cambios
                    </ButtonWithAuthControl>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-[#414141]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
