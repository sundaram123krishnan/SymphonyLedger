"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function addSongListen(tokenId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  const song = await prisma.song.findFirstOrThrow({
    where: { tokenId },
    include: { SongRights: { where: { userId: session.user.id } } },
  });

  if (song.SongRights[0].streamsLeft) {
    await prisma.songRights.update({
      where: { id: song.SongRights[0].id },
      data: { streamsLeft: { decrement: 1 } },
    });
    await prisma.songListen.create({
      data: {
        userId: session.user.id,
        lat: 0,
        lng: 0,
        songTokenId: tokenId,
      },
    });
    return true;
  }

  return false;
}
