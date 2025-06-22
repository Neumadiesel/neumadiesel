import { FileCheck } from "lucide-react";
import Link from "next/link";

export default function MedicionPage() {
    return (
        <div className="bg-neutral-50 dark:bg-[#212121] dark:text-white flex flex-col  p-4">
            <div className="w-full flex justify-between mb-2">

                <h1 className="text-4xl dark:text-white font-semibold">Panel de Inspecciones</h1>
                <button className="bg-amber-300 text-black px-4 py-2 rounded flex justify-between items-center gap-2 hover:bg-amber-400 transition-colors">
                    <p className="text-lg font-semibold">
                        Realizar Inspección
                    </p>
                </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Aquí puedes realizar inspecciones de neumáticos, verificar su estado y registrar cualquier anomalía.
            </p>
            {/* Seccion de principales estadisticas */}
            <section className="w-full p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800  flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Chequeos Pendientes</h2>
                        <p className="text-3xl font-bold">5</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Chequeos de esta Semana</h2>
                        <p className="text-3xl font-bold">20</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Neumáticos en Alerta</h2>
                        <p className="text-3xl font-bold">15</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg shadow-sm shadow-gray-200 dark:shadow-neutral-800 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-2">Neumáticos Críticos</h2>
                        <p className="text-3xl font-bold">15</p>
                    </div>
                </div>
            </section>
            {/* Seccion de Inspecciones pendientees de aprobacion */}
            <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-4">
                    <FileCheck size={32} className="inline mr-2 text-amber-500" />
                    <h2 className="text-3xl font-semibold flex items-center">
                        Inspecciones que requieren revisión y aprobación
                    </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver las inspecciones que requieren tu aprobación.
                </p>
                {/* Tabla de inspecciones pendientes */}
                <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                    <thead>
                        <tr className="border-b dark:border-neutral-600">
                            <th className="px-4 py-2 text-left">Neumático</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Operador</th>
                            <th className="px-4 py-2 text-left">Remanente</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí se pueden mapear las inspecciones pendientes */}
                        <tr className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                            <td className="px-4 py-2">AB231459</td>
                            <td className="px-4 py-2">01/01/2023</td>
                            <td className="px-4 py-2">Juan Perez</td>
                            <td className="px-4 py-2">78/74</td>
                            <td className="px-4 py-2">Pendiente</td>
                            <td className="px-4 py-2 gap-2 flex">
                                <Link href={"/medicion/1"} className="bg-gray-50 text-black border hover:cursor-pointer px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
                                    Revisar
                                </Link>
                                <button className="bg-amber-300 text-black hover:cursor-pointer px-4 py-2 rounded hover:bg-amber-400 transition-colors font-semibold">
                                    Aprobar
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                            <td className="px-4 py-2">AB231459</td>
                            <td className="px-4 py-2">01/01/2023</td>
                            <td className="px-4 py-2">Juan Perez</td>
                            <td className="px-4 py-2">78/74</td>
                            <td className="px-4 py-2">Pendiente</td>
                            <td className="px-4 py-2 gap-2 flex">
                                <Link href={"/medicion/1"} className="bg-gray-50 text-black border hover:cursor-pointer px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
                                    Revisar
                                </Link>
                                <button className="bg-amber-300 text-black hover:cursor-pointer px-4 py-2 rounded hover:bg-amber-400 transition-colors font-semibold">
                                    Aprobar
                                </button>
                            </td>
                        </tr>
                        {/* Más filas según sea necesario */}
                    </tbody>
                </table>
            </section>
            {/* Seccion de mediciones semanales */}
            <section className="w-full bg-white shadow-sm dark:bg-neutral-800 border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h2 className="text-3xl font-semibold mb-4 flex items-center">
                    <FileCheck size={32} className="inline mr-2 text-emerald-400" />
                    Mediciones Semanales
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Aquí puedes ver las mediciones semanales de los neumáticos.
                </p>
                {/* Tabla de mediciones semanales */}
                <table className="min-w-full bg-white dark:bg-neutral-800 border dark:border-neutral-600">
                    <thead>
                        <tr className="border-b dark:border-neutral-600">
                            <th className="px-4 py-2 text-left">Neumático</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Remanente</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí se pueden mapear las mediciones semanales */}
                        <tr className="border-b dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                            <td className="px-4 py-2">AB231459</td>
                            <td className="px-4 py-2">01/01/2023</td>
                            <td className="px-4 py-2">78/74</td>
                            <td className="px-4 py-2">Bueno</td>
                        </tr>
                        {/* Más filas según sea necesario */}
                    </tbody>
                </table>
            </section>
        </div>
    );
}