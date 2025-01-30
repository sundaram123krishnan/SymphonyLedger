import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            select: {
                name: true,
                image: true,
                artist: {
                    select: {
                        user: { select: { name: true } },
                    },
                },
                songs: {
                    select: {
                        SongFeedback: { select: { type: true } },
                    },
                },
            },
        });

        const rankedAlbums = albums
            .map((album) => {
                const totalLikes = album.songs?.flatMap(song =>
                    song.SongFeedback.filter(fb => fb.type === "Like")
                ).length ?? 0;

                return {
                    name: album.name,
                    albumImage: album.image,
                    artistName: album.artist?.user?.name ?? "Unknown",
                    totalLikes,
                };
            })
            .sort((a, b) => b.totalLikes - a.totalLikes)
            .slice(0, 5);

        return NextResponse.json(rankedAlbums);
    } catch (error) {
        console.error("Error fetching albums:", error);
        return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
    }
}
