import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import CardChart from '@/components/ui/CardChart';
import ExampleChart from '@/components/charts/ExampleChart';

export default function Page() {

    return (
        <div className="flex flex-col  h-screen bg-white  text-white md:w-[70%] mx-auto shadow-sm font-mono p-3">
            <h1 className='text-3xl font-mono font- text-black'>Dashboard</h1>
            {/* Resumenes */}
            <div className='grid grid-cols-2 md:grid-cols-4 w-full x-auto gap-2 py-2 justify-items-center'>
                <CardChart backgroundColor='bg-red-200' titulo='Maquinas funcionando' estadistica='31' />
                <CardChart backgroundColor='bg-yellow-200' titulo='Neumaticos en bodega' estadistica='87' />
                <CardChart backgroundColor='bg-yellow-200' titulo='Maquinas en mantencion' estadistica='2' />
                <CardChart backgroundColor='bg-red-200' titulo='Neumaticos criticos' estadistica='13' />
            </div>
            <div className='bg-red-600 h-[100%] w-[100%] flex justify-center items-center'>
                <ExampleChart />
            </div>
        </div>
    );
}