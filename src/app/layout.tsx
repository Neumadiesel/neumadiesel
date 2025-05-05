import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { Suspense } from "react";
import LoadingSkeleton from "./Loading";
import { AuthProvider } from "@/contexts/AuthContext";
import Breadcrumb from "@/components/layout/BreadCrumb";
// import Footer from "@/components/layout/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Neumadisesel",
    description: "Neumadisesel",
    icons: "/icon.png",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-[#212121] antialiased grid grid-cols-1 lg:flex`}
            >
                <AuthProvider>
                    <aside className="">
                        <NavBar />
                    </aside>
                    <main className="w-[100%]  lg:w-full xl:w-full h-[100%] lg:h-screen overflow-y-scroll ">
                        <Suspense fallback={<LoadingSkeleton />}>
                            {children}
                        </Suspense>
                    </main>
                </AuthProvider>
                {/* <Footer /> */}
            </body>
        </html>
    );
}
