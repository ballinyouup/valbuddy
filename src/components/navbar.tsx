import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GetUser } from "../api/user";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "./logout";

export default async function Navbar() {
	return (
		<nav className="flex flex-row h-fit p-4 bg-secondary w-full justify-between">
			<h4>V</h4>
			<NavProfile />
		</nav>
	);
}

async function NavProfile() {
	const user = await GetUser();
	if (!user) {
		return (
			<Link href="/login">
				<Button>Sign In</Button>
			</Link>
		);
	}
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar className="border-[1.5px] border-transparent hover:border-secondary-foreground hover:cursor-pointer">
					<AvatarImage src={user.image_url} alt={user.username} />
					<AvatarFallback>{user.username[0]}</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="flex justify-end">
				<LogoutButton>Logout</LogoutButton>
			</PopoverContent>
		</Popover>
	);
}
