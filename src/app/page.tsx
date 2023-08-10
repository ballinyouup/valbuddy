import Link from "next/link";
import { cookies } from "next/headers";
import { config } from "@/env";
export default async function Home() {
	const data = await fetch(`${config.API_URL}/hello`, {
		credentials: "include",
		method: "GET",
		headers: { Cookie: cookies().toString() },
	});
	if (!data.ok) {
		return <Link href="/login">Sign In</Link>;
	}
	const res = (await data.json()) as { message: string };
	return <main className="flex flex-col">{"Server: " + res.message}</main>;
}
