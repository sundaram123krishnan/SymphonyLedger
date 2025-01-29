import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topArtists = await prisma.artist.findMany({
            include: {
                user: { select: { name: true, image: true } },
                songs: { select: { likes: true, dislikes: true } },
            },
        });

        const rankedArtists = topArtists
            .map((artist) => ({
                name: artist.user.name,
                image: artist.user.image,
                score: artist.songs.reduce((sum, song) => sum + song.likes, 0) -
                    artist.songs.reduce((sum, song) => sum + song.dislikes, 0),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return NextResponse.json(rankedArtists);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
