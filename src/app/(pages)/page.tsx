export default async function Home() {
  return (
    <main className="w-full md:w-fit">
      <div className="hidden h-[936px] w-full lg:w-[820px] flex-col items-start justify-start lg:gap-2 md:inline-flex">
        <div className="inline-flex w-full items-center justify-end gap-4 bg-neutral-700 px-4 py-2">
          <div className="relative h-6 w-6" />
          <div className="relative h-6 w-6" />
        </div>
        <div className="flex h-[888px] flex-col items-start justify-start self-stretch bg-neutral-700">
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
      <div className="inline-flex h-[846px] w-full flex-col items-start justify-start md:hidden">
        <div className="inline-flex items-center justify-end gap-4 self-stretch bg-neutral-700 px-4 py-2">
          <div className="relative h-6 w-6" />
          <div className="relative h-6 w-6" />
        </div>
        <div className="flex h-[891px] flex-col items-start justify-start self-stretch bg-neutral-700">
          <MobileUserRow
            age="1m"
            rank="Ascendant"
            rating="4.7/5"
            region="NA"
            role="Smokes"
            username="Player #1"
          />
        </div>
      </div>
    </main>
  );
}

function TitleRow() {
  return (
    <div className="inline-flex h-[30px] items-center justify-start self-stretch border-b border-black border-opacity-30 bg-neutral-800">
      <div className="w-16 self-stretch border-r border-black border-opacity-20 px-2" />
      <div className="flex w-[260px] items-center justify-start self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          USERNAME
        </div>
      </div>
      <div className="flex w-[94px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">REGION</div>
      </div>
      <div className="flex w-[120px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">RANK</div>
      </div>
      <div className="flex w-[90px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">RATING</div>
      </div>
      <div className="flex w-[103px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">ROLE</div>
      </div>
      <div className="flex w-[73px] items-center justify-start gap-2 self-stretch px-4">
        <div className="text-base font-black capitalize text-white">TIME</div>
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
    <div className="inline-flex h-[66px] items-center justify-start w-full border-b border-black border-opacity-30 bg-neutral-800">
      <div className="flex w-16 items-center justify-center self-stretch border-r border-black border-opacity-20 px-2">
        <div className="h-12 w-12 rounded-full bg-zinc-300" />
      </div>
      <div className="flex min-w-[200px] w-full max-w-[260px] items-center justify-start self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          {username}
        </div>
      </div>
      <div className="flex w-[94px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          {region}
        </div>
      </div>
      <div className="flex w-[120px] items-center justify-start self-stretch border-r border-black border-opacity-20 px-2">
        <div className="text-base font-black capitalize text-white">{rank}</div>
      </div>
      <div className="flex w-[90px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          {rating}
        </div>
      </div>
      <div className="flex w-[103px] items-center justify-start gap-2 self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">{role}</div>
      </div>
      <div className="flex shrink grow basis-0 items-center justify-center gap-2 self-stretch px-2">
        <div className="text-base font-black capitalize text-white">{age}</div>
      </div>
    </div>
  );
}

function MobileUserRow({
  username,
  rank,
  region,
  rating,
  role,
  age,
}: UserData) {
  return (
    <div className="inline-flex h-[99px] w-full items-center justify-start border-b border-black border-opacity-30 bg-neutral-800">
      <div className="flex w-16 items-center justify-center self-stretch border-r border-black border-opacity-20 px-2">
        <div className="h-12 w-12 rounded-full bg-zinc-300" />
      </div>
      <div className="inline-flex shrink grow basis-0 flex-col items-start justify-between self-stretch border-r border-black border-opacity-20 p-4">
        <div className="inline-flex items-center justify-between self-stretch">
          <div className="text-base font-black capitalize text-white">
            {username}
          </div>
          <div className="text-base font-black capitalize text-white">
            {region}
          </div>
        </div>
        <div className="inline-flex items-center justify-between self-stretch">
          <div className="text-base font-black capitalize text-white">
            {rank}
          </div>
          <div className="text-base font-black capitalize text-white">
            {role}
          </div>
        </div>
        <div className="inline-flex items-start justify-between self-stretch">
          <div className="text-base font-black capitalize text-white">
            {rating}
          </div>
          <div className="text-base font-black capitalize text-white">
            {age}
          </div>
        </div>
      </div>
    </div>
  );
}
