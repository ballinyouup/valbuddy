import { Button } from "@/components/ui/button";
export default function Navbar() {
    return (
        <div className="flex w-full justify-between bg-background pl-8 pr-4 2xl:pr-0 py-4 z-10">
            <div className="V hidden text-4xl font-black text-white sm:flex">
                VALBUDDY
            </div>
            <div className="V flex text-4xl font-black text-white sm:hidden">
                V
            </div>
            <div className="Frame2 flex items-center justify-center gap-5">
                <Button variant={"ghost"} className="h-fit rounded-sm">
                    <p className="SignUp text-lg font-medium text-white">
                        Sign Up
                    </p>
                </Button>
                <Button variant={"default"} className="h-fit rounded-sm">
                    <p className="LogIn text-lg font-bold text-white">Log In</p>
                </Button>
            </div>
        </div>
    );
}
