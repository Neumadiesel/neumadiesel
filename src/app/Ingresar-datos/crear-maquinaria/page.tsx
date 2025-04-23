'use client'
import { useState } from "react"
import { FaCircleMinus } from "react-icons/fa6"
interface Neumatico {
    id: number;
    modelo: string;
    serie: string;
    marca: string;
    remanente: number;
}
export default function page() {
    const neumaticos = [
        {
            id: 1,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 2,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 3,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 4,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 5,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 6,
            modelo: "46/90R57",
            serie: "S0USC0013",
            marca: 'BridgeStone',
            remanente: 97,
        }

    ]

    const posiciones = [
        {
            id: 1,
            posicion: "Posicion 1",
        },
        {
            id: 2,
            posicion: "Posicion 2",
        },
        {
            id: 3,
            posicion: "Posicion 3",
        },
        {
            id: 4,
            posicion: "Posicion 4",
        },
        {
            id: 5,
            posicion: "Posicion 5",
        },
        {
            id: 6,
            posicion: "Posicion 6",
        }
    ]

    const [disabledForm, setDisabledForm] = useState(true);
    const [listaNeumaticos, setListaNeumaticos] = useState<any[]>(neumaticos);
    const [selectedNeumaticos, setSelectedNeumaticos] = useState<any[]>([]);
    const [selectedPosicion, setSelectedPosicion] = useState(0);
    const [listaPosiciones, setListaPosiciones] = useState<any[]>(posiciones);

    const handleSelect = (neumatico: Neumatico) => {
        const selectedId = neumatico.id;
        const selectedNeumatico = listaNeumaticos.find((n) => n.id === selectedId);

        if (selectedPosicion === 0) {
            alert("Seleccione una posición");
            return;
        }

        const posicionSeleccionada = listaPosiciones.find(p => p.id === selectedPosicion);

        if (selectedNeumatico && posicionSeleccionada) {
            const neumaticoConPosicion = {
                ...selectedNeumatico,
                posicion: posicionSeleccionada.posicion // Usamos el nombre real
            };

            setSelectedNeumaticos((prev) => [...prev, neumaticoConPosicion]);
            setListaNeumaticos((prev) => prev.filter((n) => n.id !== selectedId));
            setListaPosiciones((prev) => prev.filter((p) => p.id !== selectedPosicion));
            setSelectedPosicion(0);
        }
    };


    const handleRemove = (neumatico: Neumatico & { posicion: string }) => {
        const selectedId = neumatico.id;
        const selectedNeumatico = selectedNeumaticos.find((neumatico) => neumatico.id === selectedId);

        if (selectedNeumatico) {
            setListaNeumaticos((prev) => [...prev, selectedNeumatico]);
            setSelectedNeumaticos((prev) => prev.filter((item) => item.id !== selectedId));
            setListaPosiciones((prev) => [
                ...prev,
                { id: selectedId, posicion: selectedNeumatico.posicion },
            ]);
        }
    };

    return (
        <main className="flex gap-x-4 justify-between w-[100%] h-full">
            <div className="p-3 gap-y-5 w-full ">
                <h1 className="text-2xl font-bold">Registrar Nuevo Equipo</h1>
                <p className="text-sm text-gray-500">Complete los campos para registrar un nuevo equipo</p>
                <main className="flex flex-col lg:flex-row gap-x-2 w-full ">
                    {/* Tipo de maquinaria */}
                    <section className="flex flex-col my-2 lg:border-r border-r-gray-200 px-4 w-full lg:w-1/3">
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Tipo de Maquinaria:<span className="text-red-500">*</span></label>
                            <select className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 p-2" >
                                <option value="volvo">Camion Extractor</option>
                                <option value="saab">Camion Aljibe </option>
                                <option value="mercedes">Wheeldozer</option>
                                <option value="audi">Motoniveladora</option>
                            </select>
                        </div>
                        {/* Codigo del equipo */}
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Codigo del Equipo:<span className="text-red-500">*</span></label>
                            <input type="text" className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 px-2 p-1" />
                        </div>
                        {/* Selector de modelo de equipo */}
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Modelo de Equipo:<span className="text-red-500">*</span></label>
                            <select className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 p-2" >
                                <option value="">Seleccione un modelo</option>
                                <option value="volvo">Caterpillar 797F</option>
                                <option value="saab">Komatsu 980E-5</option>
                                <option value="mercedes">Liebherr T 284</option>
                            </select>
                        </div>
                        {/* Hodometro */}
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Horometro del Equipo:</label>
                            <input type="number" className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 px-2 p-1" />
                        </div>
                        {/* Kilometraje */}
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Kilometraje del Equipo:</label>
                            <input type="number" className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 px-2 p-1" />
                        </div>
                        {/* Selector de faena y de circuito */}
                        <div className="flex flex-col my-2 gap-1">
                            <label className="font-md">Faena:<span className="text-red-500">*</span></label>
                            <select className="bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 p-2" >
                                <option value="">Seleccione una faena</option>
                                <option value="La Negra">La Negra</option>
                                <option value="El Penon">El Peñon</option>
                                <option value="Zaldivar">Zaldivar</option>
                            </select>
                        </div>

                        {/* Boton de agregar neumaticos */}
                        <div className="flex flex-col my-2 gap-1">
                            <button onClick={() => setDisabledForm(false)} className="bg-amber-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-amber-300">Agregar Neumatico</button>
                        </div>
                    </section>
                    {/* Seccion de selector de neumaticos */}
                    <section className={`flex flex-col my-2 lg:border-r border-r-gray-200 px-4 w-full lg:w-1/3 ${disabledForm ? "opacity-50" : ""}`}>
                        <h3 className="font-semibold">Neumaticos disponibles:</h3>
                        <p className="text-sm text-gray-500">Seleccione los neumaticos que desea agregar al equipo</p>
                        <select
                            disabled={disabledForm}
                            onChange={(e) => {
                                setSelectedPosicion(Number(e.target.value)); // Asegura que sea número
                            }}
                            className="bg-gray-50 dark:bg-[#212121] mb-2 border-gray-200 border text-md rounded-md outline-amber-200 p-2"
                        >
                            <option value="">Seleccione una posición</option>
                            {
                                listaPosiciones.map((posicion) => (
                                    <option key={posicion.id} value={posicion.id}>
                                        {posicion.posicion}
                                    </option>
                                ))
                            }
                        </select>
                        <div className="flex flex-col h-[70vh] overflow-y-auto">
                            {
                                listaNeumaticos.length === 0 && (
                                    <p className="text-gray-500">No hay neumaticos disponibles</p>
                                )
                            }
                            {
                                listaNeumaticos.map((neumatico) => (
                                    <div key={neumatico.id} className="flex flex-row justify-between items-center bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 p-2 mb-1">
                                        <div className="flex flex-col">
                                            <p className="font-semibold">{neumatico.marca} - {neumatico.modelo}</p>
                                            <p>{neumatico.serie}</p>
                                        </div>
                                        <button
                                            disabled={selectedPosicion === 0}
                                            onClick={() => {
                                                handleSelect(neumatico);
                                            }}
                                            className="bg-green-500 text-white p-2 rounded-md"><FaCircleMinus /></button>
                                    </div>
                                ))
                            }
                        </div>

                    </section>
                    {/* Seccion de neumaticos seleccionados */}
                    <section className={`flex flex-col my-2 px-4 w-full lg:w-1/3 ${disabledForm ? "opacity-50" : ""}`}>
                        <h3 className="font-semibold">Neumáticos seleccionados:</h3>
                        <div className="flex flex-col h-[70vh] overflow-y-auto">

                            {selectedNeumaticos.length === 0 && (
                                <p className="text-gray-500">No hay neumáticos seleccionados</p>
                            )}
                            {selectedNeumaticos.map((neumatico) => (
                                <div
                                    key={neumatico.id}
                                    className="flex flex-row justify-between items-center bg-gray-50 dark:bg-[#212121] border-gray-200 border text-md rounded-md outline-amber-200 p-2 mb-1"
                                >
                                    <div className="flex flex-col">
                                        <p className="font-semibold">{neumatico.marca} - {neumatico.modelo}</p>
                                        <p>{neumatico.serie}</p>
                                        <p className="text-sm text-gray-500">Posición: {neumatico.posicion}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(neumatico)}
                                        className="bg-red-500 text-white p-2 rounded-md"
                                    >
                                        <FaCircleMinus />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            {/* Lista de neumaticos */}

        </main>
    )
}