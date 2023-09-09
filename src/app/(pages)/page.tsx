import { GetDuosPosts, GetTeamsPosts, type Post } from "@/api/post";
import SidebarRight from "./_components/sidebar-right";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
export default async function Home() {
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
						<AccordionTrigger className="flex h-fit items-center p-2 bg-red-900 border-2 border-x-0 border-b-0 border-black duration-0">
							<span className="font-black text-2xl">
								DUOS
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<Duos />
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
							<Teams />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</main>
			<SidebarRight />
		</>
	);
}

async function Duos() {
	const posts = await GetDuosPosts();
	if (!posts) return <>No posts T_T </>;
	return (
		<div className="flex flex-col items-center justify-center">
			{posts.map((post) => (
				<DuosRow key={post.id} post={post} />
			))}
		</div>
	);
}

function DuosRow({ post, key }: { post: Post; key: string }) {
	const roles = JSON.parse(
		Buffer.from(post.player_roles, "base64").toString("utf-8")
	);
	const ranks = JSON.parse(
		Buffer.from(post.player_ranks, "base64").toString("utf-8")
	);

	return (
		<div
			key={key}
			className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800"
		>
			<div className="p-2">
				<div className="h-20 w-20 bg-white" />
			</div>
			<div className="flex flex-col w-full justify-evenly px-4 text-primary-foreground font-medium text-base">
				<div className="flex justify-between uppercase">
					<span>{post.username}</span>
					<div className="flex gap-2">
						{ranks.map(
							(
								rank: string,
								index: number
							) => (
								<span
									key={
										index
									}
								>
									{rank}
								</span>
							)
						)}
					</div>
				</div>
				<div className="flex justify-between uppercase">
					<span>{post.region}</span>
					<span>{post.player_amount}</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">
						{roles.map(
							(
								role: string,
								index: number
							) => (
								<span
									key={
										index
									}
								>
									{role}
								</span>
							)
						)}
					</span>
					<span>
						{post.created_at?.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">
						{post.text}
					</span>
					<span>{post.category}</span>
				</div>
			</div>
		</div>
	);
}

async function Teams() {
	const posts = await GetTeamsPosts();
	if (!posts) return <>No posts T_T </>;
	return (
		<div className="flex flex-col items-center justify-center">
			{posts.map((post) => (
				<TeamsRow key={post.id} post={post} />
			))}
		</div>
	);
}

function TeamsRow({ post, key }: { post: Post; key: string }) {
	const roles = JSON.parse(
		Buffer.from(post.player_roles, "base64").toString("utf-8")
	);
	const ranks = JSON.parse(
		Buffer.from(post.player_ranks, "base64").toString("utf-8")
	);

	return (
		<div
			key={key}
			className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800"
		>
			<div className="p-2">
				<div className="h-20 w-20 bg-white" />
			</div>
			<div className="flex flex-col w-full justify-evenly px-4 text-primary-foreground font-medium text-base">
				<div className="flex justify-between uppercase">
					<span>{post.username}</span>
					<div className="flex gap-2">
						{ranks.map(
							(
								rank: string,
								index: number
							) => (
								<span
									key={
										index
									}
								>
									{rank}
								</span>
							)
						)}
					</div>
				</div>
				<div className="flex justify-between uppercase">
					<span>{post.region}</span>
					<span>{post.player_amount}</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">
						{roles.map(
							(
								role: string,
								index: number
							) => (
								<span
									key={
										index
									}
								>
									{role}
								</span>
							)
						)}
					</span>
					<span>
						{post.created_at?.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">
						{post.text}
					</span>
					<span>{post.category}</span>
				</div>
			</div>
		</div>
	);
}
