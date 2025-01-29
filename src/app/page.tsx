import type { Metadata } from "next";
import Link from "next/link"
import { ArrowRight, Music, DollarSign, Shield } from "lucide-react"
import { TracingBeam } from "@/components/ui/tracing-beam"
import Carousel from "@/components/ui/carousel"

export const metadata: Metadata = {
    title: "SymphonyLedger | Decentralized Digital Rights Management for Music",
    "description": "A blockchain-based solution ensuring transparent music ownership, automated royalty payments, and direct licensing for artists, composers, and producers.",
};

const Root = () => {
    const slideData = [
        {
            "title": "Trending Songs",
            "button": "Enjoy It",
            "src": "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyZW5kaW5nJTIwc29uZ3xlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            "title": "Top Albums",
            "button": "Discover Now",
            "src": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "title": "Live Concerts",
            "button": "Watch Now",
            "src": "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            "title": "New Releases",
            "button": "Check It Out",
            "src": "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]

    return (
        <main className="bg-white dark:bg-black mx-auto max-w-5xl">
            <TracingBeam className="px-6 mx-auto overflow-hidden">
                <div className="relative overflow-hidden w-full h-full py-20">
                    <Carousel slides={slideData} />
                </div>

                <section className="bg-white dark:bg-black py-16 md:py-16">
                    <div className="container mx-auto px-6 md:px-10">
                        <h2 className="mb-12 text-center text-4xl font-bold">Why Choose Our Platform?</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: Music,
                                    title: "Immutable Ownership",
                                    description: "Secure and tamper-proof record of music rights",
                                },
                                {
                                    icon: DollarSign,
                                    title: "Automated Royalties",
                                    description: "Smart contracts ensure prompt, accurate payments",
                                },
                                {
                                    icon: Shield,
                                    title: "Piracy Protection",
                                    description: "Advanced authentication to combat unauthorized use",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg bg-white dark:bg-black p-6 shadow-md transition-all duration-500 hover:shadow-xl translate-y-0 opacity-100"
                                    style={{ transitionDelay: `${index * 200}ms` }}
                                >
                                    <feature.icon className="mb-4 h-12 w-12 text-red-600" />
                                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-16">
                    <div className="container mx-auto px-6 md:px-10">
                        <h2 className="mb-12 text-center text-4xl font-bold">How It Works</h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    step: "1",
                                    title: "Register Your Music",
                                    description: "Upload your tracks and establish ownership on the blockchain",
                                },
                                {
                                    step: "2",
                                    title: "Manage Rights",
                                    description: "Control licensing and track usage of your music globally",
                                },
                                {
                                    step: "3",
                                    title: "Receive Royalties",
                                    description: "Get paid automatically and transparently for your work",
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-red-600 py-16 text-white md:py-24">
                    <div className="container mx-auto px-6 text-center md:px-10">
                        <h2 className="mb-6 text-4xl font-bold">Ready to Secure Your Music Rights?</h2>
                        <p className="mb-8 text-xl">Join the future of music rights management today</p>
                        <Link
                            href="#"
                            className="inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-red-600 transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
                        >
                            Join Us Now
                            <ArrowRight className="ml-2 inline-block" />
                        </Link>
                    </div>
                </section>
            </TracingBeam>
        </main>
    )
}

export default Root