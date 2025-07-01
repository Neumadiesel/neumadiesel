import { useState } from "react";
import dayjs from "dayjs";
import Label from "@/components/common/forms/Label";
import ButtonWithAuthControl from "@/components/common/button/ButtonWhitControl";
import useAxiosWithAuth from "@/hooks/useAxiosWithAuth";

interface QuickProgramFormProps {
    vehicleCode: string;
    siteId: number;
    onCreated: () => void;
}

export default function QuickProgramForm({ vehicleCode, siteId, onCreated }: QuickProgramFormProps) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const client = useAxiosWithAuth();

    const handleSubmit = async () => {
        setError(null);
        if (!description || !date) {
            setError("Completa todos los campos requeridos.");
            return;
        }

        setLoading(true);
        try {
            await client.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/maintenance-program/`, {
                vehicleCode,
                siteId,
                scheduledDate: date,
                description,
                status: "Programada",
            });

            setDescription("");
            setDate(dayjs().format("YYYY-MM-DD"));
            onCreated(); // recargar lista si es necesario
        } catch (err) {
            setError("Error al crear el programa. Intenta nuevamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold mb-2">Crear nuevo programa de mantenimiento</h3>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                    <Label title="Fecha programada" isNotEmpty />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                    />
                </div>
                <div className="col-span-2">
                    <Label title="Descripción del trabajo" isNotEmpty />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.toUpperCase())}
                        className="border border-gray-300 p-2 rounded w-full h-16"
                        rows={4}
                        placeholder="Descripción del mantenimiento"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <ButtonWithAuthControl loading={loading} onClick={handleSubmit}>
                    Crear programa
                </ButtonWithAuthControl>
            </div>
        </div>
    );
}