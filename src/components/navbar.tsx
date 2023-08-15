import Link from "next/link";
import { cookies } from "next/headers";
import { config } from "@/env";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
interface User {
	user_id: string;
	email: string;
	username: string;
	role: string;
	image_url: string;
	provider: string;
	created_at: Date;
	updated_at: Date;
}

export default async function Navbar() {
	return (
		<nav className="flex flex-row h-fit p-4 bg-secondary w-full justify-between">
            <h4>V</h4>
			<NavProfile />
		</nav>
	);
}

async function NavProfile() {
	const session = cookies().get("session_id");
	if (session === undefined) {
		return (
			<Link href="/login">
				<Button>Sign In</Button>
			</Link>
		);
	}
	const data = await fetch(`${config.API_URL}/user`, {
		credentials: "include",
		method: "GET",
		headers: { Cookie: cookies().toString() },
		cache: "force-cache",
		next: {
			tags: ["user"],
		},
	});
	const user = (await data.json()) as User;
	return (
		<Avatar>
			<AvatarImage src={user.image_url} alt="@shadcn" />
			<AvatarFallback>{user.username[0]}</AvatarFallback>
		</Avatar>
	);
}
