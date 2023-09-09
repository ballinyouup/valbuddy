"use server";
import { cookies } from "next/headers";
import { config } from "@/env";
import { z } from "zod";
import { revalidateTag } from "next/cache";
// Schema/Input validation
const postSchema = z.object({
	username: z.string().min(1),
	category: z.string().min(1),
	text: z.string().min(1),
	amount: z.number().min(1),
	roles: z.array(z.string()),
	ranks: z.array(z.string()),
	region: z.string().min(1)
});
export type FormPost = z.infer<typeof postSchema>;

export async function CreatePost(formData: FormData) {
	const session = cookies().get("session_id");
	if (!session) {
		return undefined;
	}
	const post: FormPost = {
		username: String(formData.get("username")),
		category: String(formData.get("category")),
		text: String(formData.get("text")),
		amount: Number(formData.get("amount")),
		roles: Array.from(formData.getAll("roles")).map((entry) =>
			String(entry)
		),
		ranks: Array.from(formData.getAll("ranks")).map((entry) =>
			String(entry)
		),
		region: String(formData.get("region"))
	};

	if (!postSchema.safeParse(post).success) {
		console.log("Error");
		throw new Error("Error Parsing Post into PostSchema");
	}

	try {
		await fetch(`${config.API_URL}/user/post/new`, {
			credentials: "include",
			headers: {
				Cookie: cookies().toString(),
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(post),
		});
	} catch (error) {
		console.error("Error submitting create post form:", error);
	} finally {
		switch (post.category.toLowerCase()) {
			case "duos":
				revalidateTag("duos");
			case "teams":
				revalidateTag("teams");
			case "scrims":
				revalidateTag("scrims");
			default:
				revalidateTag("posts");
		}


	}
}

export interface Post {
	id: string;
	user_id: string;
	username: string;
	image_url: string;
	region: string;
	category: string;
	text: string;
	player_amount: number;
	player_roles: string;
	player_ranks: string;
	created_at: string;
	updated_at: string;
}

export async function GetDuosPosts() {
	try {
		const data = await fetch(`${config.API_URL}/posts/duos`, {
			method: "GET",
			credentials: "omit",
			headers: {
				"Content-Type": "application/json"
			},
			cache: "no-cache",
			next: {
				tags: ["posts", "duos"]
			}
		});
		if (!data.ok) {
			throw new Error("Fetch request failed");
		}
		const post = (await data.json()) as Post[];
		return post;
	} catch (error) {
		console.error("Error Getting all Posts: ", error);
	}
}

export async function GetTeamsPosts() {
	try {
		const data = await fetch(`${config.API_URL}/posts/teams`, {
			method: "GET",
			credentials: "omit",
			headers: {
				"Content-Type": "application/json"
			},
			cache: "no-cache",
			next: {
				tags: ["posts", "teams"]
			}
		});
		if (!data.ok) {
			throw new Error("Fetch request failed");
		}
		const post = (await data.json()) as Post[];
		return post;
	} catch (error) {
		console.error("Error Getting all Posts: ", error);
	}
}
