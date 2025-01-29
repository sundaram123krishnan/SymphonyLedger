"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Music } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { LinkWithMetamask } from "./link-with-metamask";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const { isPending, data: session } = useSession();


  const testPathname = () => {
    return /^\/dashboard(\/.*)?$/.test(pathname)
  }

  if (isPending) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            inter.className,
            "min-h-screen min-w-full overflow-y-auto overflow-x-hidden bg-black"
          )}
        >
          <div className="w-full h-screen flex justify-center items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen min-w-full overflow-y-auto overflow-x-hidden bg-black"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#7f1d1d" zIndex={1000} />
          <LinkWithMetamask />
          {!testPathname() && <header className="border-b py-2 mx-auto max-w-5xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex-shrink-0">
                    <span className="text-2xl font-bold text-primary flex items-center gap-3">
                      <Music /> SymphonyLedger
                    </span>
                  </Link>
                </div>

                <div className="hidden md:block">
                  {session ? (
                    <Link href="/dashboard">
                      <Button>Dashboard</Button>
                    </Link>
                  ) : (
                    <Link href="/sign-in">
                      <Button>Login</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </header>}
          {children}
          {!testPathname() && <footer className="w-full bg-white dark:bg-black p-8 mt-16 border-t border-slate-200 mx-auto max-w-5xl">
            <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white dark:bg-black text-center md:justify-between">
              <div className="flex gap-4">
                <Music /> SymphonyLedger
              </div>

              <p className="text-sm text-center text-slate-500">
                Copyright © 2025&nbsp;
              </p>
            </div>
          </footer>}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
