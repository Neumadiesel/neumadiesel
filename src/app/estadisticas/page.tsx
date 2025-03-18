import * as React from 'react';
import CardChart from '@/components/ui/CardChart';
import ExampleChart from '@/components/charts/ExampleChart';

export default function Page() {

    return (
        <div className="flex flex-col  h-screen bg-white dark:bg-[#212121]   text-white w-full mx-auto shadow-sm font-mono p-3">
            <h1 className='text-3xl font-mono dark:text-white text-black'>Dashboard</h1>
            {/* Resumenes */}
            <div className='grid grid-cols-2 md:grid-cols-4 w-full x-auto gap-2 py-2 justify-items-center'>
                <CardChart backgroundColor='bg-red-200' titulo='Maquinas funcionando' estadistica='31' />
                <CardChart backgroundColor='bg-yellow-200' titulo='Neumaticos en bodega' estadistica='87' />
                <CardChart backgroundColor='bg-yellow-200' titulo='Maquinas en mantencion' estadistica='2' />
                <CardChart backgroundColor='bg-red-200' titulo='Neumaticos criticos' estadistica='13' />
            </div>
            <div className=' w-[100%] h-[60vh] flex justify-center items-center'>
                <ExampleChart />
            </div>
        </div>
    );
}