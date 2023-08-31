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
	const data = await fetch(`${config.API_URL}/user`, {
		credentials: "include",
		method: "GET",
		headers: { Cookie: cookies().toString() },
		cache: "force-cache",
		next: {
			tags: ["user"],
		},
	});
	if (!data.ok) {
		return undefined;
	}
	const user = (await data.json()) as User;
	return user;
}

export async function UpdateUser(formData: FormData) {

	try {
		await fetch(`${config.API_URL}/user/update`, {
			credentials: "include",
			headers: { Cookie: cookies().toString() },
			method: "POST",
			body: formData,
		});
		revalidateTag("user");
	} catch (error) {
		console.error("Error submitting form:", error);
	}
}

