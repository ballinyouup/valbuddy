import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/(pages)/_components/providers';
import Navbar from '@/app/(pages)/_components/navbar';
import SidebarLeft from './_components/sidebar-left';
import SidebarRight from './_components/sidebar-right';
import Messages from './_components/messages';
import MobileNav from './_components/mobile-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'VALBuddy',
	description: 'Find Val Friends'
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
						<SidebarRight />
						<Messages />
						<MobileNav />
					</div>
				</Providers>
			</body>
		</html>
	);
}
