import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import SheetForm from "./sheet-form";
import { GetUser } from "@/api/user";
export default async function SidebarLeft() {
	const user = await GetUser();
	return (
		<div className="w-fit h-[936px] px-8 py-3 bg-zinc-900 flex-col border-2 border-black justify-start items-start gap-0 hidden md:inline-flex">
			{user ? <SheetForm /> : null}
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
				variant={"ghost"}
				asChild
			>
				<Link href="/duos">
					<Icons.users />
					<span>DUOS</span>
				</Link>
			</Button>
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
				variant={"ghost"}
				asChild
			>
				<Link href="/scrims">
					<Icons.swords />
					<span>SCRIMS</span>
				</Link>
			</Button>
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
				variant={"ghost"}
				asChild
			>
				<Link href="/teams">
					<Icons.gamepad />
					<span>TEAM</span>
				</Link>
			</Button>
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
				variant={"ghost"}
				asChild
			>
				<Link href="/coaches">
					<Icons.bookUp />
					<span>COACHES</span>
				</Link>
			</Button>
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
				variant={"ghost"}
				asChild
			>
				<Link href="/clips">
					<Icons.clapperBoard />
					<span>CLIPS</span>
				</Link>
			</Button>
			<Button
				className="text-white h-16 text-xl items-center justify-start font-black uppercase p-6 gap-2 w-full"
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
