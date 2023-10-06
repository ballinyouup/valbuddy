import "../globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import Sidebar from "./_components/sidebar";
import 'cal-sans';

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
        <html lang="en" suppressHydrationWarning>
            <body className="h-screen w-screen">
                <Providers>
                    <div className="flex h-full w-full items-start justify-center">
                        <Sidebar />
                        <div className="h-full w-full">{children}</div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
