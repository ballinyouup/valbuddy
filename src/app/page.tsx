import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const data = await fetch("http://127.0.0.1:3001/hello",{
    credentials: "include",
    method: "GET",
    headers: { Cookie: cookies().toString() },
  })
  if(!data.ok){
    return <Link href="/login">Sign In</Link>
  }
  const res = await data.json() as {message: string}
  return (
    <main className="flex flex-col">
      {"Server: " + res.message}
    </main>
  )
}
