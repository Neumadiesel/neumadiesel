import * as React from 'react';
import BarChart from '@/components/common/charts/BarChart';
import PieChart from '@/components/common/charts/PieChart';
import Image from 'next/image';
import ScatterPlot from '@/components/common/charts/ScatterPlot';
import StackBars from '@/components/common/charts/BarOverview';

export default function Page() {

    return (
        <div className="flex flex-col overflow-x-hidden  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-black text-center w-full mx-auto font-mono lg:p-3">
            <main className='w-[100%] lg:rounded-md mx-auto lg:p-4 h-[95%] '>

                <div className="flex flex-col lg:grid lg:grid-cols-4 grid-rows-5 pb-4 gap-2 lg:gap-4">
                    <div className="  shadow-md lg:rounded-md py-3 col-span-4 row-span-1 flex items-center justify-center flex-col bg-amber-300">
                        <Image src="/NEUMASYSTEM.png" alt="Logo" width={500} height={100} />
                    </div>
                    {/* Grafico de barras */}
                    <div className=" bg-white dark:bg-gray-700 shadow-md rounded-md py-3 col-span-2 row-span-2 row-start-2">
                        <BarChart />
                    </div>
                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-2">
                        <ScatterPlot />
                    </div>

                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <PieChart />
                    </div>
                    <div className=" bg-white dark:bg-slate-600 shadow-md rounded-md py-3 col-span-2  row-span-2 row-start-4">
                        <StackBars />
                    </div>

                </div>

            </main>
        </div>
    );
}