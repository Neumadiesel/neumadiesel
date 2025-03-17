import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Page() {


    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = [
        'Page A',
        'Page B',
        'Page C',
        'Page D',
        'Page E',
        'Page F',
        'Page G',
    ];
    return (
        <div className="flex justify-center items-center h-screen bg-amber-300 text-white relative shadow-sm font-mono">
            <div>Neumadiesel</div>
            <BarChart
                width={500}
                height={300}
                colors={['#8884d8', '#82ca9d']}

                series={[
                    { data: pData, label: 'pv', id: 'pvId' },
                    { data: uData, label: 'uv', id: 'uvId' },
                ]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
            />
        </div>
    );
}