import { Icons } from '@/components/ui/icons';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
export default function Messages() {
	return (
		<Accordion
			type="single"
			collapsible
			className="fixed bottom-0 right-0 w-96 h-fit py-2 bg-neutral-700 justify-center items-center gap-4 hover:!cursor-pointer hover:ring ring-transparent hover:ring-black md:flex hidden"
		>
			<AccordionItem value="messages" className="border-0">
				<AccordionTrigger
					className="flex justify-center items-center gap-4"
					icon={false}
				>
					<Icons.chatMessage />
					<span className="font-black text-2xl">MESSAGES</span>
				</AccordionTrigger>
				<AccordionContent className="h-96"></AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
