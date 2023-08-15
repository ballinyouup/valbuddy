import Link from "next/link";
import { cookies } from "next/headers";
import { config } from "@/env";
import { revalidateTag } from 'next/cache'
interface User{
    user_id: string,
    email: string,
    username: string,
    role: string,
    image_url: string,
    provider: string,
    created_at: Date,
    updated_at: Date
}

export default async function Home() {
	const session = cookies().get("session_id")
	if (session === undefined) {
		return <Link href="/login">Sign In</Link>;
	}
	const data = await fetch(`${config.API_URL}/user`, {
		credentials: "include",
		method: "GET",
		headers: { Cookie:  cookies().toString()},
		next: {
			tags: ["user"]
		}
	});
	const res = await data.json() as User;
	
	return <main className="flex flex-col">{res.username}</main>;
}
