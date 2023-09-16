import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";
import SidebarLeft from "./_components/sidebar-left";
import Messages from "@/components/messages";
import MobileNav from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

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
			<body className={`${inter.className} w-screen h-full`}>
				<Providers>
					<Navbar />
					<div className="flex w-full h-full items-start justify-center">
						<SidebarLeft />
						{children}
						<Messages />
						<MobileNav />
					</div>
				</Providers>
			</body>
		</html>
	);
}
