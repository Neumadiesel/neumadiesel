import Link from "next/link";

interface CardMainProps {
    title: string;
    icon: React.ReactNode;
    count: number;
    link: string;
}

export default function CardMainFeaturing({ title, icon, count, link }: CardMainProps) {
    return (
        <Link href={link} className=" bg-white dark:bg-[#212121] dark:text-white shadow-md rounded-md py-3 row-span-2 col-start-3 flex flex-col justify-center items-center px-2">
            {icon}
            <p className='font-semibold'>{title}</p>
            <p className='text-3xl font-bold'>{count}</p>
            <small>
                Presione <span className='text-amber-600 font-semibold p-2'>aqui</span>  para ver mas detalles
            </small>
        </Link>

    )
}