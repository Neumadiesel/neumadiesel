import Link from 'next/link';

interface CardMainProps {
    link: string;
    titulo: string;
    children: React.ReactNode;
}

export default function CardMain({ link, titulo, children }: CardMainProps) {
    return (

        <Link href={`/${link}`} className="w-[80%] h-32 rounded-xl p-3 bg-amber-300 hover:bg-amber-200 transition-all ease-in-out border border-black shadow-md ">
            <p className="text-black font-semibold text-lg">{titulo}</p>
            <div className='flex justify-center items-center' >
                {children}
            </div >
        </Link >
    )
}