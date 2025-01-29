import { PinataSDK } from "pinata-web3";
import { parseBlob } from "music-metadata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "coral-bizarre-mongoose-422.mypinata.cloud",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const artists = formData.get("artists") as string;
    const file = formData.get("file") as File;
    const genre = formData.get("genre") as string;

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

    return new Response(
      JSON.stringify({
        metadataCID,
        songCID: songFileCID,
        message: "Files uploaded successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return new Response("Failed to upload song to Pinata", { status: 500 });
  }
}
