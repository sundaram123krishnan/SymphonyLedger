import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const artists = await prisma.artist.findMany({
            include: {
                user: { select: { name: true, image: true } },
                songs: {
                    select: {
                        SongFeedback: { select: { type: true } },
                    },
                },
            },
        });

        const formattedArtists = artists.map((artist) => ({
            name: artist.user.name,
            image: artist.user.image,
        }));

        return NextResponse.json(formattedArtists);
    } catch (error) {
        console.error("Error fetching artists:", error);
        return NextResponse.json({ error: "Failed to fetch artists." }, { status: 500 });
    }
}
