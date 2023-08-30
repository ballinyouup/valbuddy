import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
export default function SidebarLeft() {
	return (
		<div className="w-fit h-[936px] px-8 py-3 bg-zinc-900 flex-col border-2 border-black justify-start items-start gap-3 hidden md:inline-flex">
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={"ghost"}
				asChild
			>
				<Link href="/profile">
					<Icons.users />
					<span>Profile</span>
				</Link>
			</Button>
			<Button
				className="text-white text-xl items-center justify-start font-black uppercase p-6 gap-2"
				variant={"ghost"}
				asChild
			>
				<Link href="/settings">
					<Icons.swords />
					<span>Settings</span>
				</Link>
			</Button>
		</div>
	);
}
