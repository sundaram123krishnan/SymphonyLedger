"use client";
import SongNFT from "@/../../blockchain/artifacts/contracts/SongNFT.sol/SongNFT.json";
import { ethers } from "ethers";
import { useEffect } from "react";

export default function BlockchainTestPage() {
  useEffect(() => {
    async function loadData() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum!);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          SongNFT.abi,
          provider
        );
        console.log(contract);

        const totalSupply = await contract.getNextTokenId();
        let songs = [];

        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
          const exists = await contract.songExists(tokenId);
          if (!exists) continue; // Skip non-existing songs

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
      } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
      }
    }
    loadData().then((v) => console.log(v));
  }, []);

  return <></>;
}
