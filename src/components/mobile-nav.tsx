import { GetUser } from "@/api/user";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import SheetForm from "@/app/(pages)/_components/sheet-form";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
export default async function MobileNav() {
	const user = await GetUser();
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
					{user ? (
						<DropdownMenuItem asChild>
							{<SheetForm mobile />}
						</DropdownMenuItem>
					) : null}
					<DropdownMenuItem
						className="rounded-none"
						asChild
					>
						<Link href="/duos">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.users />
								<span>
									Duos
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/teams">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.gamepad />
								<span>
									Teams
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/scrims">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.swords />
								<span>
									Scrims
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/events">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.calendarSearch />
								<span>
									Events
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/coaches">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.bookUp />
								<span>
									Coaches
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/communities">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.bookUp />
								<span>
									Communities
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className="rounded-none"
					>
						<Link href="/clips">
							<Button
								className="text-white w-full h-fit text-xl items-center justify-start font-black uppercase gap-2 p-0"
								variant={
									"ghost"
								}
							>
								<Icons.clapperBoard />
								<span>
									Clips
								</span>
							</Button>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
