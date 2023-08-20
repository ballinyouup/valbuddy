import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
export default function SidebarLeft() {
	return (
		<div className="w-fit h-[936px] px-8 py-3 bg-zinc-900 flex-col border-2 border-black justify-start items-start gap-3 hidden lg:inline-flex">
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.users />
					<span>DUO</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.swords />
					<span>SCRIMS</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.gamepad />
					<span>TEAM</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.bookUp />
					<span>COACHES</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.clapperBoard />
					<span>CLIPS</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={'ghost'}
				asChild
			>
				<Link href="/duo">
					<Icons.calendarSearch />
					<span>EVENTS</span>
				</Link>
			</Button>
		</div>
	);
}
