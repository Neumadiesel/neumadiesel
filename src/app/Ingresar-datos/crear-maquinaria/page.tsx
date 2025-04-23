'use client'
import ModalCrearNeumatico from "@/components/common/modal/ModalCrearNeumatico";
import { useState } from "react"
import { FaArrowDown, FaPlus } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6"
interface Neumatico {
    id: number;
    modelo: string;
    serie: string;
    marca: string;
    remanente: number;
}
interface Posicion {
    id: number;
    posicion: string;
}
interface NeumaticoConPosicion extends Neumatico {
    posicion: string;
}
export default function Page() {
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
            serie: "S0USC0014",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 3,
            modelo: "46/90R57",
            serie: "S0USC0015",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 4,
            modelo: "46/90R57",
            serie: "S0USC0016",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 5,
            modelo: "46/90R57",
            serie: "S0USC0017",
            marca: 'BridgeStone',
            remanente: 97,
        },
        {
            id: 6,
            modelo: "46/90R57",
            serie: "S0USC0018",
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
    const [listaNeumaticos, setListaNeumaticos] = useState<Neumatico[]>(neumaticos);
    const [selectedNeumaticos, setSelectedNeumaticos] = useState<NeumaticoConPosicion[]>([]);
    const [selectedPosicion, setSelectedPosicion] = useState(0);
    const [listaPosiciones, setListaPosiciones] = useState<Posicion[]>(posiciones);

    // Filtros
    const [filtros, setFiltros] = useState({
        serie: '',
        remanenteMin: '',
        remanenteMax: ''
    });

    const [showFiltros, setShowFiltros] = useState(false);

    const neumaticosFiltrados = listaNeumaticos.filter((n) => {
        const cumpleSerie = filtros.serie === '' || n.serie.toLowerCase().includes(filtros.serie.toLowerCase());
        const cumpleMin = filtros.remanenteMin === '' || n.remanente >= Number(filtros.remanenteMin);
        const cumpleMax = filtros.remanenteMax === '' || n.remanente <= Number(filtros.remanenteMax);
        return cumpleSerie && cumpleMin && cumpleMax;
    });

    // Modal Crear Neumatico
    const [mostrarModal, setMostrarModal] = useState(false);


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
                        <section className="flex flex-row my-2 gap-1 w-full">
                            <div className="relative mb-2 w-1/2">
                                <button
                                    disabled={disabledForm}
                                    onClick={() => setShowFiltros(!showFiltros)}
                                    className="bg-gray-10 border border-gray-300 flex items-center justify-center gap-2 px-3 py-2 font-semibold rounded hover:bg-gray-300 text-sm w-full"
                                >
                                    Filtros

                                    {
                                        showFiltros ? <FaArrowDown className="rotate-180" /> : <FaArrowDown />
                                    }
                                </button>

                                {showFiltros && (
                                    <div className="absolute z-10 top-10 left-0 bg-white dark:bg-[#2a2a2a] shadow-md rounded-md p-4 w-96 border border-gray-200">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold">Serie:</label>
                                            <input
                                                type="text"
                                                value={filtros.serie}
                                                onChange={(e) => setFiltros({ ...filtros, serie: e.target.value })}
                                                className="border rounded p-1 text-sm bg-gray-50 dark:bg-[#212121]"
                                            />
                                            <div className="flex flex-row gap-2">
                                                <div className="flex flex-col w-1/2">
                                                    <label className="text-sm font-semibold">Remanente mínimo:</label>
                                                    <input
                                                        type="number"
                                                        value={filtros.remanenteMin}
                                                        onChange={(e) => setFiltros({ ...filtros, remanenteMin: e.target.value })}
                                                        className="border rounded p-1 text-sm bg-gray-50 dark:bg-[#212121]"
                                                    />
                                                </div>
                                                <div className="flex flex-col w-1/2">
                                                    <label className="text-sm font-semibold">Remanente máximo:</label>
                                                    <input
                                                        type="number"
                                                        value={filtros.remanenteMax}
                                                        onChange={(e) => setFiltros({ ...filtros, remanenteMax: e.target.value })}
                                                        className="border rounded p-1 text-sm bg-gray-50 dark:bg-[#212121]"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setFiltros({ serie: '', remanenteMin: '', remanenteMax: '' });
                                                }}
                                                className="text-xs text-blue-600 underline mt-2"
                                            >
                                                Limpiar filtros
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Boton de crear nuevo neumatico */}
                            <div className="w-1/2">
                                <button
                                    disabled={disabledForm}
                                    onClick={() => setMostrarModal(true)}
                                    className="bg-gray-10 border border-gray-300 flex items-center justify-center gap-1  px-3 py-2 font-semibold rounded hover:bg-gray-300 text-sm w-full"
                                >
                                    Crear Neumatico
                                    <FaPlus />
                                </button>
                            </div>
                        </section>

                        {/* Selector de posicion */}
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
                                neumaticosFiltrados.length === 0 && (
                                    <p className="text-gray-500">No hay neumaticos disponibles</p>
                                )
                            }
                            {
                                neumaticosFiltrados.map((neumatico) => (
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
            <ModalCrearNeumatico
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onGuardar={nuevoNeumatico => {
                    setMostrarModal(false);
                    console.log("Nuevo usuario agregado:", nuevoNeumatico);
                }}
            />

        </main>
    )
}