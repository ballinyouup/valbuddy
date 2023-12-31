import InView from "./in-view";
import { Icons } from "@/components/ui/icons";
import Messages from "./messages";
import Image from "next/image";
import { Verified } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { roles, agents } from "@/data/valorant";

export default function Features() {
    return (
        <div className="flex h-fit w-screen flex-col items-center justify-center gap-20 px-6 lg:w-full lg:items-start lg:justify-start lg:px-0">
            <FeatureTitle />
            <InView>
                <Feature
                    titleOne="No More&nbsp;"
                    titleTwo="LFG Apps"
                    icon={<Icons.searchX />}
                    text="Forget scrolling through Discord for hours trying to
                        find players at your skill level"
                >
                    <Messages />
                </Feature>
            </InView>
            <InView>
                <Feature
                    titleOne="Vetted&nbsp;"
                    titleTwo="Player Profiles"
                    icon={<Icons.socialVerified />}
                    text="View player profiles to see their rank, agents, play style and interests. Get matched with teammates you'll gel with."
                    reverse={true}
                >
                    <FeatureContent />
                </Feature>
            </InView>
            <InView>
                <Feature
                    titleOne="Dominate&nbsp;"
                    titleTwo="The Competition"
                    icon={<Icons.swords />}
                    reverse={false}
                    text="Level up your squad to the next tier. Create a team of
                    hardcore gamers as obsessed with grinding LP as you are"
                >
                    <div className="flex h-fit w-full flex-col overflow-hidden rounded-3xl shadow-[0_25px_175px_-12px] shadow-red-900/90 lg:w-4/5">
                        <div className="flex w-full flex-col gap-2 bg-destructive p-6 sm:flex-row sm:gap-0">
                            <Image
                                src="/files/wingman-icon.webp"
                                height={80}
                                width={80}
                                alt="Wingman Icon"
                                className="!max-h-[80px] !max-w-[80px] rounded-full"
                                quality={100}
                            />
                            <div className="flex w-full flex-col px-2">
                                <div className="flex w-full gap-1 font-bold">
                                    <h6>
                                        Zero Latency{" "}
                                    </h6>
                                    <Verified
                                        width={24}
                                        height={24}
                                        stroke="green"
                                        fill="black"
                                    />
                                </div>
                                <p className="text-lg tracking-tight">
                                    Sniping goals and defusing dreams. Zero
                                    Latency — Valorant pros in the making. 🎮
                                </p>
                            </div>
                        </div>
                        <div className="flex h-full flex-col py-2">
                            <div className="flex h-10 w-full items-center justify-between px-6 py-1">
                                <div className="flex items-start gap-2">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src="/files/jett-portrait.jpg"
                                            fill
                                            alt="Jett Icon"
                                            quality={100}
                                        />
                                    </div>
                                    <span className="text-xl leading-tight tracking-tight">
                                        JettPlayer256
                                    </span>
                                </div>
                                <Image
                                    src={"/files/role-duelist.png"}
                                    height={20}
                                    width={20}
                                    alt="Duelist Icon"
                                    quality={100}
                                />
                            </div>
                            <div className="flex h-10 w-full items-center justify-between px-6 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src="/files/killjoy-portrait.jpg"
                                            fill
                                            alt="Killjoy Icon"
                                            quality={100}
                                        />
                                    </div>
                                    <span className="text-xl leading-tight tracking-tight">
                                        KillJoyTurret1337
                                    </span>
                                </div>
                                <Image
                                    src={"/files/role-sentinel.png"}
                                    height={20}
                                    width={20}
                                    alt="Sentinel Icon"
                                    quality={100}
                                />
                            </div>
                            <div className="flex h-10 w-full items-center justify-between px-6 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src="/files/kayo-portrait.jpg"
                                            fill
                                            alt="KAYO Icon"
                                            quality={100}
                                        />
                                    </div>
                                    <span className="text-xl leading-tight tracking-tight">
                                        KayoFlash101
                                    </span>
                                </div>
                                <Image
                                    src={"/files/role-initiator.png"}
                                    height={20}
                                    width={20}
                                    alt="Initiator Icon"
                                    quality={100}
                                />
                            </div>
                            <div className="flex h-10 w-full items-center justify-between px-6 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src="/files/skye-portrait.png"
                                            fill
                                            alt="Skye Icon"
                                            className="bg-white"
                                            quality={100}
                                        />
                                    </div>
                                    <span className="text-xl leading-tight tracking-tight">
                                        SkyeBird1
                                    </span>
                                </div>
                                <Image
                                    src={"/files/role-initiator.png"}
                                    height={20}
                                    width={20}
                                    alt="Initiator Icon"
                                    quality={100}
                                />
                            </div>
                            <div className="flex h-10 w-full items-center justify-between px-6 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src="/files/omen-portrait.jpg"
                                            fill
                                            alt="Omen Icon"
                                            quality={100}
                                        />
                                    </div>
                                    <span className="text-xl leading-tight tracking-tight">
                                        OmenOwl22
                                    </span>
                                </div>
                                <Image
                                    src={"/files/role-controller.png"}
                                    height={20}
                                    width={20}
                                    alt="Controller Icon"
                                    quality={100}
                                />
                            </div>
                        </div>
                    </div>
                </Feature>
            </InView>
            <InView>
                <Feature
                    titleOne="Compete&nbsp;"
                    titleTwo="in Events"
                    icon={<Icons.calendarSearch />}
                    text="Participate in regular scrims and tournaments to
                    continually test and sharpen your skills against quality
                    opponents."
                    reverse={true}
                >
                    <div className="flex h-fit w-full flex-col overflow-hidden rounded-3xl shadow-[0_25px_175px_-12px] shadow-red-900/90 sm:h-full lg:w-4/5">
                        <div className="flex">
                            <div className="relative w-52 overflow-hidden sm:h-48">
                                <Image
                                    src="/files/valorant-events-image.png"
                                    fill
                                    alt="Valorant Events Image"
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>
                            <div className="flex w-full flex-col gap-1 px-4 py-2 sm:py-1">
                                <div className="flex flex-wrap justify-between pr-1 font-bold">
                                    <h6>TurboPulse</h6>
                                    <h6>$500</h6>
                                </div>
                                <Badge
                                    className="w-fit py-0 text-[14px] font-bold"
                                    variant={"default"}
                                >
                                    NA
                                </Badge>
                                <span className="tracking-tight">
                                    Step into the arena of TurboPulse Elite
                                    Series, where top-tier gaming meets serious
                                    rewards. Elevate your game play, challenge
                                    the best, and claim your share of the cash
                                    prize pool.
                                </span>
                            </div>
                        </div>
                        <div className="flex h-fit overflow-hidden">
                            <div className="relative w-52 overflow-hidden sm:h-48">
                                <Image
                                    src="/files/valorant-events-image-1.png"
                                    fill
                                    alt="Valorant Events Image"
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>
                            <div className="flex h-fit w-full flex-col gap-1 px-4 py-2 sm:py-1">
                                <div className="flex flex-wrap justify-between pr-1 font-bold">
                                    <h6>NovaSphere</h6>
                                    <h6>$250</h6>
                                </div>
                                <Badge
                                    className="w-fit py-0 text-[14px] font-bold"
                                    variant={"default"}
                                >
                                    EU
                                </Badge>
                                <span>
                                    NovaSphere Invitational is THE place to show
                                    off your skills and win some cash!
                                    Don&apos;t miss your shot at becoming the
                                    next NovaSphere Champ.
                                </span>
                            </div>
                        </div>
                    </div>
                </Feature>
            </InView>
        </div>
    );
}

function FeatureTitle() {
    return (
        <div className="flex w-full max-w-6xl flex-col self-center">
            <div className="flex w-full flex-wrap justify-center px-8 py-20 pb-16 text-white">
                <h2>Find the&nbsp;</h2>
                <h2 className="text-red-700">Perfect&nbsp;</h2>
                <h2>Teammates</h2>
            </div>
            <Separator />
        </div>
    );
}

function Feature({
    children,
    icon,
    text,
    reverse = false,
    titleOne,
    titleTwo
}: {
    children?: React.ReactNode;
    icon: React.ReactNode;
    text: string;
    reverse?: boolean;
    titleOne: string;
    titleTwo: string;
}) {
    return (
        <div
            className={
                reverse
                    ? "flex w-full flex-col-reverse flex-wrap items-center justify-center gap-20 lg:flex-row-reverse lg:gap-0 lg:py-16"
                    : "flex w-full flex-col-reverse flex-wrap items-center justify-center gap-20 lg:flex-row lg:gap-0 lg:py-16"
            }
        >
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                {children}
            </div>
            <div className="flex w-full max-w-2xl items-center justify-center lg:w-1/2">
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 lg:w-4/5">
                    <div className="flex w-full flex-col items-center gap-8 sm:flex-row">
                        <div className="flex items-center justify-center sm:w-1/3">
                            {icon}
                        </div>
                        <div className="w-full text-center sm:text-start">
                            <h3 className="font-black">
                                <div className="text-primary">{titleOne}</div>
                                {titleTwo}
                            </h3>
                        </div>
                    </div>
                    <p className="text-center text-3xl font-light tracking-tight md:text-start">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}

function FeatureContent() {
    return (
        <div className="flex w-full flex-col overflow-hidden rounded-3xl shadow-[0_25px_175px_-12px] shadow-primary/90 sm:h-fit lg:w-4/5">
            <div className="relative flex flex-col gap-4 bg-destructive p-4 sm:flex-row sm:p-6">
                <Image
                    src="/files/jett-portrait.jpg"
                    alt="Jett Portrait"
                    height={80}
                    width={80}
                    className="h-20 max-h-[80px] w-20 min-w-[80px] rounded-full border border-black"
                    quality={100}
                />
                <div className="absolute left-[72px] top-[76px] flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-accent object-cover sm:left-20 sm:top-20">
                    <Image
                        src={"/files/rank-ascendant.png"}
                        width={48}
                        height={48}
                        alt="Ascendant Rank"
                        className="h-10 w-10 object-cover"
                        quality={100}
                    />
                </div>
                <div className="h-full w-full">
                    <div className="flex w-full flex-row justify-between gap-1 min-[480px]:items-center">
                        <span className="flex items-center gap-1 text-xs font-bold min-[340px]:text-lg">
                            JettPlayer256{" "}
                            <Verified
                                width={24}
                                height={24}
                                stroke="green"
                                fill="black"
                                className="h-5 w-5 min-[340px]:h-6 min-[340px]:w-6"
                            />
                        </span>
                        <div className="flex h-5 w-fit gap-1 sm:justify-end">
                            {roles.map(({ src, alt }) => (
                                <Image
                                    key={alt}
                                    src={src}
                                    alt={alt}
                                    height={20}
                                    width={20}
                                    className="rounded-full"
                                    quality={100}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex w-full flex-row justify-between pt-1 min-[480px]:pt-0">
                        <span className="text-xs min-[340px]:text-lg">NA</span>
                        <div className="flex gap-1">
                            {agents.map(({ src, alt }) => (
                                <Image
                                    key={alt}
                                    src={src}
                                    alt={alt}
                                    height={24}
                                    width={24}
                                    className="h-6 w-6 rounded-full"
                                    quality={100}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex h-full flex-col gap-2 p-6">
                <h6 className="text-3xl">Looking For Team </h6>
                <p className="text-xl leading-tight tracking-tight">
                    Hello everyone, my name is JettPlayer256 and im a smokes
                    main who has been playing FPS for more than 2 years. I
                    started playing valorant since Beta. Currently in college,
                    looking for serious players
                </p>
            </div>
        </div>
    );
}
