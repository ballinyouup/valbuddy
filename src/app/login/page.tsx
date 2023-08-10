import Link from "next/link";

export default function Login() {
	return (
		<div className="flex flex-col gap-4">
			<Link href="http://127.0.0.1:3001/login/discord">Discord</Link>
			<Link href="http://127.0.0.1:3001/login/twitch">Twitch</Link>
		</div>
	);
}
