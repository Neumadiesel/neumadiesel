import * as React from 'react';
import CardChart from '@/components/ui/CardChart';
import ExampleChart from '@/components/charts/ExampleChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';

export default function Page() {

    return (
        <div className="flex flex-col  h-full bg-[#f1f1f1] dark:bg-[#212121]   text-black text-center w-full mx-auto shadow-sm font-mono p-3">
            <main className='w-[100%] rounded-md mx-auto p-4 h-[100%] '>

                <div className="grid grid-cols-4 grid-rows-11 gap-4">
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2 row-span-2">1</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-3">3</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-4">4</div>
                    <div className=" bg-blue-400 shadow-md rounded-md py-3 h-24 row-start-3">neumaticos funcinando</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3">camionenes opeartivos</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3">7</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-start-3">8</div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2  row-span-3 row-start-4">
                        <PieChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-2 row-span-3 row-start-4">
                        <BarChart />
                    </div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-3 row-span-2 row-start-7">programa semanal primeras filas</div>
                    <div className=" bg-white shadow-md rounded-md py-3 row-span-2 col-start-4 row-start-7">13</div>
                    <div className=" bg-white shadow-md rounded-md py-3 col-span-4 row-span-3 row-start-9">14</div>
                </div>

            </main>
        </div>
    );
}