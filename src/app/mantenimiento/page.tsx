import { FaDesktop } from "react-icons/fa";

export default function Page() {
    return (
        <div className="m-3 p-3 bg-white dark:bg-[#212121] w-[95%] rounded-md shadow-md h-[80%] flex flex-col items-center justify-center">
            <FaDesktop size={96} className="text-black dark:text-white mb-4" />
            <h3 className="  font-semibold text-xl mb-4">
                Bienvenido a la sección de Operaciones
            </h3>
            <p className="text-sm w-[50%] text-center">
                En esta sección podrás visualizar y realizar operaciones relacionadas con el
                mantenimiento de la maquinaria y los neumáticos
            </p>
        </div>
    );
}
