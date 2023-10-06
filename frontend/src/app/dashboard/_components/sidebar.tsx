import { Account, GetAccount } from "@/api/account";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenSquare, Search, MailPlus, Sword, Hash, Cog } from "lucide-react";

const SVG_SIZES = {
    width: 32,
    height: 32
};

export default async function Sidebar() {
    const account = await GetAccount();

    return (
        <div className="flex h-full w-fit flex-col gap-8 bg-background px-12 py-8 text-white">
            <Link href={"/"}>
                <h4>VALBUDDY</h4>
            </Link>
            <div className="flex w-fit flex-col gap-4">
                <ProfileButton account={account} />
                <PostButton account={account} />
                <SidebarButton href="#">
                    <Search {...SVG_SIZES} />
                    <h5>Search</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <Icons.users {...SVG_SIZES} />
                    <h5>Duos</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <MailPlus {...SVG_SIZES} />
                    <h5>Teams</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <Sword {...SVG_SIZES} />
                    <h5>Scrims</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <Icons.calendarSearch {...SVG_SIZES} />
                    <h5>Events</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <Hash {...SVG_SIZES} />
                    <h5>Comm</h5>
                </SidebarButton>
                <SidebarButton href="#">
                    <Cog {...SVG_SIZES} />
                    <h5>Settings</h5>
                </SidebarButton>
            </div>
        </div>
    );
}

function SidebarButton({
    children,
    href
}: {
    children?: React.ReactNode;
    href: string;
}) {
    return (
        <Button
            asChild
            variant={"ghost"}
            className="flex h-fit w-full items-start justify-start gap-4 hover:bg-destructive"
        >
            <Link href={href}>{children}</Link>
        </Button>
    );
}

function ProfileButton({ account }: { account: Account | undefined }) {
    if (!account) return <SidebarButton href="/login">Sign In</SidebarButton>;
    return (
        <SidebarButton href="#">
            <Image
                src={account.image_url}
                alt={account.username}
                {...SVG_SIZES}
                className="rounded-full"
            />
            <h5>Profile</h5>
        </SidebarButton>
    );
}

function PostButton({ account }: { account: Account | undefined }) {
    if (!account) return null;
    return (
        <SidebarButton href="#">
            <PenSquare {...SVG_SIZES} />
            <h5>Post</h5>
        </SidebarButton>
    );
}
