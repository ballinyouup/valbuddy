import { Button } from "@/components/ui/button";
import HeroText from "./hero-text";
import Image from "next/image";
import HeroImage from "../../../../public/files/hero-image.png";
export default function Hero() {
    return (
        <div className="flex h-phone w-screen lg:h-full lg:w-full">
            <div
                className={`LeftHero relative flex h-full w-full items-center justify-center px-8 lg:h-desktop lg:w-1/2 lg:bg-transparent lg:bg-gradient-to-tr lg:from-transparent lg:via-transparent lg:to-red-950/90 lg:px-10`}
            >
                <div className="absolute z-0 h-full w-full bg-red-950 brightness-75 lg:hidden">
                    <Image
                        src={HeroImage}
                        alt="VALORANT Hero Image"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        className="object-cover mix-blend-soft-light"
                    />
                </div>
                <div className="HeroTextContainer z-10 flex h-full w-fit flex-col items-center justify-center gap-10 lg:h-3/5 lg:w-full lg:py-0">
                    <div className="HeroTextHeaders flex w-full flex-col lg:whitespace-nowrap">
                        <HeroText />
                    </div>
                    <div className="HeroParagraphText max-w-3xl">
                        <p className="text-base sm:text-lg lg:text-xl">
                            Build a lasting community. Valbuddy is more than
                            just a place to find teammates. It&apos;s a place to
                            build lasting friendships and connections. Join our
                            vibrant community and make new friends who share
                            your passion for Valorant.
                        </p>
                    </div>
                    <div className="HeroCTAButtons flex w-full flex-wrap gap-4">
                        <Button
                            className="h-12 w-full text-lg sm:w-fit"
                            size={"lg"}
                        >
                            Get Started
                        </Button>
                        <Button
                            className="h-12 w-full text-lg sm:w-fit"
                            variant={"outline"}
                            size={"lg"}
                        >
                            Find Players
                        </Button>
                    </div>
                </div>
            </div>
            <div className="hidden h-desktop w-1/2 overflow-hidden bg-gradient-to-t from-transparent via-red-950/90 to-red-950/90 lg:flex">
                <Image
                    src={HeroImage}
                    alt="VALORANT Hero Image"
                    className="object-cover mix-blend-soft-light"
                    priority
                    quality={100}
                />
            </div>
        </div>
    );
}
