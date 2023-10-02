import Hero from "./_components/hero";
import Features from "./_components/features";
import FAQ from "./_components/faq";
export default function Page() {
    return (
        <div className="flex h-full flex-col">
            <Hero />
            <Features />
            <FAQ />
        </div>
    );
}
