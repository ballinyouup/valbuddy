import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
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
    <div className="Container flex w-full">
      <div className="LeftHero flex h-desktop w-1/2 items-center justify-center p-12">
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
              find teammates. It&apos;s a place to build lasting friendships and
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
      <div className="hidden h-desktop w-1/2 overflow-hidden md:flex">
        <Image
          src={"/hero-image.png"}
          height={720}
          width={895}
          alt="VALORANT Hero Image"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="flex h-fit w-full flex-col items-start justify-start">
      <FeatureTitle />
      <FeatureOne />
      <FeatureTwo />
      <FeatureThree />
      <FeatureFour />
    </div>
  );
}

function FeatureTitle() {
  return (
    <div className="flex w-full justify-center py-20 text-6xl font-black uppercase text-white">
      Find the &nbsp;<span className="text-red-700">Perfect&nbsp;</span>
      Teammates
    </div>
  );
}

function DiscordMessage({
  image,
  username,
  message,
  time
}: {
  image?: string;
  username?: string;
  message?: string;
  time?: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-600 px-8 py-4">
      <div className="h-16 w-16 min-w-[64px] rounded-full bg-white" />
      <div className="flex h-fit w-full flex-col items-start">
        <div className="flex gap-4">
          <p>username</p>
          <p className="text-muted">time</p>
        </div>
        <p className="text-lg">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </p>
      </div>
    </div>
  );
}

function FeatureOne() {
  return (
    <div className="flex w-full py-12">
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-fit w-2/3 flex-col overflow-hidden rounded-3xl bg-white">
          <DiscordMessage />
          <DiscordMessage />
          <DiscordMessage />
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-full w-2/3 flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center gap-8">
            <Icons.searchX />
            <div>
              <h4 className="font-black">
                <span className="text-primary">No More&nbsp;</span>Player
                Profiles
              </h4>
            </div>
          </div>
          <p className="text-lg">
            Forget scrolling through Discord for hours trying to find players at
            your skill level
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureTwo() {
  return (
    <div className="flex w-full py-12">
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-full w-2/3 flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center gap-8">
            <Icons.socialVerified />
            <div>
              <h4 className="font-black">
                <span className="text-primary">Vetted&nbsp;</span>Player
                Profiles
              </h4>
            </div>
          </div>
          <p className="text-lg">
            Peep player profiles to see their rank, Agents, play style and
            vibes. Get matched with teammates you'll gel with.
          </p>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-80 w-2/3 flex-col overflow-hidden rounded-3xl bg-white" />
      </div>
    </div>
  );
}

function FeatureThree() {
  return (
    <div className="flex w-full py-12">
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-80 w-2/3 flex-col overflow-hidden rounded-3xl bg-white" />
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-full w-2/3 flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center gap-8">
            <Icons.swords />
            <div>
              <h4 className="font-black">
                <span className="text-primary">Vetted&nbsp;</span>Player
                Profiles
              </h4>
            </div>
          </div>
          <p className="text-lg">
            Level up your squad to the next tier. Create a team of hardcore
            gamers as obsessed with grinding LP as you are
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureFour() {
  return (
    <div className="flex w-full py-12">
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-full w-2/3 flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center gap-8">
            <Icons.calendarSearch />
            <div>
              <h4 className="font-black">
                <span className="text-primary">Compete&nbsp;</span>in Events
              </h4>
            </div>
          </div>
          <p className="text-lg">
            Participate in regular scrims and tournaments to continually test
            and sharpen your skills against quality opponents.
          </p>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex h-80 w-2/3 flex-col overflow-hidden rounded-3xl bg-white" />
      </div>
    </div>
  );
}
