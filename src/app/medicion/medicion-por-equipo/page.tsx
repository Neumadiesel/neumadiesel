'use client';
import { useEffect, useState } from 'react';
import Modal from "@/components/common/modal/CustomModal";
import { Search } from "lucide-react";
import { VehicleDTO } from '@/components/features/equipo/InfoCamion';
import axios from 'axios';
export default function MedicionPorEquipo() {
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
            const response = await axios.get(`https://inventory-service-emva.onrender.com/vehicles/code/${vehicleCode}`);
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
            const response = await axios.post("https://inventory-service-emva.onrender.com/inspections", tireInspected);
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
            <h1 className='text-2xl lg:text-3xl mb-2 font-bold'>Inspección del Neumático</h1>
            <section className=''>
                <div className='flex items-center gap-x-2 border-b border-b-amber-300 pb-3'>
                    <label className="text-lg mb-1 text-black font-semibold dark:text-white ">Ingrese código del equipo:</label>
                    <input
                        onChange={(e) => setVehicleCode(e.target.value.toUpperCase())}
                        value={vehicleCode || ""}
                        placeholder="Código equipo"

                        type="text" className="w-[40%] bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2" />
                    <button onClick={() => fetchVehicle()} className="bg-amber-300 hover:bg-amber-400 hover:cursor-pointer text-black p-2 font-bold rounded-lg">
                        <Search className="w-6 h-6" />
                    </button>
                    <div>
                        {error && <div className="text-red-500 flex justify-between text-sm w-80 bg-red-50 border border-red-300 p-2 rounded-sm">{error}
                            <button onClick={() => setError("")} className=" text-red-500">
                                X
                            </button>
                        </div>
                        }
                    </div>
                </div>

                {/* Fecha medicion anterior */}
                <div className='flex gap-x-4 my-2'>
                    <p className="text-sm text-gray-700 dark:text-white">Kilometraje del Equipo: <span className='font-semibold'>{vehicle?.kilometrage}</span></p>
                    <p className="text-sm text-gray-700 dark:text-white">Modelo: <span className='font-semibold'>{vehicle?.model.model}</span></p>
                    <p className="text-sm text-gray-700 dark:text-white">Código: <span className='font-semibold'>{vehicle?.code}</span></p>
                    <p className="text-sm text-gray-700 dark:text-white">Faena: <span className='font-semibold'>{vehicle?.site.name}</span></p>

                </div>
                {/* Selecotr de neumaticos instalados */}
                <div className="flex gap-x-4 my-2">
                    <select
                        disabled={!vehicle}
                        className={`w-[40%] bg-gray-50 dark:bg-[#414141] rounded-lg border border-amber-300 p-2 ${!vehicle ? "opacity-50" : ""}`}
                        onChange={(e) => {
                            const selectedTireId = parseInt(e.target.value, 10);
                            const selected = vehicle?.installedTires.find(
                                (installed) => installed.tire.id === selectedTireId
                            );
                            setTireSelected(selected || null);
                        }}
                        value={tireSelected?.tire.id || ""}
                    >
                        <option value="">Seleccione un neumático</option>
                        {vehicle?.installedTires.map((installed) => (
                            <option key={installed.id} value={installed.tire.id}>
                                Posición {installed.position} - {installed.tire.code}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto  mt-4 w-[100%]">
                    <div className='flex gap-x-2 justify-between mb-2'>



                        <section key={tireSelected?.id} className={`
                        border bg-gray-50 dark:bg-neutral-800 dark:text-white border-amber-300 rounded-lg p-2 my-2 w-full py-4
                            ${tireSelected ? "" : "opacity-50"}
                            `}>
                            <p className='text-xl font-bold'>Posición {tireSelected?.position}</p>
                            <p className='font-semibold'>Código del neumático: {tireSelected?.tire.code}</p>

                            {/* Medicion exterior */}
                            <div className='flex flex-col'>
                                <div className="flex items-center mt-2 ">
                                    <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Exterior:</label>
                                    {/* Botón de disminuir */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("ext", tireInspected.externalTread - 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                    >
                                        -
                                    </button>

                                    {/* Input numérico */}
                                    <input
                                        type="number"
                                        value={tireInspected.externalTread}
                                        onChange={
                                            (e) => handleInputChange("ext", parseFloat(e.target.value) || 0)
                                        }
                                        className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                    />

                                    {/* Botón de aumentar */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("ext", tireInspected.externalTread + 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* Medicion interior */}
                                <div className="flex items-center mt-2">
                                    <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Interior:</label>
                                    {/* Botón de disminuir */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("int", tireInspected.internalTread - 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                    >
                                        -
                                    </button>
                                    {/* Input numérico */}
                                    <input
                                        type="number"
                                        value={tireInspected.internalTread}
                                        onChange={(e) => handleInputChange("int", parseFloat(e.target.value) || 0)}
                                        className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                    />
                                    {/* Botón de aumentar */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("int", tireInspected.internalTread + 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* medicion presion */}
                                <div className="flex items-center mt-2">
                                    <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Presión:</label>
                                    {/* Botón de disminuir */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("pre", tireInspected.pressure - 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                    >
                                        -
                                    </button>
                                    {/* Input numérico */}
                                    <input
                                        type="number"
                                        value={tireInspected.pressure}
                                        onChange={(e) => handleInputChange("pre", parseFloat(e.target.value) || 0)}
                                        className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                    />
                                    {/* Botón de aumentar */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("pre", tireInspected.pressure + 1)}

                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* medicion temperatura */}
                                <div className="flex items-center mt-2">
                                    <label className="text-md mb-1 text-black font-semibold dark:text-white w-[60%]">Temperatura:</label>
                                    {/* Botón de disminuir */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("tem", tireInspected.temperature - 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-l-lg text-sm"
                                    >
                                        -
                                    </button>
                                    {/* Input numérico */}
                                    <input
                                        type="number"
                                        value={tireInspected.temperature}
                                        onChange={(e) => handleInputChange("tem", parseFloat(e.target.value) || 0)}
                                        className="w-24 text-center bg-amber-50 dark:bg-[#414141] border-y border-y-amber-300 h-10 p-2"
                                    />
                                    {/* Botón de aumentar */}
                                    <button disabled={!tireSelected}
                                        onClick={() => handleInputChange("tem", tireInspected.temperature + 1)}
                                        className="bg-amber-50 border border-amber-500 text-black h-10 w-20 p-2 rounded-r-lg text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

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

        </div>
    );
}