'use client';

import { useEffect, useState } from 'react';
import NeumaticoCard from './NeumaticoCard';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleDTO } from '@/types/Vehicle';
import { Progress } from '@/components/ui/Progress';

export default function MedicionPorEquipo() {
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState<VehicleDTO | null>(null);
    const [vehicleCode, setVehicleCode] = useState('');
    const [inspections, setInspections] = useState<any[]>([]);
    const [kilometrage, setKilometrage] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleLoadVehicle = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/site/1/${vehicleCode}`);
            setVehicle(res.data);
            setKilometrage(res.data.kilometrage);
            setHours(res.data.hours);

            const initialInspections = res.data.installedTires.map((tire: any) => ({
                position: tire.position,
                tireId: tire.tire.id,
                externalTread: 0,
                internalTread: 0,
                pressure: 0,
                temperature: 0,
                observation: '',
                photos: [],
                inspectionDate: new Date().toISOString(),
                kilometrageAdded: 0,
                hoursAdded: 0,
                completed: false,
            }));

            setInspections(initialInspections);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInspectionChange = (idx: number, updated: any) => {
        setInspections(prev => {
            const clone = [...prev];
            clone[idx] = {
                ...clone[idx],
                ...updated,
                completed: isComplete(updated)
            };
            return clone;
        });
    };

    const isComplete = (i: any) =>
        i.externalTread > 0 &&
        i.internalTread > 0 &&
        i.pressure > 0 &&
        i.temperature > 0;

    const progress = Math.round((inspections.filter(i => i.completed).length / inspections.length) * 100 || 0);

    const handleSubmit = async () => {
        try {
            const updates = inspections.map((i) => ({
                ...i,
                kilometrageAdded: kilometrage - (vehicle?.kilometrage ?? 0),
                hoursAdded: hours - (vehicle?.hours ?? 0),
            }));

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inspections/batch`, {
                vehicleId: vehicle?.id,
                inspections: updates,
            });

            alert('Inspecciones registradas correctamente');
            setVehicle(null);
            setInspections([]);
        } catch (err) {
            console.error(err);
            alert('Error al guardar');
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Inspección por Equipo</h1>

            <div className="flex gap-4">
                <input
                    placeholder="Código del equipo"
                    value={vehicleCode}
                    onChange={e => setVehicleCode(e.target.value.toUpperCase())}
                    className="border px-4 py-2 rounded w-full"
                />
                <button onClick={handleLoadVehicle} className="bg-amber-400 px-4 py-2 rounded font-bold">
                    Buscar
                </button>
            </div>

            {vehicle && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label>Kilometraje actual:</label>
                            <input
                                type="number"
                                value={kilometrage}
                                onChange={e => setKilometrage(Number(e.target.value))}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                        <div>
                            <label>Horas actuales:</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={e => setHours(Number(e.target.value))}
                                className="border px-2 py-1 w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 font-medium">Progreso de inspección: {progress}%</p>
                        <Progress value={progress} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {vehicle.installedTires.map((tire, idx) => (
                            <NeumaticoCard
                                key={tire.id}
                                tire={tire}
                                inspection={inspections[idx]}
                                onChange={(data) => handleInspectionChange(idx, data)}
                            />
                        ))}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={progress < 100}
                            className="bg-green-600 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                        >
                            Guardar inspecciones
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}