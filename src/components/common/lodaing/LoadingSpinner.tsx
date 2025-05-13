
interface LoadingSpinnerProps {
    isOpen: boolean;
}

export default function LoadingSpinner({ isOpen }: LoadingSpinnerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            {/* Fondo oscuro con opacidad */}
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>

            <div className="relative p-6 rounded-lg">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

            </div>
            {/* Texto que diga cargando informacion, espera un momento */}
            <div className="absolute mt-32 inset-0 flex items-center justify-center text-white">
                <p className="text-lg">Cargando información importante, espera un momento...</p>
            </div>

        </div>
    );
}
