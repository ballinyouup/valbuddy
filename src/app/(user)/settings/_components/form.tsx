"use client";

import { User, UpdateUser } from "@/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { useToast } from "@/components/ui/use-toast";
import { config } from "@/env";
import { useRouter } from "next/navigation";

export default function UserForm(user: User) {
	const { toast } = useToast();
	const router = useRouter();

	return (
		<form
			className="flex flex-col"
			action={UpdateUser}
		>
			<div className="flex gap-2">
				<span>{user.email}</span>
				<input
					name="email"
					placeholder="Change Email"
				/>
			</div>
			<div className="flex gap-2">
				<span>{user.username}</span>
				<input
					name="username"
					placeholder="Change username"
				/>
			</div>
			<div className="flex gap-2">
				<Avatar>
					<AvatarImage
						src={user.image_url}
						alt={user.username}
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<input
					name="image"
					placeholder="Change image url"
				/>
			</div>
			<Button className="w-fit" type="submit">
				Save
			</Button>
		</form>
	);
}
