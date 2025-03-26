import { GiAutoRepair, GiCartwheel, GiMineTruck } from "react-icons/gi";
import CardMain from "../CardMain";

export default function CardSection() {
    return (
        <div className="bg-blue-500 w-[100%] h-[60vh] md:h-[40vh]">
            <section className="md:flex grid py-5 gap-y-4 justify-center items-center h-[80%] gap-x-5">

                <CardMain titulo="Maquinaria" cantidad={43} link="maquinaria" descripcion="Total de maquinas operando en faena">
                    <GiMineTruck size={50} color="black" />
                </CardMain>
                <CardMain titulo="Neumáticos" cantidad={43} link="neumaticos" descripcion="Total de neumáticos en uso">
                    <GiCartwheel size={50} color="black" />
                </CardMain>
                <CardMain titulo="Mantenimiento" cantidad={13} link="mantenimiento" descripcion="Total de mantenimientos programados">
                    <GiAutoRepair size={50} color="black" />
                </CardMain>

            </section>
        </div>
    )
}