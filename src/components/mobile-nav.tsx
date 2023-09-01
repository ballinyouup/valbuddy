import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
export default function MobileNav() {
	return (
		<div className="fixed bottom-0 w-full h-fit px-2 py-2 bg-primary md:hidden">
			<DropdownMenu>
				<DropdownMenuTrigger className="w-full flex items-center justify-center gap-4 font-black text-2xl uppercase [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:transition-all [&[data-state=closed]>svg]:rotate-0 [&[data-state=closed]>svg]:transition-all">
					<span>Menu</span>
					<ChevronDown
						strokeWidth={4}
						className="w-10 h-10"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					sideOffset={8}
					align="start"
					alignOffset={-20}
					className="w-screen md:hidden flex flex-col rounded-none"
				>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/duo">Duos</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/teams">Teams</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/scrims">
							Scrims
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/events">
							Events
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/events">
							Coaches
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/communities">
							Communities
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="text-lg font-extrabold uppercase rounded-none"
					>
						<Link href="/clips">Clips</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
