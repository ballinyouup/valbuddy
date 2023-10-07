import "../globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";

const cal = localFont({
    src: "../cal-sans.woff2",
    variable: "--font-cal",
    display: "swap"
});

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap"
});

export const metadata: Metadata = {
    title: "VALBuddy",
    description: "Find Val Friends"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${cal.variable} ${roboto.variable}`}
        >
            <body className="h-full w-screen">
                <Providers>
                    <div className="flex w-full justify-center">
                        <div className="flex w-full max-w-desktop flex-col items-start justify-between">
                            <Navbar />
                            {children}
                            <Footer />
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
