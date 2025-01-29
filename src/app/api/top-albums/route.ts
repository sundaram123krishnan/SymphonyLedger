import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            include: {
                artist: {
                    select: {
                        user: { select: { name: true, image: true } },
                    },
                },
                songs: {
                    select: {
                        likes: true,
                    },
                },
            },
        });

        const rankedAlbums = albums
            .map((album) => {
                const totalLikes = album.songs.reduce((sum, song) => sum + song.likes, 0);

                return {
                    name: album.name,
                    artistName: album.artist.user.name,
                    artistImage: album.artist.user.image,
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
