"use server"

import prisma from "@/lib/prisma";

const addAlbum = async (session: any, name: string, image: string) => {
    try {
        if (!session?.user?.id) {
            throw new Error("User session is invalid or missing.");
        }

        // Fetch artist metamaskAddress
        const artist = await prisma.artist.findUnique({
            where: { userId: session.user.id },
            select: { metamaskAddress: true },
        });

        if (!artist) {
            throw new Error("Artist not found for this user.");
        }

        // Create album
        await prisma.album.create({
            data: {
                name,
                image: image,
                artistMetamaskAddress: artist.metamaskAddress,
            },
        });

        return {
            name,
            imageUrl: image,
        };
    } catch (error) {
        console.error("Error creating album:", error);
        throw new Error("Failed to create album.");
    }
};

export { addAlbum }