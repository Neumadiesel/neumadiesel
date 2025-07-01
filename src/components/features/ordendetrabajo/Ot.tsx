export default function OT({ id }: { id: number }) {
    const neumaticos = [
        {
            posicion: "1",
            nroSerie: "ABC123456",
            sensor: "SN-001",
            nroAro: "AR-123",
            tipoAro: "Aluminio",
            medida: "295/80R22.5",
            fabricante: "Michelin",
            diseno: "X Works",
            gomaRemanente: "12 mm",
            razonDesmontaje: "Desgaste irregular",
            destino: "Recauchado",
        },
        {
            posicion: "2",
            nroSerie: "DEF789012",
            sensor: "SN-002",
            nroAro: "AR-124",
            tipoAro: "Acero",
            medida: "295/80R22.5",
            fabricante: "Bridgestone",
            diseno: "M840",
            gomaRemanente: "9 mm",
            razonDesmontaje: "Pinchazo",
            destino: "Desecho",
        },
        {
            posicion: "3",
            nroSerie: "MNO567890",
            sensor: "SN-005",
            nroAro: "AR-127",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "4",
            nroSerie: "PQR123456",
            sensor: "SN-006",
            nroAro: "AR-128",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "5",
            nroSerie: "STU567890",
            sensor: "SN-007",
            nroAro: "AR-129",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
        {
            posicion: "6",
            nroSerie: "VWX123456",
            sensor: "SN-008",
            nroAro: "AR-130",
            tipoAro: "Poliuretano",
            medida: "295/80R22.5",
            fabricante: "Goodyear",
            diseno: "Eagle",
            gomaRemanente: "10 mm",
            razonDesmontaje: "Falla estructural",
            destino: "Recauchado",
        },
    ];

    const campos = [
        { label: "Posición", key: "posicion" },
        { label: "N° Serie", key: "nroSerie" },
        { label: "N° Sensor", key: "sensor" },
        { label: "N° Aro", key: "nroAro" },
        { label: "Tipo Aro", key: "tipoAro" },
        { label: "Medida", key: "medida" },
        { label: "Fabricante", key: "fabricante" },
        { label: "Diseño", key: "diseno" },
        { label: "Goma Remanente", key: "gomaRemanente" },
        { label: "Razón Desmontaje", key: "razonDesmontaje" },
        { label: "Destino", key: "destino" },
    ];
    return (
        <div className="flex flex-col p-3 items-center min-h-full bg-amber-200 dark:bg-neutral-800 dark:text-white gap-y-4">
            <h1 className="text-2xl font-bold">Orden de Trabajo de Neumaticos</h1>
            {/* Seccion de informacion de trabajo */}
            <section className="flex flex-col w-full h-[15%] border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="flex flex-col w-full h-full gap-y-2">
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        {/* Descripcion del trabajo */}
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-64 border-r border-gray-500">
                            Descripcion del trabajo
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Zona donde se desarrolla y tipo de intervencion */}
                    <section className="flex flex-row w-full h-full gap-x-2">
                        {/* Zona de trabajo */}
                        <div className="flex flex-row w-[50%] h-10 border border-gray-500">
                            <label className="text-md font-bold bg-amber-300 text-black p-2 w-[54%] border-r border-gray-500">
                                Zona de trabajo
                            </label>
                            <select className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300 ">
                                <option value="Losa">Losa</option>
                                <option value="Terreno">Terreno</option>
                                <option value="Truck Shop">Truck Shop</option>
                            </select>
                        </div>
                        {/* Tipo de intervencion */}
                        <div className="flex flex-row w-[50%] h-10 border border-gray-500 ">
                            <label className="text-md font-bold bg-amber-300 text-black p-2 w-[60%] border-r border-gray-500">
                                Tipo de intervencion
                            </label>
                            <select className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300">
                                <option value="Apoyo mecanico">Apoyo mecanico</option>
                                <option value="Correctiva">Correctiva</option>
                                <option value="Programada">Programada</option>
                                <option value="Imprevisto">Imprevisto</option>
                            </select>
                        </div>
                    </section>
                </div>
            </section>
            {/* Modelo del equipo */}
            <section className="flex items-center  w-full h-[10%] border border-gray-500 rounded-sm p-3 gap-x-2 bg-white dark:bg-neutral-900">
                <div className="flex flex-row w-full h-10 border border-gray-500 ">
                    <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                        Modelo del equipo
                    </label>
                    <input
                        type="text"
                        placeholder="KOMATSU 830-E"
                        className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                    />
                </div>
                {/* Codigo del equipo */}
                <div className="flex flex-row w-full h-10 border border-gray-500 ">
                    <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                        Codigo del equipo
                    </label>
                    <input
                        type="text"
                        placeholder="H-41"
                        className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                    />
                </div>
            </section>
            {/* Infomracion registro de detencion */}
            <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="grid grid-cols-2  gap-x-2 w-full h-full">
                    {/* Fecha */}
                    <div className="flex flex-row w-full h-10 border border-gray-500 ">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Fecha
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Hora de detencion */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Hora de Detencion
                        </label>
                        <input
                            type="time"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Personal ejecutor */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Personal Ejecutor
                        </label>
                        <input
                            type="text"
                            placeholder="NEUMADIESEL"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Hora Entrega de Despacho */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Hora Entrega Despacho
                        </label>
                        <input
                            type="time"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Cantidad de personas */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Cantidad de personas
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Horas Hombre */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Horas Hombre
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                </div>
            </section>
            {/* Seccion de registro torque utilizado */}
            <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <div className="grid grid-cols-2  gap-x-2 w-full h-full">
                    {/* Torque aplicado */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Torque aplicado
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Torquit utilizado */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Torquit utilizado
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* 1 verificacion torque (fecha/hora) */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            1ra verif. torque
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* Serie torquit */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            Serie torquit
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                    {/* 2 verificacion torque (fecha/hora) */}
                    <div className="flex flex-row w-full h-10 border border-gray-500">
                        <label className="text-md font-bold bg-amber-300 text-black p-2 w-[50%] border-r border-gray-500">
                            2da verif. torque
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full p-2 px-4 font-bold outline-amber-300 focus:outline-amber-300"
                        />
                    </div>
                </div>
            </section>
            {/* Seccion neumatico desintalado,*/}
            <section className="flex flex-col w-full h-[80%] border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Desinstalados</h2>
                <div className="overflow-x-auto rounded-sm shadow">
                    <table className="border min-w-full text-sm text-left">
                        <tbody>
                            {campos.map((campo, index) => (
                                <tr key={index} className="border-b">
                                    <th className="bg-gray-100 dark:bg-[#000] dark:text-white text-gray-700 px-4 py-2 font-semibold w-48">
                                        {campo.label}
                                    </th>
                                    {neumaticos.map((neumatico, idx) => (
                                        <td key={idx} className="px-4 py-2">
                                            {neumatico[campo.key as keyof typeof neumatico]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Seccion neumatico instalado,*/}
            <section className="flex flex-col w-full h-[80%] border border-gray-500 rounded-sm p-3 bg-white dark:bg-neutral-900">
                <h2 className="text-xl font-bold mb-4">Neumáticos Instalados</h2>
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="border min-w-full text-sm text-left">
                        <tbody>
                            {campos.map((campo, index) => (
                                <tr key={index} className="border-b">
                                    <th className="bg-gray-100 text-gray-700 px-4 py-2 font-semibold w-48">
                                        {campo.label}
                                    </th>
                                    {neumaticos.map((neumatico, idx) => (
                                        <td key={idx} className="px-4 py-2">
                                            {neumatico[campo.key as keyof typeof neumatico]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* Seccion comentarios/observaciones */}
            <section className="flex flex-col w-full h-40 border border-gray-500 rounded-sm p-3 bg-white">
                <div className="flex flex-col w-full  border border-gray-500">
                    <label className="text-md font-bold border-b border-gray-500 bg-amber-300 text-black p-2 text-center w-full ">
                        Comentarios/Observaciones del trabajo realizado
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 px-4 font-bold   min-h-20 outline-amber-300 focus:outline-amber-300"
                    />
                </div>
            </section>
        </div>
    );
}
