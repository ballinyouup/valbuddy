import "../globals.css";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import 'cal-sans';

export const metadata: Metadata = {
  title: "VALBuddy",
  description: "Find Val Friends"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-full w-screen">
        <Providers>
          <div className="flex w-full justify-center">
            <div className="max-w-desktop flex w-full flex-col items-start justify-between">
              <Navbar />
              {children}
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
