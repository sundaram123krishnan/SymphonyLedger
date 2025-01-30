import { TypographyH2 } from "@/components/typography/H2";
import prisma from "@/lib/prisma";
import { SongRow } from "../profile/SongRow";

export default async function Leaderboard() {
  const songs = await prisma.song.findMany({
    orderBy: { SongListen: { _count: "desc" } },
    include: { _count: { select: { SongListen: true } } },
  });

  return (
    <div className="p-6 rounded-lg shadow-md transition-colors duration-200 bg-white dark:bg-background flex flex-col justify-center items-center">
      <TypographyH2>Leaderboard</TypographyH2>

      <ul className="space-y-4 w-1/2 mt-4">
        {songs.map((song) => (
          <SongRow
            song={song}
            key={song.tokenId}
            views={song._count.SongListen}
          />
        ))}
      </ul>
    </div>
  );
}
