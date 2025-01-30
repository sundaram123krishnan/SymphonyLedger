"use client"
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Artists() {
  const [artist, setArtist] = useState([])

  useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("/api/artists");
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const data = await response.json();
      setArtist(data);
    };

    fetchAlbums();
  }, []);

  return (
    <main className="px-10 pt-3">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
        All Artists
      </h3>

      <ul className="mx-auto max-w-full gap-4 grid grid-cols-5">
        {artist.length > 0 && artist.map((card, index) => (
          <motion.div
            key={index}
            className="p-4 flex flex-col md:flex-row justify-center items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
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
  );
}
