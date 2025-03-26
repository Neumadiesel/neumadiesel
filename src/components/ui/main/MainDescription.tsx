export default function MainDescription() {
    return (
        <div className="bg-amber-300 w-[100%] px-10 h-[50%] md:h-[40vh] p-4 flex flex-col justify-center items-center gap-y-4">
            <h2 className="font-bold text-black text-5xl text-center">
                Sistema de Gestión de Mantenimiento de Neumáticos
            </h2>
            <p className="text-black text-center text-xl">
                Controle, planifique y optimice el mantenimiento de neumáticos de su flota con nuestra plataforma integral desarrollada por <span className="font-bold text-lg">NeuamDiesel</span>.
            </p>
            <section className="gap-x-4 flex">
                <button className="bg-amber-50 font-bold border border-black w-32 text-black p-2 rounded-md hover:bg-amber-400 transition-all ease-in-out">
                    Ingresar
                </button>
                <button className="bg-blue-500 font-bold text-white border border-black w-36  p-2  rounded-md hover:bg-blue-700 transition-all ease-in-out">
                    Documentación
                </button>

            </section>
        </div>
    )
}