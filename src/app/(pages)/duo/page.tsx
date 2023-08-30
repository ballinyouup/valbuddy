export default async function Duos() {
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
		<main className="h-full w-full">
			<div className="flex flex-col items-center justify-center">
				<UserRow {...users[0]} />
			</div>
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

function UserRow(user: UserData) {
	const { username, rank, region, rating, role, age } = user
	return (
		<div className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800">
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
					<span className="uppercase">
						{role}
					</span>
					<span>{age}</span>
				</div>
			</div>
		</div>
	);
}