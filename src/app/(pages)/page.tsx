import SidebarRight from "./_components/sidebar-right";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
export default async function Home() {
	const users: UserData[] = [
		{
			username: "player #1",
			rank: "bronze",
			region: "na",
			rating: "4/5",
			role: "smokes",
			age: "1m"
		}
	];
	return (
		<>
			<main className="h-full w-full">
				<Accordion
					type="multiple"
					defaultValue={["duos", "teams"]}
				>
					<AccordionItem
						value="duos"
						className="border-0"
					>
						<AccordionTrigger
							className="flex h-fit justify-between items-center p-2 bg-red-900 border-2 border-x-0 border-b-0 border-black duration-0"
							icon
						>
							<span className="font-black text-2xl">
								DUOS
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="flex flex-col items-center justify-center">
								<UserRow
									{...users[0]}
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value="teams"
						className="border-0"
					>
						<AccordionTrigger
							className="flex h-fit justify-between items-center p-2 bg-red-900 border-2 border-x-0 border-b-0 border-black duration-0"
							icon
						>
							<span className="font-black text-2xl">
								TEAMS
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="flex flex-col items-center justify-center">
								<UserRow
									{...users[0]}
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</main>
			<SidebarRight />
		</>
	);
}

interface UserData {
	username: string;
	rank: string;
	region: string;
	rating: string;
	role: string;
	age: string;
}

function UserRow(user: UserData) {
	const { username, rank, region, rating, role, age } = user;
	return (
		<div className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800">
			<div className="p-2">
				<div className="h-20 w-20 bg-white" />
			</div>
			<div className="flex flex-col w-full justify-evenly px-4 text-primary-foreground font-black text-lg">
				<div className="flex justify-between uppercase">
					<span>{username}</span>
					<span>{rank}</span>
				</div>
				<div className="flex justify-between uppercase">
					<span>{region}</span>
					<span>{rating}</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">
						{role}
					</span>
					<span>{age}</span>
				</div>
			</div>
		</div>
	);
}
