import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { links, Socials } from "@/data/urls";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex w-full justify-center">
            <div className="max-w-6xl flex h-fit w-full flex-col md:flex-row">
                <FooterSection>
                    <FooterHeader className="md:pl-2">VALBUDDY</FooterHeader>
                    <FooterLinksContainer>
                        <FooterSocial social={Socials.twitter} />
                        <FooterSocial social={Socials.tiktok} />
                    </FooterLinksContainer>
                </FooterSection>
                <FooterSection>
                    <FooterHeader>Quick Links</FooterHeader>
                    <FooterLinksContainer>
                        <FooterLink href="/">Home</FooterLink>
                        <FooterLink href="/dashboard">Dashboard</FooterLink>
                    </FooterLinksContainer>
                </FooterSection>
                <FooterSection>
                    <FooterHeader>Support</FooterHeader>
                    <FooterLinksContainer>
                        <FooterLink href="#">Contact Us</FooterLink>
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Terms of Service</FooterLink>
                        <FooterLink href="#">Legal</FooterLink>
                    </FooterLinksContainer>
                </FooterSection>
                <FooterSection>
                    <FooterHeader>Subscribe</FooterHeader>

                    <form className="flex w-56 flex-wrap gap-2">
                        <p className="text-xs text-muted-foreground">
                            Enter your email below to stay up to date with
                            events!
                        </p>
                        <Input placeholder="enter email..." />
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </FooterSection>
            </div>
        </footer>
    );
}

type FooterProps = { children?: React.ReactNode; className?: string };
type FooterLink = FooterProps & React.ComponentProps<typeof Link>;

function FooterSection({ children }: FooterProps) {
    return (
        <div className="flex w-full flex-col items-start justify-center gap-2 px-6 py-4 md:h-fit md:py-12">
            {children}
        </div>
    );
}

function FooterHeader({ children, className }: FooterProps) {
    return <h5 className={className}>{children}</h5>;
}

function FooterLinksContainer({ children }: FooterProps) {
    return <div className="flex w-fit flex-col gap-2">{children}</div>;
}

function FooterLink(props: FooterLink) {
    return (
        <Button
            asChild
            variant={"link"}
            className="h-fit w-fit p-0 text-base text-white"
        >
            <Link {...props}>{props.children}</Link>
        </Button>
    );
}

function FooterSocial({ social }: { social: typeof Socials.twitter }) {
    return (
        <Button asChild variant={"ghost"} className="p-1 hover:bg-destructive">
            <Link
                href={social.url}
                className="flex h-fit items-center justify-center gap-2 bg-black pr-2"
            >
                <social.icon
                    width={40}
                    height={40}
                    fill="white"
                    className="rounded-lg p-2"
                />
                <p className="text-base">{social.name}</p>
            </Link>
        </Button>
    );
}
