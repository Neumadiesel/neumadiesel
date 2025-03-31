import * as React from 'react';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import { FaClock } from 'react-icons/fa';
import { PiTireBold } from 'react-icons/pi';
import { programa_mantenimiento } from "@/mocks/programa.json";
import Image from 'next/image';
import { GiFlatTire, GiMineTruck } from 'react-icons/gi';
import Link from 'next/link';
import ScatterPlot from '@/components/charts/ScatterPlot';
import StackBars from '@/components/charts/BarOverview';

export default function Page() {

    return (
        <div className="flex flex-col overflow-x-hidden  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-black text-center w-full mx-auto font-mono md:p-3">
            <main className='w-[100%] md:rounded-md mx-auto md:p-4 h-[95%] '>

                <div className="flex flex-col md:grid md:grid-cols-4 grid-rows-5 pb-4 gap-2 md:gap-4">
                    <div className="  shadow-md md:rounded-md py-3 col-span-4 row-span-1 flex items-center justify-center flex-col bg-amber-300">
                        <h1 className='text-3xl font-bold font-mono'>Sistema de Reportabilidad NeumaDiesel</h1>
                        <Image src="/logo.svg" alt="Logo" width={500} height={100} />
                    </div>
                    {/* Grafico de barras */}
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2 row-span-2 row-start-2">
                        <BarChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-2">
                        <ScatterPlot />
                    </div>

                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <PieChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <StackBars />
                    </div>

                </div>

            </main>
        </div>
    );
}