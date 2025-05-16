
import React from 'react';
import { Suspense } from "react";
import FormSkeleton from "./loading";
export default function LayoutIngresarDatos({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="bg-white dark:bg-[#212121] h-full block lg:flex ">
            {/* Navegacion latearl */}
            <Suspense fallback={<FormSkeleton />} >
                <div className="w-[100%]">

                    {children}
                </div>
            </Suspense>
        </div>
    )
}