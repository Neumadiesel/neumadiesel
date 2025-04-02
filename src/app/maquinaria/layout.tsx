import { Camiones } from "@/mocks/Camiones.json";
import Link from "next/link";
import { GiMineTruck } from "react-icons/gi";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#f1f1f2] dark:bg-[#212121] block lg:flex  min-h-screen m-4">
            <main className="w-full lg:w-[40%] lg:h-screen h-[45vh]  flex justify-center items-center">
                <div className="bg-white dark:bg-black shadow-md rounded-lg w-[100%] h-[100%] pt-3 ">
                    <h2 className="dark:text-amber-300 text-2xl font-bold p-2">Lista de Camiones</h2>
                    <div className="grid grid-cols-3 h-[85%] overflow-scroll gap-x-4 gap-y-2 px-6">
                        {Camiones.map((camion) => (
                            <Link href={`/maquinaria/${camion.Codigo}`} key={camion.Codigo} className="flex flex-col h-28 justify-center items-center p-2 bg-[#f1f1f1] dark:bg-[#212121] rounded-md hover:bg-amber-200 transition-all ease-in-out ">
                                <GiMineTruck size={35} />
                                <p className="text-xl font-semibold font-mono">{camion.Codigo}</p>
                            </Link>
                        ))
                        }
                    </div>
                </div>
            </main>
            <section className="w-full lg:w-[60%] h-[100%] lg:p-3">
                {children}
            </section>
        </div>
    )
}