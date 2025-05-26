'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return <nav className="hidden" aria-label="Breadcrumb"></nav>;
    }

    const generatePath = (index: number) =>
        "/" + segments.slice(0, index + 1).join("/");

    return (
        <nav
            className=" text-sm text-gray-500 dark:text-white bg-transparent backdrop-blur-md px-4 py-2 rounded-md"
            aria-label="Breadcrumb"
        >
            <ol className="flex items-center space-x-1">
                <li className="flex items-center px-1">
                    <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <Link href="/" className="hover:underline">Inicio</Link>
                </li>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href = generatePath(index);
                    return (
                        <li key={href} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-white mx-1" />
                            {isLast ? (
                                <span className="text-gray-700 dark:text-white capitalize">{decodeURIComponent(segment)}</span>
                            ) : (
                                <Link href={href} className="hover:underline capitalize rounded-md px-1">
                                    {decodeURIComponent(segment)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
