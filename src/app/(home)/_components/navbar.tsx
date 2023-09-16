import { Button } from "@/components/ui/button";
export default function Navbar() {
  return (
    <div className="flex w-full justify-between">
      <div className="V text-5xl font-black text-white">V</div>
      <div className="Frame2 flex items-center justify-center gap-5">
        <Button variant={"ghost"} className="h-fit rounded-sm">
          <p className="SignUp text-lg font-medium text-white">Sign Up</p>
        </Button>
        <Button variant={"default"} className="h-fit rounded-sm">
          <p className="LogIn text-lg font-bold text-white">Log In</p>
        </Button>
      </div>
    </div>
  );
}
