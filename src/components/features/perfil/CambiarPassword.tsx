export default function CambiarPassword() {
    return (
        <section className="flex flex-col h-full">
            <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
            <p className="text-sm text-gray-500">
                Para cambiar tu contraseña siga las instrucciones de las siguientes etapas.
            </p>
            <main className="grid mt-2 grid-cols-3 h-3/4 items-center justify-center w-full">
                {/* Etapa 1  */}
                <div className="flex px-2 flex-col justify-between gap-4 h-full ">
                    <div className="flex flex-col">
                        <p className="text-md font-semibold">Primera etapa</p>
                        <p className="text-sm text-gray-500">
                            Ingrese su contraseña actual le enviaremos un codigo de verificación a
                            su correo.
                        </p>
                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                            Contraseña actual:
                        </label>
                        <input
                            type="password"
                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        />
                    </div>
                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                        Continuar
                    </button>
                </div>
                {/* Etapa 2  */}
                <div className="flex px-2 flex-col justify-between border-x border-dashed border-gray-500 h-full">
                    <div className="flex flex-col">
                        <p className="text-md font-semibold">Segunda etapa</p>
                        <p className="text-sm text-gray-500">
                            Ingrese el codigo de verificación que le enviamos a su correo.
                        </p>
                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                            Codigo de verificación:
                        </label>
                        <input
                            type="text"
                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        />
                    </div>
                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                        Continuar
                    </button>
                </div>
                {/* Etapa 3  */}
                <div className="flex px-2 flex-col justify-between h-full ">
                    <div className="flex flex-col">
                        <p className="text-md font-semibold">Tercera etapa</p>
                        <p className="text-sm text-gray-500">
                            Ingrese su nueva contraseña y confirme para cambiarla.
                        </p>
                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                            Nueva contraseña:
                        </label>
                        <input
                            type="password"
                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        />
                        <label className="text-sm mt-4 text-gray-950 font-semibold">
                            Confirmar contraseña:
                        </label>
                        <input
                            type="password"
                            className="text-sm bg-amber-50 outline-amber-300 text-gray-950 font-semibold border border-amber-300 rounded-sm p-2"
                        />
                    </div>
                    <button className="bg-amber-300 text-black font-semibold rounded-sm p-2">
                        Cambiar contraseña
                    </button>
                </div>
            </main>
        </section>
    );
}
