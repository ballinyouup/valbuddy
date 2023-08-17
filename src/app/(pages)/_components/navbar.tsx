import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GetUser } from "../../../api/user";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "./logout";
import { ModeToggle } from "./theme-toggle";

export default async function Navbar() {
	return (
		<nav className="flex flex-row h-fit p-4 bg-secondary w-full justify-between">
			<h4>V</h4>
			<div className="flex items-center gap-2">
				<ModeToggle />
				<NavProfile />
			</div>
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
				<Avatar>
					<AvatarImage src={user.image_url} alt={user.username} />
					<AvatarFallback>{user.username[0]}</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="flex flex-col justify-end gap-2">
				<Link href="/profile">
					<Button className="w-full" variant={"secondary"}>
						Profile
					</Button>
				</Link>
				<Link href="/settings">
					<Button className="w-full" variant={"secondary"}>
						Settings
					</Button>
				</Link>
				<LogoutButton>Logout</LogoutButton>
			</PopoverContent>
		</Popover>
	);
}
