'use client'
import CardCheck from "@/components/features/medicion/page/CardCheck";
import PhotoCard from "@/components/features/medicion/page/PhotoCard";
import { Calendar, Camera, FileCheck, FileDown, Gauge, MessageCircle, User } from "lucide-react";
import { useParams } from "next/navigation";

export default function MedicionPage() {

    const params = useParams<{ id: string }>();
    const id = params.id
    return (
        <div className="bg-white dark:bg-[#212121] dark:text-white flex flex-col  p-4">
            {/* Titulo y botones de exportar */}
            <div className="w-full flex justify-between mb-4">
                <h1 className="text-4xl dark:text-white font-semibold">Medición de Neumáticos {id}</h1>
                <div className="flex space-x-4">
                    <button className="bg-amber-300 text-black px-4 py-2 rounded flex justify-between items-center gap-2 hover:bg-amber-400 transition-colors">
                        <FileDown size={32} />
                        <p className="text-lg font-semibold">
                            Exportar a Excel
                        </p>
                    </button>
                </div>
            </div>
            {/* Seccion de informacion general */}
            <section className="w-full bg-gray-100 dark:bg-neutral-800  border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h2 className="text-2xl font-semibold mb-8 items-center flex">
                    <FileCheck size={32} className="inline mr-2" />
                    Información General
                </h2>

                {/* Informacion del Equipo y la inspeccion */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Info del equipo */}
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-700 dark:text-gray-300">Equipo:</p>
                        <p className="text-xl font-bold">H36</p>
                    </div>
                    {/* Operador */}
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-700 dark:text-gray-300">Operador: Nombre del Operador</p>
                        <p className="flex items-center">
                            <User className="inline mr-1" />
                            Juan Perez
                        </p>
                    </div>
                    {/* Fecha de inspeccion */}
                    <div className="flex flex-col gap-2">
                        <p className="text-gray-700 dark:text-gray-300">Fecha de Chequeo: </p>
                        <p className="flex items-center">
                            <Calendar className="inline mr-1" />
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>

                </div>
            </section>
            {/* Seccion de Cards de Neumaticos */}
            <section className="w-full bg-gray-100 dark:bg-neutral-800  border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <Gauge size={32} className="inline mr-2" />
                    Estado de los Neumáticos
                </h3>
                <p>
                    Mediciones detalladas de las posiciones de los neumáticos del equipo H36.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <CardCheck />
                    <CardCheck />
                    <CardCheck />
                    <CardCheck />
                    <CardCheck />
                    <CardCheck />
                </div>
            </section>
            {/* Seccion de Fotografias */}
            <section className="w-full bg-gray-100 dark:bg-neutral-800  border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <Camera size={32} className="inline mr-2" />
                    Fotografías
                </h3>
                <p>
                    Fotografías de las posiciones de los neumáticos del equipo H36.
                </p>
                {/* Aquí iría el componente para mostrar las fotografías */}
                <div className="flex gap-4 w-full overflow-x-auto">
                    <PhotoCard />
                    <PhotoCard />
                    <PhotoCard />
                </div>
            </section>
            {/* Seccion de comentarios */}
            <section className="w-full bg-gray-100 dark:bg-neutral-800  border dark:border-neutral-600 p-4 rounded-lg mb-4">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                    <MessageCircle size={32} className="inline mr-2" />
                    Comentarios
                </h3>
                <p>
                    Aquí puedes agregar comentarios adicionales sobre la medición.
                </p>
                {/* Aquí iría el componente para agregar comentarios */}
                <textarea
                    className="w-full h-24 p-2 mt-2 border dark:border-neutral-600 rounded-md"
                    placeholder="Escribe tus comentarios aquí..."
                ></textarea>
            </section>
        </div>
    );
}