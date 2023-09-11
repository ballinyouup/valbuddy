import {GetAccount} from "@/api/account";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import SheetForm from "@/app/(pages)/_components/sheet-form";
import {Button} from "./ui/button";
import {Icons} from "./ui/icons";
export default async function MobileNav() {
    const account = await GetAccount();
    return (
        <div className="fixed bottom-0 h-fit w-full bg-primary px-2 py-2 md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex w-full items-center justify-center gap-4 text-2xl font-black uppercase [&[data-state=closed]>svg]:rotate-0 [&[data-state=closed]>svg]:transition-all [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:transition-all">
                    <span>Menu</span>
                    <ChevronDown strokeWidth={4} className="h-10 w-10" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={8}
                    align="start"
                    alignOffset={-20}
                    className="flex w-screen flex-col rounded-none md:hidden"
                >
                    {account ? (
                        <DropdownMenuItem asChild>
                            {<SheetForm account={account} mobile />}
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem className="rounded-none" asChild>
                        <Link href="/duos">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.users />
                                <span>Duos</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/teams">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.gamepad />
                                <span>Teams</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/scrims">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.swords />
                                <span>Scrims</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/events">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.calendarSearch />
                                <span>Events</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/coaches">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.bookUp />
                                <span>Coaches</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/communities">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.bookUp />
                                <span>Communities</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-none">
                        <Link href="/clips">
                            <Button
                                className="h-fit w-full items-center justify-start gap-2 p-0 text-xl font-black uppercase text-white"
                                variant={"ghost"}
                            >
                                <Icons.clapperBoard />
                                <span>Clips</span>
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
