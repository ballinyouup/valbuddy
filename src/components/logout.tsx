"use client";
import { config } from "@/env";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "./ui/use-toast";
export default function LogoutButton({
	children
}: {
	children?: React.ReactNode;
}) {
	const router = useRouter();
	const currentPath = usePathname();
	async function Logout(currentPath: string) {
		try {
			const data = await fetch(`${config.API_URL}/logout`, {
				credentials: "include",
				method: "GET",
				cache: "no-store",
				mode: "no-cors"
			});
			if (!data.ok) {
				throw new Error("Error logging out");
			}
			currentPath === "/"
				? router.refresh()
				: router.push("/");
				
		} catch (error) {
			toast({
				title: "Error signing out",
				description: JSON.stringify(error),
				variant: "destructive"
			});
		}
	}

	return (
		<Button
			onClick={() => Logout(currentPath)}
			className="w-full rounded-none font-black text-lg uppercase tracking-wide"
		>
			{children}
		</Button>
	);
}
