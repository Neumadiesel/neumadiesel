import Image from "next/image";

export default function PhotoCard() {
    return (
        <div className="bg-white dark:bg-[#212121] flex flex-col w-[40vh] rounded-md shadow-md">
            <Image
                src="https://www.codelco.com/prontus_codelco/site/artic/20170509/imag/foto_0000000220170509095542.jpg"
                alt="Placeholder Image"
                width={400}
                height={400}
                className="rounded-t-md object-cover w-full"
            />
            {/* Info de la foto */}
            <div className="p-2">
                <h2 className="text-2xl font-semibold mt-4">Foto del Neumático</h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                    Esta imagen muestra el estado actual del neumático. Asegúrate de verificar la presión y la temperatura antes de continuar.
                </p>
            </div>
        </div>
    );
}