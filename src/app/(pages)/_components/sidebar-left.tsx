import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import SheetForm from "./sheet-form";
import { GetAccount } from "@/api/account";
export default async function SidebarLeft() {
	const account = await GetAccount();
	return (
		<div className="hidden h-[936px] w-fit flex-col items-start justify-start gap-0 border-2 border-black bg-zinc-900 px-8 py-3 md:inline-flex">
			{account ? <SheetForm account={account} /> : null}
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/duos">
					<Icons.users />
					<span>DUOS</span>
				</Link>
			</Button>
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/scrims">
					<Icons.swords />
					<span>SCRIMS</span>
				</Link>
			</Button>
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/teams">
					<Icons.gamepad />
					<span>TEAM</span>
				</Link>
			</Button>
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/coaches">
					<Icons.bookUp />
					<span>COACHES</span>
				</Link>
			</Button>
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/clips">
					<Icons.clapperBoard />
					<span>CLIPS</span>
				</Link>
			</Button>
			<Button
				className="h-16 w-full items-center justify-start gap-2 p-6 text-xl font-black uppercase text-white"
				variant={"ghost"}
				asChild
			>
				<Link href="/events">
					<Icons.calendarSearch />
					<span>EVENTS</span>
				</Link>
			</Button>
		</div>
	);
}
