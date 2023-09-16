import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Page() {
  return (
    <div className="Container flex w-full">
      <div className="LeftHero h-desktop flex w-1/2 items-center justify-center p-12">
        <div className="HeroTextContainer flex h-2/3 w-full flex-col justify-between p-4">
          <div className="HeroTextHeaders w-full">
            <h2 className="font-black uppercase">
              <span className="text-primary">Make</span> Friends
            </h2>
            <h2 className="font-black uppercase">
              Create <span className="text-primary">Teams</span>
            </h2>
            <h2 className="font-black uppercase leading-[1.1]">
              <span className="text-primary underline">Dominate</span> The
              Competition
            </h2>
          </div>
          <div className="HeroParagraphText">
            <p className="text-xl">
              Build a lasting community. Valbuddy is more than just a place to
              find teammates. It's a place to build lasting friendships and
              connections. Join our vibrant community and make new friends who
              share your passion for Valorant.
            </p>
          </div>
          <div className="HeroCTAButtons flex w-full gap-8">
            <Button className="h-12 w-full text-lg" size={"lg"}>
              Get Started
            </Button>
            <Button
              className="h-12 w-full text-lg"
              variant={"outline"}
              size={"lg"}
            >
              Find Players
            </Button>
          </div>
        </div>
      </div>
      <div className="h-desktop w-1/2 overflow-hidden object-cover">
        <Image
          src={"/hero-image.png"}
          width={2500}
          height={2500}
          alt="VALORANT Hero Image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
