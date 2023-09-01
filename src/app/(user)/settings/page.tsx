import { GetUser } from "@/api/user";
import UserForm from "./_components/form";
import { redirect } from "next/navigation";

export default async function Settings() {
	const user = await GetUser();
	if (!user) redirect("/login");
	return (
		<main className="w-full h-full border-t-2 border-black">
			<UserForm {...user} />
		</main>
	);
}
