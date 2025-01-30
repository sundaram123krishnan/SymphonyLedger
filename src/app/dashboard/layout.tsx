import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Dashboard | SymphonyLedger", "description": "A blockchain-based solution ensuring transparent music ownership, automated royalty payments, and direct licensing for artists, composers, and producers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    inter.className,
                    "min-h-screen min-w-full overflow-y-auto overflow-x-hidden"
                )}
            >
                <SidebarProvider>
                    <AppSidebar />
                    <main className="p-4 flex flex-col gap-4 w-full mx-auto">
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
