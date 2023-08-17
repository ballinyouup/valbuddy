import { ThemeProvider } from "@/app/(pages)/_components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
export default function Providers({
	children,
}: {
	children?: React.ReactNode;
}) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
            <Toaster/>
		</ThemeProvider>
	);
}
