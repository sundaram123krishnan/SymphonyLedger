"use client";
import { useContract } from "@/hooks/use-contract";
import { ethers } from "ethers";
import { useEffect } from "react";

export default function BlockchainTestPage() {
  const contract = useContract();

  useEffect(() => {
    async function loadData() {
      if (!contract) return;

      const totalSupply = await contract.getNextTokenId();
      let songs = [];

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const exists = await contract.songExists(tokenId);
        if (!exists) continue;

        const [title, artist, ipfsHash, mintPrice] =
          await contract.getSongMetadata(tokenId);

        songs.push({
          tokenId,
          title,
          artist,
          ipfsHash,
          mintPrice: ethers.utils.formatEther(mintPrice),
          metadataUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
        });
      }

      return songs;
    }
    loadData().then((v) => console.log(v));
  }, [contract]);

  return <></>;
}
