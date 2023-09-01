"use client";

import { User, UpdateUser } from "@/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";

//TODO: Add change email functionality. Requires change to auth flow.
//TODO: Add on image hover, edit icon, upload image modal
//TODO: Add useOptimistic/useFormStatus
export default function UserForm(user: User) {
	const [toggleEdit, setToggleEdit] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await UpdateUser(formData);
		setToggleEdit(false);
	}

	function handleEdit(e: React.MouseEvent) {
		e.preventDefault();
		setToggleEdit(true);
	}
	return (
		<form
			className="flex flex-col p-4 gap-2 bg-secondary"
			onSubmit={handleSubmit}
		>
			<div className="flex pb-4 justify-between">
				<div className="flex flex-col">
					<h4>SETTINGS</h4>
					<span className="text-muted-foreground">
						Manage your user settings
					</span>
				</div>
				{toggleEdit === false ? (
					<Button
						className="font-black text-lg tracking-wide w-fit uppercase rounded-none"
						variant={"destructive"}
						type="button"
						onClick={handleEdit}
					>
						Edit
					</Button>
				) : (
					<div className="flex gap-1">
						<Button
							className="font-black text-lg tracking-wide w-fit uppercase rounded-none"
							variant={"destructive"}
							type="button"
							onClick={() =>
								setToggleEdit(
									false
								)
							}
						>
							X
						</Button>
						<Button
							className="font-black text-lg tracking-wide w-fit uppercase rounded-none"
							type="submit"
							variant={"destructive"}
						>
							Save
						</Button>
					</div>
				)}
			</div>
			<div className="flex gap-4 flex-col">
				<h6 className="border-b border-foreground/10 pb-2 tracking-wide">
					PROFILE IMAGE
				</h6>
				<div className="w-fit py-4 flex gap-3">
					<Avatar className="rounded-none w-12 h-12">
						<AvatarImage
							src={user.image_url}
							alt={user.username}
							className="w-12 h-12"
						/>
						<AvatarFallback>
							<Skeleton className="h-10 w-10" />
						</AvatarFallback>
					</Avatar>
					{toggleEdit ? (
						<input type="file" />
					) : null}
				</div>
			</div>
			<div className="flex gap-2 w-full flex-col">
				<h5 className="border-b border-foreground/10 pb-2 tracking-wide">
					EMAIL
				</h5>
				<div className="py-4">
					<span className="text-md tracking-wide uppercase">
						{user.email}
					</span>
				</div>
			</div>
			<div className="flex gap-2 flex-col">
				<h5 className="border-b border-foreground/10 pb-2 tracking-wide">
					USERNAME
				</h5>
				<span className="text-lg tracking-wide uppercase py-4">
					{user.username}
				</span>
			</div>
			<div className="flex flex-col gap-2">
				<h5 className="border-b border-foreground/10 pb-2 tracking-wide">
					MESSAGES
				</h5>
				<div className="flex py-4 gap-4 items-center">
					<span className="text-lg tracking-wide uppercase ">
						ALLOW MESSAGES FROM
					</span>
					{toggleEdit ? (
						<Select defaultValue="all">
							<SelectTrigger className="w-fit h-fit p-2 rounded-none">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="rounded-none">
								<SelectGroup>
									<SelectItem
										className="rounded-none"
										value="all"
									>
										ALL
									</SelectItem>
									<SelectItem
										className="rounded-none"
										value="friends"
									>
										FRIENDS
									</SelectItem>
									<SelectItem
										className="rounded-none"
										value="nobody"
									>
										NOBODY
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					) : (
						<span className="p-2 bg-background">
							ALL
						</span>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<h5 className="border-b border-foreground/10 pb-2 tracking-wide">
					DELETE YOUR ACCOUNT
				</h5>
				<div className="py-4">
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								className="font-black text-lg tracking-wide w-fit uppercase rounded-none"
							>
								DELETE ACCOUNT
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you
									absolutely
									sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This
									action
									cannot
									be
									undone.
									This
									will
									permanently
									delete
									your
									account
									and
									remove
									your
									data
									from our
									servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</form>
	);
}
