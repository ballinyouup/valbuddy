import { Button } from "@/components/ui/button";
export default function Navbar() {
    return (
        <div className="z-10 flex w-full justify-between bg-background py-4 pl-8 pr-4 2xl:pr-0">
            <div className="V hidden text-4xl font-black text-white sm:flex">
                VALBUDDY
            </div>
            <div className="V flex text-4xl font-black text-white sm:hidden">
                V
            </div>
            <div className="Frame2 flex items-center justify-center gap-5">
                <Button
                    variant={"ghost"}
                    className="h-full rounded-sm text-base"
                >
                    Sign Up
                </Button>
                <Button
                    variant={"default"}
                    className="h-full rounded-sm text-base"
                >
                    Log In
                </Button>
            </div>
        </div>
    );
}
