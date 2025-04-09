import { FaChartBar } from 'react-icons/fa';


export default function CardChart({ titulo, estadistica }: { titulo: string, estadistica: string }) {
    return (
        <div className={` w-64 h-40 bg-white shadow-md  p-2 flex flex-col items-center rounded-lg border border-slate-600 `}>
            <div className='w-[80%] h-20 flex justify-between items-center'>
                <p className="text-black font-mono font-semibold text-4xl">{estadistica}</p>
                <FaChartBar size={50} color="black" />
            </div>
            <p className="text-black text-lg font-semibold font-mono">{titulo}</p>
        </ div>
    )
}