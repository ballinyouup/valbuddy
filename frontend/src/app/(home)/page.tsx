import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Messages from "./_components/messages";
import InView from "./_components/in-view";

export default function Page() {
    return (
        <div className="flex flex-col">
            <Hero />
            <Features />
        </div>
    );
}

function Hero() {
    return (
        <div className="flex w-screen lg:w-full">
            <div className="LeftHero flex h-full w-full items-center justify-center bg-gradient-to-tr from-transparent via-transparent to-red-950/90 px-8 lg:h-desktop lg:w-1/2 lg:px-10">
                <div className="HeroTextContainer flex h-full w-full flex-col justify-between gap-10 pt-40 lg:h-3/5 lg:py-0">
                    <div className="HeroTextHeaders flex w-full flex-col lg:whitespace-nowrap [&>h2]:text-[10vw] [&>h2]:min-[540px]:text-6xl [&>h2]:sm:text-6xl [&>h2]:md:text-7xl [&>h2]:lg:text-6xl [&>h2]:xl:text-7xl">
                        <h2 className="font-black uppercase">
                            <span className="text-primary">Make</span> Friends
                        </h2>
                        <h2 className="font-black uppercase">
                            Create <span className="text-primary">Teams</span>
                        </h2>
                        <h2 className="flex flex-col font-black uppercase leading-[1.1]">
                            <div className="flex flex-wrap">
                                <span className="text-primary underline">
                                    Dominate&nbsp;
                                </span>
                                <span>The</span>
                            </div>
                            <span>Competition</span>
                        </h2>
                    </div>
                    <div className="HeroParagraphText max-w-3xl">
                        <p className="text-base lg:text-xl">
                            Build a lasting community. Valbuddy is more than
                            just a place to find teammates. It&apos;s a place to
                            build lasting friendships and connections. Join our
                            vibrant community and make new friends who share
                            your passion for Valorant.
                        </p>
                    </div>
                    <div className="HeroCTAButtons flex w-full flex-wrap gap-3 lg:gap-8">
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
            <div className="hidden h-desktop w-1/2 overflow-hidden bg-gradient-to-t from-transparent via-red-950/90 to-red-950/90 lg:flex">
                <Image
                    src={"/hero-image.png"}
                    height={720}
                    width={895}
                    alt="VALORANT Hero Image"
                    className="object-cover mix-blend-soft-light"
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
        <div className="flex w-full flex-wrap justify-center px-8 py-8 text-4xl font-black uppercase text-white md:text-5xl lg:py-20 lg:text-6xl">
            <span>Find the &nbsp;</span>
            <span className="text-red-700">Perfect&nbsp;</span>
            <span>Teammates</span>
        </div>
    );
}

function FeatureOne() {
    return (
        <div className="flex w-full flex-wrap justify-center gap-20 lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <Messages />
            </div>
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full items-center gap-8">
                        <div className="flex w-1/3 items-center justify-center">
                            <Icons.searchX />
                        </div>
                        <div className="w-full">
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
        <div className="flex w-full flex-col-reverse items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full items-center gap-8">
                        <div className="flex w-1/3 items-center justify-center">
                            <Icons.socialVerified />
                        </div>
                        <div className="w-full">
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
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-2/3" />
            </div>
        </div>
    );
}

function FeatureThree() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-2/3" />
            </div>
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full items-center gap-8">
                        <div className="flex w-1/3 items-center justify-center">
                            <Icons.swords />
                        </div>
                        <div className="w-full">
                            <h4 className="font-black">
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
        <div className="flex w-full flex-col-reverse items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-32">
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-2/3">
                    <div className="flex w-full items-center gap-8">
                        <div className="flex w-1/3 items-center justify-center">
                            <Icons.calendarSearch />
                        </div>
                        <div className="w-full">
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
            <div className="flex w-full max-w-xl items-center justify-center lg:w-1/2">
                <div className="flex h-80 w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-2/3" />
            </div>
        </div>
    );
}
