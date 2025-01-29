"use client";

import { useContract } from "@/hooks/use-contract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { SongRow } from "./SongRow";

export type Song = {
  title: string;
  artist: string;
  ipfsHash: string;
  metadataUrl: string;
  tokenId: number;
  mintPrice: string;
};

export function SongsTable() {
  const contract = useContract();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function getAllSongs() {
      if (!contract) return;

      const totalSupply = await contract.getNextTokenId();

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const exists = await contract.songExists(tokenId);
        if (!exists) continue;

        const [title, artist, ipfsHash, metadataURI, mintPrice] =
          await contract.getSongMetadata(tokenId);

        setSongs((prev) => [
          ...prev,
          {
            tokenId,
            title,
            artist,
            ipfsHash,
            mintPrice: ethers.utils.formatEther(mintPrice),
            metadataUrl: `https://ipfs.io/ipfs/${metadataURI}`,
          },
        ]);
      }
    }
    getAllSongs();
  }, [contract]);

  return (
    <div className="bg-white dark:bg-background shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {songs.map((song) => (
          <SongRow song={song} key={song.tokenId} />
        ))}
      </ul>
    </div>
  );
}
