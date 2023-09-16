import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default function SidebarRight() {
  return (
    <Accordion
      type="multiple"
      defaultValue={["scrims", "communities", "events"]}
      className="hidden h-fit w-1/3 flex-col items-center justify-start border-2 border-black bg-zinc-900 xl:inline-flex"
    >
      <Scrims />
      <Events />
      <Communities />
    </Accordion>
  );
}

function Scrims() {
  return (
    <AccordionItem
      value="scrims"
      className="flex h-fit w-full flex-col items-center justify-start bg-zinc-900"
    >
      <AccordionTrigger className="flex w-full items-center justify-between gap-2 bg-red-900 px-4 py-2">
        <div className="text-center text-2xl font-black uppercase text-white">
          SCRIMS
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ScrimsRow teamName="Team #1" region="NA" time="7:00PM" />
        <ScrimsRow teamName="Team #2" region="EU" time="11:00PM" />
        <ScrimsRow teamName="Team #3" region="AP" time="3:00PM" />
      </AccordionContent>
    </AccordionItem>
  );
}

function ScrimsRow({
  teamName,
  time,
  region
}: {
  teamName: string;
  time: string;
  region: string;
}) {
  return (
    <div className="inline-flex h-fit w-full items-center justify-start border-b border-black border-opacity-30 bg-neutral-800 p-2">
      <div className="flex w-48 items-center justify-start border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          {teamName}
        </div>
      </div>
      <div className="flex w-28 items-center justify-start gap-2 border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">{time}</div>
      </div>
      <div className="flex w-12 items-center justify-start gap-2 self-stretch px-4">
        <div className="text-base font-black capitalize text-white">
          {region}
        </div>
      </div>
    </div>
  );
}

function Events() {
  return (
    <AccordionItem
      value="events"
      className="flex h-fit w-full flex-col items-center justify-start bg-zinc-900"
    >
      <AccordionTrigger className="flex w-full items-center justify-between gap-2 bg-red-900 px-4 py-2">
        <div className="text-center text-2xl font-black uppercase text-white">
          EVENTS
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <EventsRow eventName="Event #1" date="01-12-2026" />
        <EventsRow eventName="Event #2" date="02-28-2026" />
        <EventsRow eventName="Event #3" date="04-04-2026" />
      </AccordionContent>
    </AccordionItem>
  );
}

function EventsRow({ eventName, date }: { eventName: string; date: string }) {
  return (
    <div className="inline-flex h-fit w-full items-center justify-start border-b border-black border-opacity-30 bg-neutral-800 p-2">
      <div className="flex w-fit grow items-center justify-start self-stretch border-r border-black border-opacity-20 px-4">
        <div className="text-base font-black capitalize text-white">
          {eventName}
        </div>
      </div>
      <div className="flex w-36 items-center justify-start gap-2 px-4">
        <div className="text-base font-black capitalize text-white">{date}</div>
      </div>
    </div>
  );
}

function Communities() {
  return (
    <AccordionItem
      value="communities"
      className="flex h-fit w-full flex-col items-center justify-start bg-zinc-900"
    >
      <AccordionTrigger className="flex w-full items-center justify-between gap-2 bg-red-900 px-4 py-2">
        <div className="text-center text-2xl font-black uppercase text-white">
          Communities
        </div>
      </AccordionTrigger>
      <AccordionContent className="w-full">
        <CommunitiesRow communityName="Team #1" />
        <CommunitiesRow communityName="Team #2" />
        <CommunitiesRow communityName="Team #3" />
      </AccordionContent>
    </AccordionItem>
  );
}

function CommunitiesRow({ communityName }: { communityName: string }) {
  return (
    <div className="inline-flex h-fit w-full items-center justify-start border-b border-black border-opacity-30 bg-neutral-800 p-2">
      <div className="flex items-center justify-start px-4">
        <div className="text-base font-black capitalize text-white">
          {communityName}
        </div>
      </div>
    </div>
  );
}
