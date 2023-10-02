import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import React from "react";

type FAQItem = {
    question: string;
    answer: string;
};

const faq: FAQItem[] = [
    {
        question: "What are the core features of ValBuddy?",
        answer: "ValBuddy offers basic social media features like creating posts and teams, uploading profile images, and real-time messaging. Perfect for finding your next Valorant squad!"
    },
    {
        question: "Is Valbuddy Free to Use?",
        answer: "ValBuddy is free, but we offer additional features through our paid plan."
    },
    {
        question: "How can I get help or support?",
        answer: "You can reach out to our customer support team via email for any assistance."
    },
    {
        question: "Can I use ValBuddy for games other than Valorant?",
        answer: "ValBuddy is dedicated solely to Valorant players. However, this may change in the future."
    },
    {
        question: "Is there an age restriction for using ValBuddy?",
        answer: "Yes, you must be at least 18 years old to use the platform."
    }
];

export default function FAQ() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-12 px-6 py-12">
            <h4 className="text-center">Frequently Asked Questions</h4>
            <Accordion
                type="single"
                collapsible
                className="w-full max-w-2xl overflow-hidden rounded-xl shadow-[0_10px_175px_-50px] shadow-primary/90"
            >
                {faq.map((item, index) => (
                    <React.Fragment key={index}>
                        <FAQItem {...item} />
                    </React.Fragment>
                ))}
            </Accordion>
        </div>
    );
}

function FAQItem(item: FAQItem) {
    return (
        <AccordionItem value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
    );
}
