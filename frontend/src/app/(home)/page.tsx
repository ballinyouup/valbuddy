import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Messages from "./_components/messages";
import InView from "./_components/in-view";
import { Separator } from "@/components/ui/separator";
import HeroText from "./_components/hero-text";
import { Verified } from "lucide-react";
export default function Page() {
    return (
        <div className="flex h-full flex-col">
            <Hero />
            <Features />
        </div>
    );
}

function Hero() {
    return (
        <div className="flex h-full w-screen lg:w-full">
            <div className="LeftHero flex h-full w-full items-center justify-center bg-gradient-to-tr from-transparent via-transparent to-red-950/90 px-8 lg:h-desktop lg:w-1/2 lg:px-10">
                <div className="HeroTextContainer flex h-screen w-fit flex-col items-center justify-center gap-10 lg:h-3/5 lg:w-full lg:py-0">
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
                    src={"/hero-image.png"}
                    height={720}
                    width={895}
                    alt="VALORANT Hero Image"
                    className="object-cover mix-blend-soft-light"
                    priority
                    quality={100}
                />
            </div>
        </div>
    );
}

function Features() {
    return (
        <div className="flex h-fit w-screen flex-col items-center justify-center gap-20 px-6 lg:w-full lg:items-start lg:justify-start lg:px-0">
            <FeatureTitle />
            <InView>
                <FeatureOne />
            </InView>
            <InView>
                <FeatureTwo />
            </InView>
            <InView>
                <FeatureThree />
            </InView>
            <InView>
                <FeatureFour />
            </InView>
        </div>
    );
}

function FeatureTitle() {
    return (
        <div className="flex w-full max-w-6xl flex-col self-center">
            <div className="flex w-full flex-wrap justify-center px-8 pb-16 text-4xl font-black uppercase text-white md:text-5xl lg:py-20 lg:text-6xl">
                <span>Find the &nbsp;</span>
                <span className="text-red-700">Perfect&nbsp;</span>
                <span>Teammates</span>
            </div>
            <Separator />
        </div>
    );
}

function FeatureOne() {
    return (
        <div className="flex w-full flex-col-reverse flex-wrap items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <Messages />
            </div>
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full flex-col items-center gap-8 sm:flex-row">
                        <div className="flex items-center justify-center sm:w-1/3">
                            <Icons.searchX />
                        </div>
                        <div className="w-full text-center sm:text-start">
                            <h4 className="font-black">
                                <span className="text-primary">
                                    No More&nbsp;
                                </span>
                                LFG Applications
                            </h4>
                        </div>
                    </div>
                    <p className="text-lg">
                        Forget scrolling through Discord for hours trying to
                        find players at your skill level
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureTwo() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full flex-col items-center gap-8 sm:flex-row">
                        <div className="flex items-center justify-center sm:w-1/3">
                            <Icons.socialVerified />
                        </div>
                        <div className="w-full text-center sm:text-start">
                            <h4 className="font-black">
                                <span className="text-primary">
                                    Vetted&nbsp;
                                </span>
                                Player Profiles
                            </h4>
                        </div>
                    </div>
                    <p className="text-lg">
                        Peep player profiles to see their rank, Agents, play
                        style and vibes. Get matched with teammates you&apos;ll
                        gel with.
                    </p>
                </div>
            </div>
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex w-full flex-col overflow-hidden rounded-3xl shadow-[0_25px_175px_-12px] shadow-red-900/90 sm:h-80 lg:w-3/4">
                    <div className="relative flex gap-4 bg-red-950 p-4 sm:p-6">
                        <Image
                            src="/jett-portrait.jpg"
                            alt="Jett Portrait"
                            height={80}
                            width={80}
                            className="h-20 max-h-[80px] w-20 min-w-[80px] rounded-full border-2 border-black"
                        />
                        <div className="absolute left-[72px] top-[76px] flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-black object-cover">
                            <Image
                                src={"/rank-ascendant.png"}
                                width={48}
                                height={48}
                                alt="Ascendant Rank"
                                className="h-10 w-10 object-cover"
                            />
                        </div>
                        <div className="h-full w-full">
                            <div className="flex w-full flex-col min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between gap-1">
                                <span className="flex items-center gap-1 text-base font-bold">
                                    JettPlayer256{" "}
                                    <Verified
                                        width={24}
                                        height={24}
                                        stroke="green"
                                        fill="black"
                                    />
                                </span>
                                <div className="flex h-5 w-fit gap-1 sm:justify-end">
                                    <Image
                                        src="/role-controller.png"
                                        alt="Controller Icon"
                                        height={18}
                                        width={18}
                                        className="h-5 w-5 rounded-full"
                                    />
                                    <Image
                                        src="/role-sentinel.png"
                                        alt="Sentinel Icon"
                                        height={18}
                                        width={18}
                                        className="h-5 w-5 rounded-full"
                                    />
                                    <Image
                                        src="/role-initiator.png"
                                        alt="Initiator Icon"
                                        height={18}
                                        width={18}
                                        className="h-5 w-5 rounded-full"
                                    />
                                    <Image
                                        src="/role-duelist.png"
                                        alt="Duelist Icon"
                                        height={18}
                                        width={18}
                                        className="h-5 w-5 rounded-full"
                                    />
                                    <Image
                                        src="/role-fill.png"
                                        alt="Fill Icon"
                                        height={18}
                                        width={18}
                                        className="h-5 w-5 rounded-full"
                                        quality={100}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col-reverse justify-between pt-1 min-[480px]:flex-row min-[480px]:pt-0">
                                <span className="text-base font-bold">NA</span>
                                <div className="flex gap-1">
                                    <Image
                                        src="/jett-portrait.jpg"
                                        alt="Initiator Icon"
                                        height={24}
                                        width={24}
                                        className="h-6 w-6 rounded-full"
                                        quality={100}
                                    />
                                    <Image
                                        src="/agent-raze.png"
                                        alt="Duelist Icon"
                                        height={24}
                                        width={24}
                                        className="h-6 w-6 rounded-full"
                                        quality={100}
                                    />
                                    <Image
                                        src="/pheonix-portrait.jpg"
                                        alt="Fill Icon"
                                        height={24}
                                        width={24}
                                        className="h-6 w-6 rounded-full"
                                        quality={100}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-full flex-col gap-4 p-6">
                        <h6>Looking For Team </h6>
                        <p>
                            Hello everyone, my name is JettPlayer256 and im a
                            smokes main who has been playing FPS for more than 2
                            years. I started playing valorant since Beta.
                            Currently in college, looking for serious players
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureThree() {
    return (
        <div className="flex w-full flex-col-reverse items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-2/3" />
            </div>
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full flex-col items-center gap-8 sm:flex-row">
                        <div className="flex items-center justify-center sm:w-1/3">
                            <Icons.swords />
                        </div>
                        <div className="w-full">
                            <h4 className="text-center font-black sm:text-start">
                                <span className="text-primary">
                                    Dominate&nbsp;
                                </span>
                                The Competition
                            </h4>
                        </div>
                    </div>
                    <p className="text-lg">
                        Level up your squad to the next tier. Create a team of
                        hardcore gamers as obsessed with grinding LP as you are
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureFour() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full flex-col items-center gap-8 sm:flex-row">
                        <div className="flex items-center justify-center sm:w-1/3">
                            <Icons.calendarSearch />
                        </div>
                        <div className="w-full text-center sm:text-start">
                            <h4 className="font-black">
                                <span className="text-primary">
                                    Compete&nbsp;
                                </span>
                                in Events
                            </h4>
                        </div>
                    </div>
                    <p className="text-lg">
                        Participate in regular scrims and tournaments to
                        continually test and sharpen your skills against quality
                        opponents.
                    </p>
                </div>
            </div>
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-2/3" />
            </div>
        </div>
    );
}
