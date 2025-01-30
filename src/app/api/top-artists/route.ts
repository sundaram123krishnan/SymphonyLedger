import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topArtists = await prisma.artist.findMany({
            include: {
                user: { select: { name: true, image: true } },
                songs: {
                    select: {
                        SongFeedback: { select: { type: true } },
                    },
                },
            },
        });

        const rankedArtists = topArtists
            .map((artist) => {
                const likes = artist.songs.flatMap(song =>
                    song.SongFeedback.filter(fb => fb.type === "Like")
                ).length;

                const dislikes = artist.songs.flatMap(song =>
                    song.SongFeedback.filter(fb => fb.type === "Dislike")
                ).length;

                return {
                    name: artist.user.name,
                    image: artist.user.image ?? "",
                    score: likes - dislikes,
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return NextResponse.json(rankedArtists);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
    }
}
