"use client";
import { config } from "@/env";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInForm() {
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	
	useEffect(() => {
		if(error){
			toast({
				title: error,
				description: "Please Log in with Another Provider",
				variant: "destructive"
			});
		}
	}, []); // Empty dependency array means this effect runs only on mount

	return (
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
				<Link href={`${config.API_URL}/login/discord`}>
					<Button variant="outline" className="w-full text-lg font-bold">
						<Icons.discord className="mr-2 h-6 w-6" />
						Discord
					</Button>
				</Link>
				<Link href={`${config.API_URL}/login/twitch`}>
					<Button variant="outline" className="w-full text-lg font-bold">
						<Icons.twitch className="mr-2 h-6 w-6" />
						Twitch
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
