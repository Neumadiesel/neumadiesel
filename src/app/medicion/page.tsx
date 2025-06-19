export default function MedicionPage() {
    return (
        <div className="bg-white dark:bg-[#212121] h-full block lg:flex ">
            {/* Navegacion latearl */}
            <div className="w-[100%]">
                <h1 className="text-2xl font-bold text-center mt-4">
                    Ingresar Datos de Medición
                </h1>
                <p className="text-center mt-2">
                    Selecciona un neumático para ingresar los datos de medición.
                </p>
                {/* Aquí iría el componente de selección de neumático y formulario de medición */}
                <div className="flex justify-center mt-8">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Seleccionar Neumático
                    </button>
                </div>
            </div>
        </div>
    );
}