import * as React from "react";
import Image from "next/image";
import { FaShieldAlt, FaCoins, FaClock, FaFileContract, FaQuoteRight } from "react-icons/fa";
import ButtonSection from "@/components/features/main/ButtonSection";

export default function Page() {
    return (
        <div className="bg-gray-100 dark:bg-[#212121]">
            <main className="flex items-center justify-center h-[100vh] bg-white relative overflow-hidden">
                {/* Video de fondo */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover z-0"
                >
                    <source src="/video-1.mp4" type="video/mp4" />
                </video>

                {/* Overlay para mejorar la legibilidad */}
                <div className="absolute inset-0 bg-black/50 z-10"></div>

                <div className="flex flex-col items-center justify-center w-3/4 z-20 gap-y-4">
                    <h2 className="text-6xl text-center font-bold text-white">
                        Sistema de Gestión de Neumáticos
                    </h2>
                    <p className="text-lg text-white text-center lg:px-30">
                        Optimice el mantenimiento de sus neumáticos mineros, mejore la seguridad y
                        reduzca costos operativos con nuestra plataforma especializada.
                    </p>
                    <ButtonSection />
                </div>
            </main>
            {/* seccion de caracteristicas */}
            <section className="flex flex-col items-center bg-white dark:bg-[#212121] justify-center w-full h-full lg:h-[120vh] py-10 z-20 mx-auto gap-y-2 xl:gap-y-2 px-4 lg:px-0">
                <h3 className="text-3xl xl:text-4xl font-bold dark:text-white">Gestión Integral de Neumáticos</h3>
                <p className="text-md lg:text-lg text-gray-600 dark:text-gray-100 py-4 lg:py-0 lg:px-32 text-center">
                    Nuestra plataforma ofrece todas las herramientas necesarias para administrar
                    eficientemente el ciclo de vida completo de sus neumáticos mineros.
                </p>
                <div className="flex flex-row gap-4 xl:mt-2 w-full lg:w-3/4">
                    <aside className="flex flex-col items-center justify-center w-3/4 lg:w-1/2 mx-auto">
                        {/* Card de caracteristicas */}
                        <div className="flex flex-row gap-4  p-4 rounded-sm text-black dark:text-white">
                            <FaShieldAlt className=" text-6xl xl:text-7xl " />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">Mayor Seguridad</p>
                                <p className="text-md text-gray-600 dark:text-gray-100">
                                    Reduzca riesgos operativos con mantenimiento preventivo y
                                    detección temprana de problemas.
                                </p>
                            </div>
                        </div>
                        {/* Card de reduccion de costos */}
                        <div className="flex flex-row gap-4  p-4 rounded-sm text-black dark:text-white">
                            <FaCoins className=" text-6xl xl:text-7xl " />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">Reducción de Costos</p>
                                <p className="text-md text-gray-600 dark:text-gray-100">
                                    Optimice la vida útil de los neumáticos y reduzca el tiempo de
                                    inactividad no planificado.
                                </p>
                            </div>
                        </div>
                        {/* Card de eficiencia operativa */}
                        <div className="flex flex-row gap-4  p-4 rounded-sm text-black dark:text-white">
                            <FaClock className=" text-6xl xl:text-7xl" />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">Eficiencia Operativa</p>
                                <p className="text-md text-gray-600 dark:text-gray-100">
                                    Programe mantenimientos de forma inteligente para minimizar
                                    interrupciones en la producción.
                                </p>
                            </div>
                        </div>
                        {/* Card de cumplimiento normativo */}
                        <div className="flex flex-row gap-4  p-4 rounded-sm text-black dark:text-white">
                            <FaFileContract className=" text-5xl xl:text-6xl " />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">Cumplimiento Normativo</p>
                                <p className="text-md text-gray-600 dark:text-gray-100">
                                    Mantenga registros detallados para cumplir con regulaciones de
                                    seguridad y auditorías.
                                </p>
                            </div>
                        </div>
                    </aside>
                    {/* imagen de neumatico */}
                    <div className="w-1/2 hidden lg:flex z-20  items-center justify-center">
                        <Image
                            src="/caex.webp"
                            alt="neumatico"
                            className="rounded-md"
                            width={600}
                            height={500}
                        />
                    </div>
                </div>
            </section>
            {/* Seccion de caracteristicas de la plataforma */}
            <section className="flex flex-col items-center justify-center dark:bg-black w-full h-full lg:h-[100vh] gap-y-10 py-10 z-20 mx-auto px-4 lg:px-0">
                <h3 className="text-3xl lg:text-5xl font-bold dark:text-white">
                    Características Principales de la Plataforma
                </h3>
                <p className="text-md lg:text-lg text-gray-600 dark:text-gray-100 py-4 lg:py-0 lg:px-32 text-center">
                    Ofrecemos un conjunto integral de servicios diseñados específicamente para
                    maximizar el rendimiento de sus neumáticos en operaciones mineras.
                </p>
                <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4 w-4/5 gap-x-4">
                    {/* Card de seguimiento de neumaticos */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-[#212121] w-72  h-44 p-4 rounded-sm border border-gray-300 dark:border-gray-600 dark:text-white">
                        <p className="text-xl font-bold">Seguimiento de NeumÁticos</p>
                        <p className="text-md ">
                            Control detallado del historial y estado actual de cada neumático en su
                            flota.
                        </p>
                    </div>
                    {/* Card de gestion de mantenimiento */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-[#212121] w-72  h-44 p-4 rounded-sm border border-gray-300 dark:border-gray-600 dark:text-white">
                        <p className="text-xl font-bold">Programación de Mantenimiento</p>
                        <p className="text-md ">
                            Planificación automatizada de inspecciones y rotaciones basadas en datos
                            de uso.
                        </p>
                    </div>
                    {/* Card de gestion de inventario */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-[#212121] w-72 h-44 p-4 rounded-sm border border-gray-300 dark:border-gray-600 dark:text-white">
                        <p className="text-xl font-bold">GestiÓn de Inventario</p>
                        <p className="text-md ">
                            Control de stock de neumáticos nuevos, reparados y fuera de servicio.
                        </p>
                    </div>
                    {/* Card de reportes y analisis */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-[#212121] w-72 h-44 p-4 rounded-sm border border-gray-300 dark:border-gray-600 dark:text-white">
                        <p className="text-xl font-bold">Reportes y Analisis</p>
                        <p className="text-md ">
                            Informes detallados sobre costos, rendimiento y proyecciones de
                            reemplazo.
                        </p>
                    </div>
                    {/* Card de Alertas y notificaciones */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-[#212121] w-72 h-44 p-4 rounded-sm border border-gray-300 dark:border-gray-600 dark:text-white">
                        <p className="text-xl font-bold">Alertas y Notificaciones</p>
                        <p className="text-md ">
                            Notificaciones sobre umbrales críticos de desgaste o mantenimientos
                            programados.
                        </p>
                    </div>
                </div>
            </section>
            {/* seccion de testimonios */}
            <section className="flex flex-col items-center justify-center bg-white dark:bg-[#212121] w-full h-full lg:h-[100vh]  gap-y-10 py-8 z-20 mx-auto px-4 lg:px-0">
                <h3 className="text-3xl lg:text-5xl font-bold dark:text-white">Lo Que Dicen Nuestros Clientes</h3>
                <p className="text-md lg:text-lg text-gray-600 dark:text-white py-4 lg:py-0 lg:px-32 text-center">
                    Empresas mineras líderes confían en nuestra plataforma para optimizar sus
                    operaciones de mantenimiento de neumáticos.
                </p>
                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-3/4">
                    <div className="flex flex-col gap-2 bg-white dark:bg-black w-full lg:w-80 h-80 p-4 rounded-sm border border-gray-200 shadow-sm">
                        <FaQuoteRight size={40} className="text-gray-400 dark:text-white" />
                        <p className="text-xl text-gray-600 dark:text-white font-bold">
                            La plataforma ha mejorado significativamente nuestra eficiencia de
                            mantenimiento, reduciendo costos y aumentando la seguridad de nuestros
                            neumáticos.
                        </p>
                        <p className="text-md text-gray-600 dark:text-white">
                            - Juan Pérez, Gerente de Mantenimiento, Minera El Cobre
                        </p>
                    </div>
                    {/* testimonio 2  */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-black w-full lg:w-80 h-80 p-4 rounded-sm border border-gray-200 shadow-sm">
                        <FaQuoteRight size={40} className="text-gray-400 dark:text-white" />
                        <p className="text-xl text-gray-600 dark:text-white font-bold">
                            La plataforma ha mejorado significativamente nuestra eficiencia de
                            mantenimiento, reduciendo costos y aumentando la seguridad de nuestros
                            neumáticos.
                        </p>
                        <p className="text-md text-gray-600 dark:text-white">
                            - Juan Pérez, Gerente de Mantenimiento, Minera El Cobre
                        </p>
                    </div>
                    {/* testimonio 3 */}
                    <div className="flex flex-col gap-2 bg-white dark:bg-black w-full lg:w-80 h-80 p-4 rounded-sm border border-gray-200 shadow-sm">
                        <FaQuoteRight size={40} className="text-gray-400 dark:text-white" />
                        <p className="text-xl text-gray-600  dark:text-white font-bold">
                            La plataforma ha mejorado significativamente nuestra eficiencia de
                            mantenimiento, reduciendo costos y aumentando la seguridad de nuestros
                            neumáticos.
                        </p>
                        <p className="text-md text-gray-600 dark:text-white">
                            - Juan Pérez, Gerente de Mantenimiento, Minera El Cobre
                        </p>
                    </div>
                </div>
            </section>
            {/* seccion de contacto */}
            <section
                id="contact"
                className="w-full py-12 lg:h-[110vh] md:py-24 lg:py-32 bg-zinc-900 text-white"
            >
                <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            ¿Listo para optimizar su mantenimiento de neumáticos?
                        </h2>
                        <p className="max-w-[600px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Contáctenos hoy para una demostración personalizada y descubra cómo
                            nuestra plataforma puede transformar sus operaciones.
                        </p>
                    </div>
                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <form className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none">
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    placeholder="Ingrese su nombre"
                                    className="bg-zinc-700 border-zinc-600 p-2 rounded-md"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Ingrese su correo electrónico"
                                    className="bg-zinc-700 border-zinc-600 p-2 rounded-md"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label
                                    htmlFor="company"
                                    className="text-sm font-medium leading-none"
                                >
                                    Empresa
                                </label>
                                <input
                                    id="company"
                                    placeholder="Nombre de su empresa"
                                    className="bg-zinc-700 border-zinc-600 p-2 rounded-md"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium leading-none"
                                >
                                    Mensaje
                                </label>
                                <input
                                    id="message"
                                    placeholder="¿En qué podemos ayudarle?"
                                    className="min-h-[120px] bg-zinc-700 border-zinc-600 p-2 rounded-md"
                                />
                            </div>
                            <button className="w-full bg-primary hover:bg-primary/90 p-2 rounded-md">
                                Enviar Solicitud
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
