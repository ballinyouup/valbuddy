import { Icons } from "@/components/ui/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
export default function Messages() {
	return (
		<Accordion
			type="single"
			collapsible
			className="fixed bottom-0 right-0 h-fit bg-neutral-700 justify-center items-center gap-4 hover:!cursor-pointer hover:ring ring-transparent hover:ring-black md:flex hidden text-primary-foreground"
		>
			<AccordionItem value="messages" className="border-0">
				<AccordionTrigger
					className="flex justify-center items-center gap-4 w-96 hover:bg-black duration-0"
					icon={false}
				>
					<Icons.chatMessage />
					<span className="font-black text-2xl">
						MESSAGES
					</span>
				</AccordionTrigger>
				<AccordionContent className="h-96"></AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
