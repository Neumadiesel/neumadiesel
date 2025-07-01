interface Props {
    pasoActual: number;
}

export default function PasoStepper({ pasoActual }: Props) {
    const pasos = [1, 2, 3];

    return (
        <div className="flex items-center justify-center gap-4 mb-2">
            {pasos.map((paso, i) => (
                <div key={paso} className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 shadow border-2  text-lg rounded-full flex items-center justify-center text-white font-bold ${pasoActual === paso
                            ? "bg-neutral-900  dark:bg-neutral-300 text-white dark:text-black"
                            : " border-gray-400 dark:border-neutral-800 text-gray-700 bg-white dark:bg-neutral-900"
                            }`}
                    >
                        {pasoActual > i + 1 ? (
                            <span>&#10003;</span> // check mark
                        ) : (
                            paso
                        )}
                    </div>
                    {i < pasos.length - 1 && (
                        <div className="w-8 h-0.5 bg-gray-400" />
                    )}
                </div>
            ))}
        </div>
    );
}