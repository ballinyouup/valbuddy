"use client";

import { User, UpdateUser } from "@/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

//TODO: Add change email functionality. Requires change to auth flow.
export default function UserForm(user: User) {
	return (
		<form className="flex flex-col" action={UpdateUser}>
			<div className="flex gap-2">
				<span>{user.email}</span>
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
					<AvatarFallback>
						<Skeleton className="h-10 w-10" />
					</AvatarFallback>
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
