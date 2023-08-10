import Link from "next/link";
import { config } from "@/env";
export default function Login() {
	return (
		<div className="flex flex-col gap-4">
			<Link href={`${config.API_URL}/login/discord`}>Discord</Link>
			<Link href={`${config.API_URL}/login/twitch`}>Twitch</Link>
		</div>
	);
}
