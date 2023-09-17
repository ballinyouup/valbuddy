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
      className="fixed bottom-0 right-0 hidden h-fit items-center justify-center gap-4 bg-neutral-700 text-primary-foreground ring-transparent hover:!cursor-pointer hover:ring hover:ring-black md:flex"
    >
      <AccordionItem value="messages" className="border-0">
        <AccordionTrigger className="flex w-96 items-center justify-center gap-4 duration-0 hover:bg-black">
          <Icons.chatMessage />
          <span className="text-2xl font-black">MESSAGES</span>
        </AccordionTrigger>
        <AccordionContent className="h-96"></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
