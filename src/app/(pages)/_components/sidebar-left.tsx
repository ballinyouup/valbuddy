import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SidebarLeft() {
	return (
		<div className="sm:w-[199px] 2xl:w-56 h-[936px] px-8 py-3 bg-zinc-900 flex-col justify-start items-start gap-3 hidden lg:inline-flex">
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/duo">DUO</Link>
			</Button>
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/scrims">Scrims</Link>
			</Button>
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/team">Team</Link>
			</Button>
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/coaches">Coaches</Link>
			</Button>
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/clips">Clips</Link>
			</Button>
			<Button
				className="text-white text-xl justify-start font-semibold uppercase p-6"
				variant={"ghost"}
				asChild
			>
				<Link href="/events">Events</Link>
			</Button>
		</div>
	);
}
