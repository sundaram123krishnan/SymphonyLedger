import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Music } from "lucide-react"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { WavyBackground } from "@/components/ui/wavy-background"

const Root = () => {
    return (
        <main className="bg-white dark:bg-black mx-auto max-w-5xl">
            <header className="border-b py-2">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <span className="text-2xl font-bold text-primary flex items-center gap-3"><Music /> SymphonyLedger</span>
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <Button>Login</Button>
                        </div>
                    </div>
                </div>
            </header>

            <TracingBeam className="px-6 mx-auto overflow-hidden">
                
            </TracingBeam>
        </main>
    )
}

export default Root