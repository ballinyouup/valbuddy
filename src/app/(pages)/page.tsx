export default async function Home() {
	return (
		<div className="w-[820px] h-[936px] flex-col justify-start items-start gap-2 inline-flex">
			<div className="w-full px-4 py-2 bg-neutral-700 justify-end items-center gap-4 inline-flex">
				<div className="w-6 h-6 relative" />
				<div className="w-6 h-6 relative" />
			</div>
			<div className="self-stretch h-[888px] bg-neutral-700 flex-col justify-start items-start flex">
				<TitleRow />
				<UserRow
					age="1m"
					rank="Ascendant"
					rating="4.7/5"
					region="NA"
					role="Smokes"
					username="Player #1"
				/>
			</div>
		</div>
	);
}

function TitleRow() {
	return (
		<div className="self-stretch h-[30px] bg-neutral-800 border-b border-black border-opacity-30 justify-start items-center inline-flex">
			<div className="w-16 self-stretch px-2 border-r border-black border-opacity-20" />
			<div className="w-[260px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">
					USERNAME
				</div>
			</div>
			<div className="w-[94px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">REGION</div>
			</div>
			<div className="w-[120px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">RANK</div>
			</div>
			<div className="w-[90px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">RATING</div>
			</div>
			<div className="w-[103px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">ROLE</div>
			</div>
			<div className="w-[73px] self-stretch px-4 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">TIME</div>
			</div>
		</div>
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
		<div className="self-stretch h-[66px] bg-neutral-800 border-b border-black border-opacity-30 justify-start items-center inline-flex">
			<div className="w-16 self-stretch px-2 border-r border-black border-opacity-20 justify-center items-center flex">
				<div className="w-12 h-12 bg-zinc-300 rounded-full" />
			</div>
			<div className="w-[260px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">
					{username}
				</div>
			</div>
			<div className="w-[94px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">
					{region}
				</div>
			</div>
			<div className="w-[120px] self-stretch px-2 border-r border-black border-opacity-20 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">{rank}</div>
			</div>
			<div className="w-[90px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">
					{rating}
				</div>
			</div>
			<div className="w-[103px] self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">{role}</div>
			</div>
			<div className="grow shrink basis-0 self-stretch px-2 justify-center items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">{age}</div>
			</div>
		</div>
	);
}
