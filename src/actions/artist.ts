"use server"
import prisma from "@/lib/prisma";

const fetch_artist = async (artist_address) => {
    const artist = await prisma.artist.findUnique({
        where: { metamaskAddress: artist_address },
        include: { user: true },
    });

    return artist?.user.name;
}

export default fetch_artist