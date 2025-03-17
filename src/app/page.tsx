import ListaAlertas from "@/components/main/ListaAlertas";
import ListaMaquinaria from "@/components/main/ListaMaquinaria";
import ListaNeumaticos from "@/components/main/ListaNeumaticos";
export default function Page() {

  return (
    <div className="flex justify-center items-center h-screen bg-[#F1F1F1] text-black relative shadow-sm font-mono">

      <section className="flex flex-col items-center justify-center w-full h-full md:p-3.5">
        <ListaMaquinaria />
        <ListaNeumaticos />
      </section>
      {/* Zona de alertas */}
      <aside className="hidden md:flex md:flex-col items-center  md:bg-[#212121] m-10 p-5 w-[40%] h-[90%] rounded-lg">
        <div className="w-full " >
          <h2 className="text-4xl font-bold text-white">Alertas</h2>
          <ListaAlertas />
        </div>
      </aside>
    </div>
  );
}
