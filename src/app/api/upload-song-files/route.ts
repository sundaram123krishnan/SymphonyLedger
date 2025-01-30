import { PinataSDK } from "pinata-web3";
import { parseBlob } from "music-metadata";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "coral-bizarre-mongoose-422.mypinata.cloud",
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const artists = formData.get("artists") as string;
    const file = formData.get("file") as File;
    const genre = formData.get("genre") as string;
    const tokenId = Number(formData.get("tokenId"));

    if (!file || !title || !artists) {
      return new Response("Missing required fields", { status: 400 });
    }

    const songFileResult = await pinata.upload.file(file);
    const songFileCID = songFileResult.IpfsHash;
    const blob = await parseBlob(new Blob([file], { type: file.type }));

    const metadata = {
      songFile: songFileCID,
      genre,
      title,
      artists,
      duration: blob.format.duration,
    };
    const metadataResult = await pinata.upload.json(metadata);
    const metadataCID = metadataResult.IpfsHash;

    const artist = await prisma.artist.findFirstOrThrow({
      where: { userId: session?.user.id },
    });
    await prisma.song.create({
      data: {
        metaIpfs: metadataCID,
        songIpfs: songFileCID,
        artistMetamaskAddress: artist.metamaskAddress,
        tokenId,
      },
    });

    return new Response(
      JSON.stringify({
        metadataCID,
        songCID: songFileCID,
        message: "Files uploaded successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading to Pinata:", error.stack);
    }
    return new Response("Failed to upload song to Pinata", { status: 500 });
  }
}
