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
            },
        });

        const formattedAlbums = albums.map((album) => ({
            id: album.albumId,
            name: album.name, // Artist name
            imageUrl: album.image || "/placeholder.svg?height=300&width=300", // Artist image
        }));

        return NextResponse.json(formattedAlbums);
    } catch (error) {
        console.error("Error fetching albums:", error);
        return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
    }
}
