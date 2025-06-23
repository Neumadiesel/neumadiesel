import React, { useState } from 'react';
import { Gauge, Thermometer, MessageCircle, Camera } from 'lucide-react';
import { calculateTreadProgress, getColorByTread } from '@/utils/calculatedTread';
import { uploadPhotoTemp } from '@/lib/api/photos';

interface InspectionInput {
    position: number;
    externalTread: number;
    internalTread: number;
    pressure: number;
    temperature: number;
    observation: string;
    photoUrl?: string;
}


interface TireData {
    id: number;
    vehicleId: number;
    tireId: number;
    sensorId: number | null;
    position: number;
    tire: {
        id: number;
        code: string;
        modelId: number;
        initialTread: number;
        initialKilometrage: number;
        initialHours: number;
        lastInspection: {
            externalTread: number;
            internalTread: number;
            pressure: number;
            temperature: number;
            observation: string;
        };
    };
}

interface NeumaticoCardProps {
    tire: TireData;
    inspection: InspectionInput;
    onChange: (data: InspectionInput) => void;
}

const NeumaticoCard: React.FC<NeumaticoCardProps> = ({ tire, inspection, onChange }) => {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(inspection.photoUrl || null);

    const handleInputChange = (field: keyof InspectionInput, value: number | string) => {
        onChange({ ...inspection, [field]: value });
    };

    const handlePhotoUpload = async () => {
        if (!photoFile) return;

        const res = await uploadPhotoTemp(
            photoFile,
            `${tire.id}-tire-temp`,
            1 // 🔁 Reemplaza con el ID real del usuario logueado (user?.user_id)
        );

        if (res) {
            setPreview(res.url);
            onChange({ ...inspection, photoUrl: res.url });
        }
    };

    const treadAvg = (inspection.externalTread + inspection.internalTread) / 2;
    const treadPercent = calculateTreadProgress(treadAvg, tire.tire.initialTread);
    const treadColor = getColorByTread(treadPercent);

    return (
        <div className="border p-4 rounded-lg shadow-sm bg-white dark:bg-neutral-900">
            <h3 className="font-bold text-lg mb-2">Neumático Posición {tire.position}</h3>
            <p className="text-sm text-gray-500">Código: {tire.tire.code}</p>

            <div className="mt-3 flex flex-col gap-2">
                <label className="font-semibold text-sm">Presión</label>
                <input
                    type="number"
                    value={inspection.pressure}
                    onChange={(e) => handleInputChange('pressure', parseFloat(e.target.value))}
                    className="w-full p-2 bg-gray-50 dark:bg-[#414141] rounded border"
                />

                <label className="font-semibold text-sm">Temperatura</label>
                <input
                    type="number"
                    value={inspection.temperature}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="w-full p-2 bg-gray-50 dark:bg-[#414141] rounded border"
                />

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="font-semibold text-sm">Rem. Ext.</label>
                        <input
                            type="number"
                            value={inspection.externalTread}
                            onChange={(e) => handleInputChange('externalTread', parseFloat(e.target.value))}
                            className="w-full p-2 bg-gray-50 dark:bg-[#414141] rounded border"
                        />
                    </div>
                    <div>
                        <label className="font-semibold text-sm">Rem. Int.</label>
                        <input
                            type="number"
                            value={inspection.internalTread}
                            onChange={(e) => handleInputChange('internalTread', parseFloat(e.target.value))}
                            className="w-full p-2 bg-gray-50 dark:bg-[#414141] rounded border"
                        />
                    </div>
                </div>

                <div className="mt-2">
                    <label className="font-semibold text-sm">Comentario</label>
                    <input
                        type="text"
                        value={inspection.observation}
                        onChange={(e) => handleInputChange('observation', e.target.value)}
                        className="w-full p-2 bg-gray-50 dark:bg-[#414141] rounded border"
                    />
                </div>

                <div className="mt-4">
                    <label className="font-semibold text-sm">Foto</label>
                    <input type="file" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                    <button
                        onClick={handlePhotoUpload}
                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                    >
                        Subir Foto
                    </button>
                    {preview && <img src={preview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded" />}
                </div>

                <div className="mt-4">
                    <label className="font-semibold text-sm">Desgaste Promedio</label>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                        <div
                            className={`h-3 rounded-full ${treadColor}`}
                            style={{ width: `${treadPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-xs mt-1">{Math.round(treadPercent)}% de desgaste</p>
                </div>
            </div>
        </div>
    );
};

export default NeumaticoCard;
