import { FaExclamationTriangle } from "react-icons/fa";

export default function DesactivarCuenta() {
    return (
        <section className="flex flex-col h-full w-2/3 mx-auto">
            <h1 className=" text-center text-2xl font-bold">Desactivar cuenta</h1>
            {/* icono de alerta */}
            <FaExclamationTriangle className="my-4 text-red-500 text-5xl mx-auto" />
            <p className="text-sm text-gray-500 text-justify">
                Si desea desactivar su cuenta, por favor ingrese su contraseña actual y confirme
                para continuar.
            </p>
            <p className="text-sm text-gray-500 text-justify">
                Para volver a activar su cuenta, contactar con la administración.
            </p>
            <label className="text-sm mt-4 text-gray-950 font-semibold">Contraseña actual:</label>
            <input
                type="password"
                className="text-sm bg-gray-50 outline-gray-300 text-gray-950 font-semibold border border-gray-300 rounded-sm p-2"
            />
            <button className="bg-red-500 hover:bg-red-600 mt-4 text-white font-semibold rounded-sm p-2">
                Desactivar cuenta
            </button>
        </section>
    );
}
