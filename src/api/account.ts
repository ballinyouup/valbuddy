"use server";
import { cookies } from "next/headers";
import { config } from "@/env";
import { revalidateTag } from "next/cache";

export interface Account {
    id: string;
    user_id: string;
    image_url: string;
    username: string;
    rank: string;
    region: string;
    roles: string;
    created_at: string;
    updated_at: string;
}

export async function GetAccount() {
	const session = cookies().get("session_id");
	if (!session) {
		return undefined;
	}
	try {
		const data = await fetch(`${config.API_URL}/user/account`, {
			credentials: "include",
			method: "GET",
			headers: { Cookie: cookies().toString() },
			cache: "force-cache",
			next: {
				tags: [session.value]
			}
		});
		if (!data.ok) {
			throw new Error(
				"Error fetching Account: Bad response from server"
			);
		}
		const account = (await data.json()) as Account;
		return account;
	} catch (error) {
		console.error("Error getting Account:", error);
		return undefined;
	}
}