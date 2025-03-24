import * as React from 'react';
import CardChart from '@/components/ui/CardChart';
import ExampleChart from '@/components/charts/ExampleChart';
import BarChart from '@/components/charts/BarChart';

export default function Page() {

    return (
        <div className="flex flex-col  h-full bg-white dark:bg-[#212121]   text-white w-full mx-auto shadow-sm font-mono p-3">
            <main className='w-[80%] mx-auto p-4'>
                <h1 className='text-3xl font-mono dark:text-white text-black'>Dashboard</h1>
                {/* Resumenes */}
                <div className='flex bg-white w-[100%] x-auto gap-2 py-4 rounded-lg justify-between'>
                    <CardChart titulo='Maquinas funcionando' estadistica='31' />
                    <CardChart titulo='Neumaticos en bodega' estadistica='87' />
                    <CardChart titulo='Maquinas en mantencion' estadistica='2' />
                    <CardChart titulo='Neumaticos criticos' estadistica='13' />
                </div>
                <section className='flex justify-between gap-x-2'>

                    <div className=' w-[50%] h-[45vh] flex justify-center items-center'>
                        <ExampleChart />
                    </div>
                    <div className=' w-[50%] h-[45vh] flex justify-center items-center'>
                        <BarChart />
                    </div>
                </section>
            </main>
        </div>
    );
}