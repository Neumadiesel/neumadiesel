import Image from "next/image";

export default function Page() {
    return (
        <div className=" p-3 h-screen bg-[#212121] text-white relative shadow-sm font-mono">
            <h2 className="text-3xl font-bold">Información de Usuario</h2>
            {/* Contenedor de la informacion */}
            <div className="p-2 h-screen ">
                <section className="flex  px-5 gap-x-5 mb-5">

                    <div>
                        <Image src="/foto-stock.jpeg" alt="user" width={250} height={250} />
                    </div>

                    {/* Informacion */}
                    <div className="flex flex-col">
                        <div className="flex flex-row">
                            <div className="flex flex-col p-2">
                                <label className="text-lg font-bold">Nombre:</label>
                                <label className="text-lg font-bold">Apellido:</label>
                                <label className="text-lg font-bold">Correo:</label>
                                <label className="text-lg font-bold">Teléfono:</label>
                                <label className="text-lg font-bold">Rol:</label>
                            </div>
                            <div className="flex flex-col p-2">
                                <label className="text-lg">Juan</label>
                                <label className="text-lg">Perez</label>
                                <label className="text-lg">
                                    correo@mail.com
                                </label>
                                <label className="text-lg">1234567890</label>
                                <label className="text-lg">Administrador</label>
                            </div>
                        </div>
                    </div>

                </section>

                <h3 className=" font-mono text-2xl font-bold">Historial</h3>
                <section className="bg-white h-[50%] rounded-md  text-black">
                    {/* tabla con historial de acciones */}
                    <table className="table-auto w-full mt-4 overflow-hidden rounded-t-md">
                        <thead className="bg-amber-300 rounded-t-md">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Fecha</th>
                                <th className="px-4 py-2">Faena</th>
                                <th className="px-4 py-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">1</td>
                                <td className="border px-4 py-2">10/10/2021</td>
                                <td className="border px-4 py-2">Zaldivar</td>
                                <td className="border px-4 py-2">Creación de usuario</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">2</td>
                                <td className="border px-4 py-2">10/10/2021</td>
                                <td className="border px-4 py-2">Zaldivar</td>
                                <td className="border px-4 py-2">Eliminacion de usuario</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">3</td>
                                <td className="border px-4 py-2">10/10/2021</td>
                                <td className="border px-4 py-2">Zaldivar</td>
                                <td className="border px-4 py-2">CreaciÓn de usuario</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>

        </div>
    );
}