import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import { Suspense } from "react";
import LoadingSkeleton from "./Loading";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-cols-1 lg:flex`}
      >
        <aside className="w-[100%] lg:w-[15%] min-w-[200px]">

          <NavBar />
        </aside>
        <main className="w-[100%]  lg:w-[80%] xl:w-[85%] h-[100%] lg:h-screen overflow-y-scroll ">
          <Suspense fallback={<LoadingSkeleton />}>
            {children}
          </Suspense>
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
