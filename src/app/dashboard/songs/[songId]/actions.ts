"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FeedbackEnum } from "@prisma/client";

export async function addSongListen(tokenId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  const song = await prisma.song.findFirstOrThrow({
    where: { tokenId },
    include: {
      SongRights: { where: { userId: session.user.id } },
      artist: { include: { user: true } },
      SongFeedback: { where: { userId: session.user.id } },
    },
  });

  const songData = await prisma.song.findUniqueOrThrow({
    where: { tokenId },
    include: { _count: { select: { SongListen: true } }, SongFeedback: true },
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
    return {
      metaIpfsLink: song.metaIpfs,
      streamLeft: song.SongRights[0].streamsLeft - 1,
      picture: song.artist.user.image,
      feedbackType: song.SongFeedback.at(0)?.type ?? "Neutral",
      views: songData._count.SongListen,
      likes: songData.SongFeedback.filter((f) => f.type === "Like").length,
    };
  }
  return null;
}

export async function addSongRights(tokenId: number, streams: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  await prisma.songRights.create({
    data: {
      userId: session.user.id,
      songTokenId: tokenId,
      streamsLeft: streams,
    },
  });
}

export async function addSongFeedback(tokenId: number, feedback: FeedbackEnum) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  await prisma.songFeedback.upsert({
    create: { tokenId, type: feedback, userId: session.user.id },
    update: { tokenId, type: feedback, userId: session.user.id },
    where: { userId_tokenId: { userId: session.user.id, tokenId } },
  });
}
