"use server";

import prisma from "@/lib/prisma";
import { Song } from "@prisma/client";

export async function CreatePlaylist(
  session: any,
  name: string,
  description: string,
  songIds: string[]
) {
  try {
    if (!session) {
      throw new Error("User session is invalid or missing.");
    }

    // Create the playlist and connect songs
    await prisma.playlist.create({
      data: {
        userId: session.user.id,
        name,
        description,
        songId: songIds,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error creating playlist");
  }
}
