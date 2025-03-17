import Link from 'next/link';
import { GiMineTruck } from 'react-icons/gi';

interface CardMainProps {
    link: string;
    titulo: string;
    children: React.ReactNode;
}

export default function CardMain({ link, titulo, children }: CardMainProps) {
    return (

        <Link href={`/${link}`} className="w-full h-32 rounded-xl flex flex-col justify-center items-center bg-white border border-amber-200 shadow-amber-300 shadow-sm">
            {children}
            <p className="text-black font-semibold text-lg">{titulo}</p>
        </Link>
    )
}