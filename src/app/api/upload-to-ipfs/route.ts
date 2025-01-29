import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { file, name, artists, subtitle } = data;

    if (!file || !name || !artists) {
      return new Response("Missing required fields", { status: 400 });
    }

    const metadata = { name, artists };

    const metadataResult = await pinata.pinJSONToIPFS(metadata);
    const metadataCID = metadataResult.IpfsHash;

    const songFileObj = new FormData();
    songFileObj.append("file", file);

    const songFileResult = await pinata.pinFileToIPFS(songFileObj);
    const songFileCID = songFileResult.IpfsHash;

    return new Response(
      JSON.stringify({
        metadataCID,
        songFileCID,
        message: "File uploaded successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return new Response("Failed to upload song to Pinata", { status: 500 });
  }
}
