import MineTruck from "@/components/common/icons/MineTruck";
import { AlertTriangle, Calendar, Check, CircleCheck, CircleDot, Donut, File, FileDown, FileText, Gauge, MessageCircle, Thermometer, TriangleAlert, User } from "lucide-react";

export default function Page() {
    return (
        <div className="p-3 bg-neutral-50 dark:bg-[#212121] dark:text-white flex flex-col gap-4">
            {/* Seccion de titulo y boton de exportación */}
            <div className="w-full flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Medición de Neumático</h1>
                    <p className="text-gray-700 font-semibold">Código: AB232032 <span className="font-normal text-gray-500">| Posición 2</span></p>
                </div>
                {/* Bototn de exportar */}
                <div className="flex justify-end mt-2">
                    <button className="bg-amber-300 text-black px-4 py-2 rounded flex justify-between items-center gap-2 hover:bg-amber-400 transition-colors">
                        <FileDown size={32} />
                        <p className="text-lg font-semibold">
                            Exportar a Excel
                        </p>
                    </button>
                </div>
            </div>
            {/* Seccion de alerta */}
            <section className="bg-red-100 dark:bg-red-800 border border-red-300 p-4 rounded-lg mb-4 flex gap-2 items-center justify-between">
                <aside className="flex items-center gap-4">

                    <TriangleAlert size={32} className="text-red-600" />
                    <div>
                        <div className="flex items-center">
                            <h2 className="text-xl font-semibold text-red-700">Alerta de Neumático</h2>
                        </div>
                        <p className="text-red-700 dark:text-gray-300 text-md">
                            Este neumático presenta una anomalía crítica. Por favor, revisa los datos y toma las acciones necesarias.
                        </p>
                    </div>
                </aside>
                <div>
                    <button className="bg-red-500 text-white px-6 py-2 font-semibold rounded-md hover:bg-red-700 transition-colors">
                        Revisar
                    </button>
                </div>
            </section>
            {/* Seccion con dos columnas, loa izquierda para informacion general que usara 2/3 y la derecha para detalles como un aside que usara 1/3 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Columna izquierda: Información General */}
                <div className="col-span-2 ">
                    {/* div de informacion del equipo */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg ">

                        <div className="flex items-center mb-4 gap-2">

                            <MineTruck className="w-10" />
                            <h2 className="text-2xl font-semibold">
                                Información General</h2>
                        </div>
                        <div className=" w-full grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Equipo:</p>
                                <span className="font-bold text-xl">H36</span>
                            </div>
                            {/* Insoeccionado por */}
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">
                                    <User size={20} className="inline mr-1" />
                                    Inspeccionado por:
                                </p>
                                <span className="font-bold text-xl"> Juan Perez</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 dark:text-gray-300">Posición:</p>
                                <span className="font-bold text-xl">2</span>
                            </div>
                            <div className="flex flex-col">

                                <p className="text-gray-500 dark:text-gray-300"><Calendar size={20} className="inline mr-1" /> Fecha de Inspección:</p>
                                <span className="font-bold text-xl">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </section>
                    {/* Medición Actual */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <Gauge size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Medición Actual</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Aquí puedes ver los datos actuales del neumático, incluyendo presión, temperatura y remanente.
                        </p>
                        {/* Seccion de datos */}
                        <section className="grid grid-cols-1 gap-4 mt-4">
                            {/* Presion */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <Gauge size={28} className="inline mr-2 text-blue-500" />
                                    <p className="text-blue-700 dark:text-gray-300">Presión:</p>
                                    <span className="text-xl font-bold">32 PSI</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-blue-700 h-2.5 rounded-full w-[45%]" ></div>
                                </div>
                            </div>
                            {/* Temperatura */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <Thermometer size={28} className="inline mr-2 text-red-500" />
                                    <p className="text-gray-700 dark:text-gray-300">Temperatura:</p>
                                    <span className="text-xl font-bold">75 °C</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-red-500 h-2.5 rounded-full w-[45%]" ></div>
                                </div>
                            </div>

                            {/* Remanente Interno */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <CircleDot size={28} className="inline mr-2 text-amber-600" />
                                    <p className="text-gray-700 dark:text-gray-300">Remanente Interno:</p>
                                    <span className="text-xl font-bold">43</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-amber-400 h-2.5 rounded-full w-[45%]" ></div>
                                </div>
                            </div>
                            {/* Remanente Externo */}
                            <div className="flex flex-col gap-4 border-b pb-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <CircleDot size={28} className="inline mr-2 text-amber-600" />
                                    <p className="text-gray-700 dark:text-gray-300">Remanente Externo:</p>
                                    <span className="text-xl font-bold">38</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-amber-400 h-2.5 rounded-full w-[45%]" ></div>
                                </div>
                            </div>
                            {/* Fecha de instalacion */}
                            <div className="flex items-center gap-2">
                                <Calendar size={28} className="inline mr-2 text-gray-500" />
                                <p className="text-gray-700 dark:text-gray-300">Fecha de Instalación:</p>
                                <span className="text-xl font-bold">01/01/2023</span>
                            </div>

                        </section>
                    </section>
                    {/* Seccion de fotograficas */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <FileText size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Fotografías</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Aquí puedes ver las fotografías del neumático para una mejor visualización del estado actual.
                        </p>
                        {/* Galería de fotos */}
                        <div className="flex gap-4 w-full overflow-x-auto">
                            {/* Aquí se pueden mapear las fotos */}
                            <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 rounded-md shadow-sm w-[40vh] flex flex-col">
                                <img src="https://www.codelco.com/prontus_codelco/site/artic/20170509/imag/foto_0000000220170509095542.jpg" alt="Foto del Neumático" className="rounded-t-md object-cover w-full h-[20vh]" />
                                <div className="p-2">
                                    <h3 className="text-xl font-semibold mt-4">Foto del Neumático</h3>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                        Esta imagen muestra el estado actual del neumático. Asegúrate de verificar la presión y la temperatura antes de continuar.
                                    </p>
                                </div>
                            </div>
                            {/* Repetir para más fotos */}
                            <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 rounded-md shadow-sm w-[40vh] flex flex-col">
                                <img src="https://www.codelco.com/prontus_codelco/site/artic/20170509/imag/foto_0000000220170509095542.jpg" alt="Foto del Neumático" className="rounded-t-md object-cover w-full h-[20vh]" />
                                <div className="p-2">
                                    <h3 className="text-xl font-semibold mt-4">Foto del Neumático</h3>
                                    <p className="text-gray-700 dark:text-gray-
300 mt-2">
                                        Esta imagen muestra el estado actual del neumático. Asegúrate de verificar la presión y la temperatura antes de continuar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Seccion de comentarios */}
                    <section className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mt-4">
                        <div className="flex items-center mb-4 gap-2">
                            <MessageCircle size={32} className="inline mr-2" />
                            <h2 className="text-2xl font-semibold">Comentarios</h2>
                        </div>
                        {/* Seccion de comentarios */}
                        <div className="border-b pb-4 mb-2">
                            {/* Comentario 1 */}
                            <div className="flex items-center gap-4 mb-2 bg-neutral-50 rounded-md p-2">
                                <div className="bg-white text-2xl font-bold border rounded-full p-4 h-12 w-12 flex items-center justify-center">
                                    C
                                </div>
                                <p className="text-xl font-semibold">
                                    Carlos Pizarro
                                </p>
                                <span className="text-gray-800 text-md">
                                    {new Date().toLocaleDateString()}
                                </span>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Buen estado del neumático, presión y temperatura dentro de los parámetros normales.
                                </p>
                            </div>
                            {/* Comentario 2 */}
                            <div className="flex items-center gap-4 mb-4 bg-neutral-50 rounded-md p-2">
                                <div className="bg-white text-2xl font-bold border rounded-full p-4 h-12 w-12 flex items-center justify-center">
                                    J
                                </div>
                                <p className="text-xl font-semibold">
                                    Juan Nilo
                                </p>
                                <span className="text-gray-800 text-md">
                                    {new Date().toLocaleDateString()}
                                </span>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Buen estado del neumático, presión y temperatura dentro de los parámetros normales.
                                </p>
                            </div>
                        </div>
                        {/* Formulario para agregar un nuevo comentario */}
                        <form className="mt-4 flex flex-col gap-2">
                            <textarea
                                rows={3}
                                placeholder="Agregar un comentario..."
                                className="w-full p-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:text-white"
                            ></textarea>
                            <
                                button
                                type="submit"
                                className="bg-amber-300 text-black font-semibold px-4 py-2 rounded hover:bg-amber-400 transition-colors"
                            >
                                Enviar Comentario
                            </button>
                        </form>
                    </section>

                </div>

                {/* ------------------------------------ */}
                {/* ------------------------------------ */}

                {/* Columna derecha: Detalles del Neumático */}
                <aside className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg ">
                        <h3 className="text-xl font-semibold mb-2">Estado General</h3>
                        <p className="text-gray-700 font-semibold dark:text-gray-300 mb-2">Condición</p>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={24} className="text-red-500" />
                            <span className="bg-red-500 font-semibold text-white px-2 py-1 rounded-full">Nuemático Requiere Mantenimiento</span>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            {/* Barra de progresion del remanente */}
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-xl font-semibold mb-2">Remanente</h3>
                                <p className="text-gray-700 font-semibold dark:text-gray-300 mb-2">45%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-amber-400 h-2.5 rounded-full w-[45%]" ></div>
                            </div>
                        </div>
                        {/* Problemas indentificados */}
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Problemas Identificados</h3>
                            <ul className="list-image-none pl-5 text-gray-700 dark:text-gray-300">
                                <li>Llegando al final de su vida util</li>
                                <li>Temperatura elevada</li>
                                <li>Desgaste irregular</li>
                            </ul>
                        </div>

                    </div>
                    {/* Panel de acciones programar mantenimiento, ver neumatico, generar informe */}
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg font-semibold ">
                        <div className="flex items-center mb-4">
                            <FileText size={32} className="inline mr-2 text-black" />
                            <h3 className="text-xl font-semibold ">Acciones</h3>
                        </div>

                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors mb-2 w-full">
                            <Donut size={24} className="inline mr-2" />
                            Programar Mantenimiento
                        </button>
                        <button className="bg-white text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-white transition-colors mb-2 w-full">
                            <CircleDot size={24} className="inline mr-2" />
                            Ver Neumático
                        </button>
                        <button className="bg-white text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-white transition-colors mb-2 w-full">
                            <FileText size={24} className="inline mr-2" />
                            Generar Informe
                        </button>
                    </div>
                </aside>
                {/* ------------------------------------ */}
                {/* ------------------------------------ */}

            </section>

        </div>
    );
}
