
import React from 'react';
import { Suspense } from "react";
import FormSkeleton from "./loading";
export default function LayoutIngresarDatos({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="bg-white dark:bg-[#212121]  block lg:flex  lg:m-4 rounded-md shadow-xl">
            {/* Navegacion latearl */}
            <Suspense fallback={<FormSkeleton />} >
                <div className="p-3 w-[100%]">

                    {children}
                </div>
            </Suspense>
        </div>
    )
}