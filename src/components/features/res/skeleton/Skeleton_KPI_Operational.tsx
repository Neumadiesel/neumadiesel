import Select from "react-select";

export default function Skeleton_KPI_Operational_Scrapped() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex w-full gap-x-5 items-center">
                {/* Selector de dimensión */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Filtrar por dimensión:
                    </label>
                    <Select
                        options={[]} // Reemplazar con opciones de dimensión
                        isClearable
                        placeholder="Todas las dimensiones"
                        onChange={(e) => { }} // Reemplazar con lógica de cambio
                        value={null} // Reemplazar con valor seleccionado
                        className="react-select-container text-black w-full sm:w-72"
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Selector de rango de tiempo */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rango de tiempo:
                    </label>
                    <Select
                        options={[
                            { value: 12, label: 'Últimos 12 meses' },
                            { value: 24, label: 'Últimos 24 meses' },
                            { value: 36, label: 'Últimos 36 meses' },
                            { value: 48, label: 'Últimos 48 meses' }
                        ]}
                        defaultValue={{ value: 12, label: 'Últimos 12 meses' }}
                        onChange={(e) => { }} // Reemplazar con lógica de cambio
                        className="react-select-container text-black w-full sm:w-48"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>


            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md h-26" />
                ))}
            </div>

            {/* KPIs de Análisis Avanzado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md h-32" />
                ))}
            </div>

            {/* Neumático Destacado */}
            <div className="bg-yellow-100 dark:bg-yellow-400 p-4 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-700 h-28">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-200 dark:bg-yellow-400 h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-yellow-200 dark:bg-yellow-400 rounded w-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="h-3 bg-yellow-200 dark:bg-yellow-300 rounded w-3/4" />
                                    <div className="h-5 bg-yellow-200 dark:bg-yellow-300 rounded w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}