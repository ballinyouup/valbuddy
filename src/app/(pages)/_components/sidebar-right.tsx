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
			className="w-1/3 h-fit bg-zinc-900 flex-col justify-start items-center hidden xl:inline-flex border-2 border-black"
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
			className="h-fit w-full bg-zinc-900 flex-col justify-start items-center flex"
		>
			<AccordionTrigger className="w-full py-2 bg-red-900 justify-between items-center gap-2 flex px-4">
				<div className="text-center text-white text-2xl font-black uppercase">
					SCRIMS
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<ScrimsRow
					teamName="Team #1"
					region="NA"
					time="7:00PM"
				/>
				<ScrimsRow
					teamName="Team #2"
					region="EU"
					time="11:00PM"
				/>
				<ScrimsRow
					teamName="Team #3"
					region="AP"
					time="3:00PM"
				/>
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
		<div className="w-full h-fit bg-neutral-800 border-b border-black border-opacity-30 justify-start items-center inline-flex p-2">
			<div className="w-48 px-4 border-r border-black border-opacity-20 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">
					{teamName}
				</div>
			</div>
			<div className="w-28 px-4 border-r border-black border-opacity-20 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">
					{time}
				</div>
			</div>
			<div className="w-12 self-stretch px-4 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">
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
			className="h-fit w-full bg-zinc-900 flex-col justify-start items-center flex"
		>
			<AccordionTrigger className="w-full py-2 bg-red-900 justify-between items-center gap-2 flex px-4">
				<div className="text-center text-white text-2xl font-black uppercase">
					EVENTS
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<EventsRow
					eventName="Event #1"
					date="01-12-2026"
				/>
				<EventsRow
					eventName="Event #2"
					date="02-28-2026"
				/>
				<EventsRow
					eventName="Event #3"
					date="04-04-2026"
				/>
			</AccordionContent>
		</AccordionItem>
	);
}

function EventsRow({ eventName, date }: { eventName: string; date: string }) {
	return (
		<div className="w-full h-fit bg-neutral-800 border-b border-black border-opacity-30 justify-start items-center inline-flex p-2">
			<div className="w-fit grow self-stretch px-4 border-r border-black border-opacity-20 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">
					{eventName}
				</div>
			</div>
			<div className="w-36 px-4 justify-start items-center gap-2 flex">
				<div className="text-white text-base font-black capitalize">
					{date}
				</div>
			</div>
		</div>
	);
}

function Communities() {
	return (
		<AccordionItem
			value="communities"
			className="h-fit w-full bg-zinc-900 flex-col justify-start items-center flex"
		>
			<AccordionTrigger className="w-full py-2 bg-red-900 justify-between items-center gap-2 flex px-4">
				<div className="text-center text-white text-2xl font-black uppercase">
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
		<div className="w-full h-fit bg-neutral-800 border-b border-black border-opacity-30 justify-start items-center inline-flex p-2">
			<div className="px-4 justify-start items-center flex">
				<div className="text-white text-base font-black capitalize">
					{communityName}
				</div>
			</div>
		</div>
	);
}
