export default async function Home() {
	return (
		<main className="h-full w-full max-w-5xl border-l-0 border-r-0 border-2 border-black">
			<UserRow
				username="player #1"
				rank="ascendant"
				age="1m"
				rating="5/5"
				region="na"
				role="smokes"
			/>
		</main>
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

function UserRow({ username, rank, region, rating, role, age }: UserData) {
	return (
		<div className="flex h-fit w-full items-center border-black border-opacity-30 bg-neutral-800">
			<div className="p-4">
				<div className="h-12 w-12 rounded-full bg-white" />
			</div>
			<div className="flex flex-col w-full justify-evenly px-4 text-primary-foreground">
				<div className="flex justify-between uppercase">
					<span>{username}</span>
					<span>{rank}</span>
				</div>
				<div className="flex justify-between uppercase">
					<span>{region}</span>
					<span>{rating}</span>
				</div>
				<div className="flex justify-between">
					<span className="uppercase">{role}</span>
					<span>{age}</span>
				</div>
			</div>
		</div>
	);
}
