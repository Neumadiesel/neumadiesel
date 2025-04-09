import Image from "next/image";
import Link from "next/link";

export default function Login() {
    return (
        <div className="relative w-full h-screen">
            {/* Video de fondo */}
            <video 
                src="/video-1.mp4" 
                autoPlay 
                muted 
                loop 
                className="absolute w-full h-full object-cover"
            />
            
            {/* Overlay semi-transparente */}
            <div className="absolute w-full h-full bg-black/40" />

            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="flex flex-col items-center mb-6">
                        <Image 
                            src="/NEUMASYSTEM.png" 
                            alt="logo" 
                            width={250} 
                            height={180} 
                            className="mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido a Neumasystem</h1>
                        <p className="text-gray-600">Inicia sesión para continuar</p>
                    </div>
                    
                    <div className="space-y-4 flex flex-col items-center">
                        <input 
                            type="text" 
                            placeholder="Correo electrónico" 
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            className="w-full p-3 rounded-md bg-amber-300 text-black text-xl hover:bg-amber-500 transition-colors font-bold"
                        >
                            Iniciar sesión
                        </button>
                        <Link href="/forgot-password" className="text-gray-600 hover:text-yellow-500">¿Olvidaste tu contraseña?</Link>

                    </div>
                </div>
            </div>
        </div>
    );
}