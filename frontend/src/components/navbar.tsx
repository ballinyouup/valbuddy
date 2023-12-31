import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GetAccount } from "../api/account";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import LogoutButton from "./logout";
import { ModeToggle } from "./theme-toggle";
import { Skeleton } from "./ui/skeleton";

export default async function Navbar() {
	return (
		<nav className="w-full h-20 px-8 py-4 bg-red-900 justify-between items-center flex">
			<div className="text-white text-[40px] font-black">
				<Link href="/">V</Link>
			</div>
			<div className="justify-start items-center gap-2 flex">
				<input className="w-56 h-9 rounded-sm relative bg-white border border-black border-opacity-25 text-black p-3 hidden md:flex" />
				{/* {<ModeToggle />} */}
				<NavProfile />
			</div>
		</nav>
	);
}

async function NavProfile() {
	const account = await GetAccount();
	if (!account) {
		return (
			<Link href="/login">
				<Button>Sign In</Button>
			</Link>
		);
	}
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar>
					<AvatarImage
						src={account.image_url}
						alt={account.username}
					/>
					<AvatarFallback>
						<Skeleton className="h-10 w-10" />
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="flex flex-col justify-end gap-2 rounded-none">
				<Link href="/profile">
					<Button
						className="w-full rounded-none font-black text-lg uppercase tracking-wide"
						variant={"secondary"}
					>
						Profile
					</Button>
				</Link>
				<Link href="/settings">
					<Button
						className="w-full rounded-none font-black text-lg uppercase tracking-wide"
						variant={"secondary"}
					>
						Settings
					</Button>
				</Link>
				<LogoutButton>Logout</LogoutButton>
			</PopoverContent>
		</Popover>
	);
}
