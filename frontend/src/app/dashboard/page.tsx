import { GetDuosPosts, GetTeamsPosts, type Post } from "@/api/post";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Suspense } from "react";
import { parseJSON } from "@/lib/utils";
export default async function Home() {
  return (
    <>
      <main className="h-full w-full">
        <Accordion type="multiple" defaultValue={["duos", "teams"]}>
          <AccordionItem value="duos" className="border-0">
            <AccordionTrigger className="flex h-fit items-center border-2 border-x-0 border-b-0 border-black bg-red-900 p-2 duration-0">
              <span className="text-2xl font-black">DUOS</span>
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<>Loading...</>}>
                <Duos />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="teams" className="border-0">
            <AccordionTrigger className="flex h-fit items-center justify-between border-2 border-x-0 border-b-0 border-black bg-red-900 p-2 duration-0">
              <span className="text-2xl font-black">TEAMS</span>
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<>Loading...</>}>
                <Teams />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </>
  );
}

async function Duos() {
  const posts = await GetDuosPosts();
  if (!posts) return <>No posts T_T </>;
  return (
    <div className="mt-0.5 flex flex-col items-center justify-center gap-0.5">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800"
        >
          <DuosRow post={post} />
        </div>
      ))}
    </div>
  );
}
function DuosRow({ post }: { post: Post }) {
  const roles = parseJSON(post.roles);
  const ranks = parseJSON(post.ranks);
  const created_at = new Date(Date.parse(post.created_at))
    .toLocaleString()
    .split(" ");
  const date = created_at[0].split(",")[0];
  const time = created_at[1];
  return (
    <>
      <div className="p-2">
        <Avatar className="h-20 w-20 rounded-none">
          <AvatarImage src={post.image_url} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <div className="flex w-full flex-col justify-evenly px-4 text-base font-medium text-primary-foreground">
        <div className="flex justify-between uppercase">
          <span>{post.username}</span>
          <div className="flex gap-2">
            {ranks.map((rank: string, index: number) => (
              <span key={index}>{rank}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-between uppercase">
          <span>{post.region}</span>
          <span>{post.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase">
            {roles.map((role: string, index: number) => (
              <span key={index}>{role}</span>
            ))}
          </span>
          <div className="flex flex-col items-end">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="uppercase">{post.text}</span>
          <span>{post.category}</span>
        </div>
      </div>
    </>
  );
}

async function Teams() {
  const posts = await GetTeamsPosts();
  if (!posts) return <>No posts T_T </>;
  return (
    <div className="mt-0.5 flex flex-col items-center justify-center gap-0.5">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex h-fit w-full max-w-7xl items-center border-black border-opacity-30 bg-neutral-800"
        >
          <TeamsRow post={post} />
        </div>
      ))}
    </div>
  );
}

function TeamsRow({ post }: { post: Post }) {
  const roles = parseJSON(post.roles);
  const ranks = parseJSON(post.ranks);
  const created_at = new Date(Date.parse(post.created_at))
    .toLocaleString()
    .split(" ");
  const date = created_at[0].split(",")[0];
  const time = created_at[1];
  return (
    <>
      <div className="p-2">
        <Avatar className="h-20 w-20 rounded-none">
          <AvatarImage src={post.image_url} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <div className="flex w-full flex-col justify-evenly px-4 text-base font-medium text-primary-foreground">
        <div className="flex justify-between uppercase">
          <span>{post.username}</span>
          <div className="flex gap-2">
            {ranks.map((rank: string, index: number) => (
              <span key={index}>{rank}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-between uppercase">
          <span>{post.region}</span>
          <span>{post.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase">
            {roles.map((role: string, index: number) => (
              <span key={index}>{role}</span>
            ))}
          </span>
          <div className="flex flex-col items-end">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="uppercase">{post.text}</span>
          <span>{post.category}</span>
        </div>
      </div>
    </>
  );
}
