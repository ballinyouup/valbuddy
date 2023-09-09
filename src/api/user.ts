"use server";
import { cookies } from "next/headers";
import { config } from "@/env";
import { revalidateTag } from "next/cache";

export interface User {
	user_id: string;
	email: string;
	username: string;
	role: string;
	image_url: string;
	provider: string;
	created_at: Date;
	updated_at: Date;
}
export async function GetUser() {
	const session = cookies().get("session_id");
	if (!session) {
		return undefined;
	}
	try {
		const data = await fetch(`${config.API_URL}/user`, {
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
				"Error fetching User: Bad response from server"
			);
		}
		const user = (await data.json()) as User;
		return user;
	} catch (error) {
		console.error("Error getting user:", error);
		return undefined;
	}
}

export async function UpdateUser(formData: FormData) {
	const session = cookies().get("session_id");
	if (!session) {
		return false;
	}
	try {
		const res = await fetch(`${config.API_URL}/user/update`, {
			credentials: "include",
			headers: {
				Cookie: cookies().toString(),
			},
			cache: "no-store",
			method: "POST",
			body: formData,
			mode: "no-cors"
		});
		if(!res.ok){
			throw new Error("Error updating user")
		}
		revalidateTag(session.value);
		return true
	} catch (error) {
		console.error("Error submitting form:", error);
		return false
	}
}
