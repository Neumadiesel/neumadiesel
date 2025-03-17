import { FaChartBar } from 'react-icons/fa';


export default function CardChart({ backgroundColor, titulo, estadistica }: { backgroundColor: string, titulo: string, estadistica: string }) {
    return (
        <div className={`${backgroundColor} w-[100%]  p-2 flex rounded-lg border-2 border-black h-32`}>
            <div className='min-w-[80%]'>
                <p className="text-black font-mono font-semibold text-2xl">{estadistica}</p>
                <p className="text-black font-mono">{titulo}</p>
            </div>
            <FaChartBar size={50} color="black" />
        </ div>
    )
}