"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import prisma from "@/lib/prisma";

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

interface Artist {
    name: string;
    image: string | null;
    score: number;
}

interface Album {
    name: string;
    albumImage: string;
    artistName: string;
}

const Home = () => {
    const id = useId();
    const [artist, setArtist] = useState<Artist[]>([]);
    const [album, setAlbum] = useState<Album[]>([]);
    const ref = useRef<HTMLDivElement>(null!);
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );

    useOutsideClick(ref, () => setActive(null));

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("/api/top-artists");
                const rankedArtists = await response.json();
                setArtist(rankedArtists);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        })();

        (async () => {
            try {
                const response = await fetch("/api/top-albums");
                const rankedAlbums = await response.json();
                setAlbum(rankedAlbums);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        })();
    }, []);

    return (
        <>
            <main className="px-10 pt-3">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
                    Popular Artists
                </h3>

                <ul className="mx-auto max-w-full gap-4 flex">
                    {artist.length > 0 && artist.map((card, index) => (
                        <motion.div
                            key={index}
                            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                        >
                            <div className="flex gap-4 flex-col justify-center items-center">
                                <motion.div>
                                    <Image
                                        width={100}
                                        height={100}
                                        unoptimized
                                        src={card.image}
                                        alt={card.name}
                                        className="h-40 w-40 md:h-30 md:w-30 rounded-full object-cover object-top"
                                    />
                                </motion.div>

                                <div className="flex flex-col items-center">
                                    <motion.h3
                                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                    >
                                        {card.name}
                                    </motion.h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ul>
            </main>

            <main className="px-10 pt-3">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
                    Popular Albums
                </h3>

                <ul className="mx-auto max-w-full gap-4 flex">
                    {album.length > 0 && album.map((card, index) => (
                        <motion.div
                            key={index}
                            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                        >
                            <div className="flex gap-4 flex-col justify-center items-center">
                                <motion.div>
                                    <Image
                                        width={100}
                                        height={100}
                                        unoptimized
                                        src={card.albumImage}
                                        alt={card.name}
                                        className="h-40 w-40 md:h-30 md:w-30 rounded-full object-cover object-top"
                                    />
                                </motion.div>

                                <div className="flex flex-col items-center">
                                    <motion.h3
                                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                    >
                                        {card.name}
                                    </motion.h3>

                                    <motion.p
                                        className="text-neutral-600 dark:text-neutral-400"
                                    >
                                        {card.artistName}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ul>
            </main>
        </>
    );
}



const cards = [
    {
        description: "Lana Del Rey",
        title: "Summertime Sadness",
        src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                (<p>Lana Del Rey, an iconic American singer-songwriter, is celebrated for
                    her melancholic and cinematic music style. Born Elizabeth Woolridge
                    Grant in New York City, she has captivated audiences worldwide with
                    her haunting voice and introspective lyrics. <br /> <br />Her songs
                    often explore themes of tragic romance, glamour, and melancholia,
                    drawing inspiration from both contemporary and vintage pop culture.
                    With a career that has seen numerous critically acclaimed albums, Lana
                    Del Rey has established herself as a unique and influential figure in
                    the music industry, earning a dedicated fan base and numerous
                    accolades.
                </p>)
            );
        },
    },
    {
        description: "Babbu Maan",
        title: "Mitran Di Chhatri",
        src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                (<p>Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                    voice and profound lyrics that resonate deeply with his audience. Born
                    in the village of Khant Maanpur in Punjab, India, he has become a
                    cultural icon in the Punjabi music industry. <br /> <br />His songs
                    often reflect the struggles and triumphs of everyday life, capturing
                    the essence of Punjabi culture and traditions. With a career spanning
                    over two decades, Babu Maan has released numerous hit albums and
                    singles that have garnered him a massive fan following both in India
                    and abroad.
                </p>)
            );
        },
    },

    {
        description: "Metallica",
        title: "For Whom The Bell Tolls",
        src: "https://assets.aceternity.com/demos/metallica.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                (<p>Metallica, an iconic American heavy metal band, is renowned for their
                    powerful sound and intense performances that resonate deeply with
                    their audience. Formed in Los Angeles, California, they have become a
                    cultural icon in the heavy metal music industry. <br /> <br />Their
                    songs often reflect themes of aggression, social issues, and personal
                    struggles, capturing the essence of the heavy metal genre. With a
                    career spanning over four decades, Metallica has released numerous hit
                    albums and singles that have garnered them a massive fan following
                    both in the United States and abroad.
                </p>)
            );
        },
    },
    {
        description: "Led Zeppelin",
        title: "Stairway To Heaven",
        src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                (<p>Led Zeppelin, a legendary British rock band, is renowned for their
                    innovative sound and profound impact on the music industry. Formed in
                    London in 1968, they have become a cultural icon in the rock music
                    world. <br /> <br />Their songs often reflect a blend of blues, hard
                    rock, and folk music, capturing the essence of the 1970s rock era.
                    With a career spanning over a decade, Led Zeppelin has released
                    numerous hit albums and singles that have garnered them a massive fan
                    following both in the United Kingdom and abroad.
                </p>)
            );
        },
    },
    {
        description: "Mustafa Zahid",
        title: "Toh Phir Aao",
        src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
        ctaText: "Play",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                (<p>"Aawarapan", a Bollywood movie starring Emraan Hashmi, is
                    renowned for its intense storyline and powerful performances. Directed
                    by Mohit Suri, the film has become a significant work in the Indian
                    film industry. <br /> <br />The movie explores themes of love,
                    redemption, and sacrifice, capturing the essence of human emotions and
                    relationships. With a gripping narrative and memorable music,
                    "Aawarapan" has garnered a massive fan following both in
                    India and abroad, solidifying Emraan Hashmi's status as a
                    versatile actor.
                </p>)
            );
        },
    },
];


export default Home