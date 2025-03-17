import ExampleChart from "@/components/charts/ExampleChart";
import Image from 'next/image';
import { FaChartBar, FaUser } from 'react-icons/fa';
import { GiMineTruck, GiFlatTire } from 'react-icons/gi';
import { DB_Relacion_Numaticos_Camion } from "@/mocks/DB_Relacion_Neumaticos_Camion.json";
import CardMain from "@/components/ui/CardMain";

export default function Page() {


  const neumaticos = DB_Relacion_Numaticos_Camion.map(neumatico => {
    const diferencia = Math.abs(neumatico.medicion_exterior - neumatico.medicion_interior);
    let estado = 'Bueno';
    if (diferencia > 4) {
      estado = 'Desgastado';
    } else if (diferencia > 2) {
      estado = 'Mantención';
    }
    return { ...neumatico, estado };
  });

  return (
    <div className=" bg-white dark:bg-[#212121] text-black dark:text-white font-mono h-full p-3">

      {/* Zona superior tarjetas */}
      <div className="md:flex h-[70%] md:h-[50%]">
        <main className="md:w-[40%] p-2">
          <h2 className="text-3xl font-mono font-bold">Informe de bajas</h2>
          <ExampleChart />
        </main>
        {/* Zona de accesos */}
        <aside className="md:w-[60%] p-3">
          <h2 className="font-mono font-bold text-3xl">Tus accesos</h2>
          <section className="flex overflow-x-scroll md:grid md:grid-cols-3 x-auto gap-4 gap-y-8 py-3 justify-items-center md:mt-8">
            <CardMain titulo="Maquinaria" link="maquinaria">
              <GiMineTruck size={50} color="black" />
            </CardMain>
            <CardMain titulo="Neumaticos" link="neumaticos" >
              <Image src="/neumatico-3.png" width={50} height={50} alt="Acceso pagina neumaticos" />
            </CardMain>
            <CardMain titulo="Graficos" link="estadisticas" >
              <FaChartBar size={50} color="black" />
            </CardMain>
            {/* Mantenimiento */}
            <CardMain titulo="Mantenimiento" link="mantenimiento" >
              <GiFlatTire size={50} color="black" />
            </CardMain>
            {/* Usuario */}
            <CardMain titulo="Usuarios" link="usuario" >
              <FaUser size={50} color="black" />
            </CardMain>
          </section>
        </aside>

      </div>


      {/* Zona inferior neumaticos con alertas */}
      <section className="h-[50vh]">
        <h3 className="text-3xl font-semibold">Alertas</h3>
        <main className="grid  grid-cols-1 gap-y-5 md:flex items-center justify-between gap-x-3 pr-4 h-[80%]">
          <div className="md:w-[60%]">
            <table className="w-full text-center gap-x-2 border-collapse">
              <thead className="">
                <tr>
                  <th className="w-24  rounded-md text-black"><p className="bg-amber-300 m-2 rounded-md">Neumatico</p></th>
                  <th className="w-24  rounded-md text-black"><p className="bg-amber-300 m-2 rounded-md">Maquinaria</p></th>
                  <th className="w-24  rounded-md text-black"><p className="bg-amber-300 m-2 rounded-md">Remanente</p></th>
                  <th className="w-24 hidden md:table-cell  rounded-md text-black"><p className="bg-amber-300 m-2 rounded-md">Horas</p></th>
                  <th className="w-24 hidden md:table-cell  rounded-md text-black"><p className="bg-amber-300 m-2 rounded-md">Kilometro</p></th>
                </tr>
              </thead>
              <tbody>
                {
                  neumaticos
                    .filter((neumatico) => neumatico.estado === 'Desgastado')
                    .map((neumatico) => (
                      <tr key={neumatico.id}>
                        <td>
                          <p className="bg-slate-100 mx-2 mb-2 rounded-md">

                            {neumatico.id_neumatico}
                          </p>

                        </td>
                        <td>
                          <p className="bg-slate-100 mx-2 mb-2 rounded-md">

                            {neumatico.Codigo_camion}
                          </p>

                        </td>
                        <td>
                          <p className="bg-slate-100 mx-2 mb-2 rounded-md">

                            {neumatico.medicion_exterior}
                          </p>

                        </td>
                        <td>
                          <p className="bg-slate-100 hidden md:block mx-2 mb-2 rounded-md">

                            {neumatico.Horas_utilizados}
                          </p>

                        </td>
                        <td>
                          <p className="bg-slate-100 hidden md:block mx-2 mb-2 rounded-md">

                            {neumatico.km_utilizados}
                          </p>

                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          {/* Logo empresa */}
          <div className="flex justify-center items-center h-[10vh] md:w-[30%]">
            <Image src="/logo-amsa.png" width={400} height={300} alt="Logo empresa" />
          </div>
        </main>
      </section>
    </div>
  );
}

// Componente antiguo


// <div className="flex justify-center items-center h-screen bg-[#F1F1F1] text-black relative shadow-sm font-mono">

// <section className="flex flex-col items-center justify-center w-full h-full md:p-3.5">
//   <ListaMaquinaria />
//   <ListaNeumaticos />
// </section>
// {/* Zona de alertas */}
// <aside className="hidden md:flex md:flex-col items-center  md:bg-[#212121] m-10 p-5 w-[40%] h-[90%] rounded-lg">
//   <div className="w-full " >
//     <h2 className="text-4xl font-bold text-white">Alertas</h2>
//     <ListaAlertas />
//   </div>
// </aside>
// </div>