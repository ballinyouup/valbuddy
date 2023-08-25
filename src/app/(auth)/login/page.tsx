import SignInToast from "@/app/(pages)/sign-in-toast";
import { config } from "@/env";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import Link from "next/link";
export default function Login({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	return (
		<div className="flex flex-col gap-4 items-center justify-center h-full">
			<SignInToast error={searchParams.error} />
			<Card className="max-w-lg w-full">
				<CardHeader className="space-y-1">
					<CardTitle className="text-5xl text-center font-bold">
						VALBUDDY
					</CardTitle>
					<CardDescription className="text-center text-lg">
						Sign in with a provider
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col w-full gap-4">
					<Link
						href={`${config.API_URL}/login/discord`}
					>
						<Button
							variant="outline"
							className="w-full text-lg font-bold"
						>
							<Icons.discord className="mr-2 h-6 w-6" />
							Discord
						</Button>
					</Link>
					<Link
						href={`${config.API_URL}/login/twitch`}
					>
						<Button
							variant="outline"
							className="w-full text-lg font-bold"
						>
							<Icons.twitch className="mr-2 h-6 w-6" />
							Twitch
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
