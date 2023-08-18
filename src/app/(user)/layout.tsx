import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/app/(pages)/_components/providers";
import Navbar from "@/app/(pages)/_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} w-screen h-full`}>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
