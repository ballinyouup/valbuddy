"use client";
import { config } from "@/env";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton({
	children
}: {
	children?: React.ReactNode;
}) {
	const router = useRouter();
	async function Logout() {
		const data = await fetch(`${config.API_URL}/logout`, {
			credentials: "include",
			method: "GET"
		});
		if (data.ok) {
			router.refresh();
		}
	}

	return (
		<Button onClick={() => Logout()} className="w-full">
			{children}
		</Button>
	);
}
