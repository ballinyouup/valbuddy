import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GetUser } from "../api/user";

export default async function Navbar() {
    return (
        <nav className="flex flex-row h-fit p-4 bg-secondary w-full justify-between">
            <h4>V</h4>
            <NavProfile />
        </nav>
    );
}

async function NavProfile() {
    const user = await GetUser();
    if (!user) {
        return <Link href="/login">
            <Button>Sign In</Button>
        </Link>;
    }
    return (
        <Avatar>
            <AvatarImage src={user.image_url} alt="@shadcn" />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
    );
}

