"use client";

import { useEffect, useRef, useState } from "react";
import Meyda from "meyda";
import { TypographyH2 } from "@/components/typography/H2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ethers } from "ethers";
import { useContract } from "@/hooks/use-contract";

export type Song = {
  title: string;
  artist: string;
  ipfsHash: string;
  metadataUrl: string;
  tokenId: number;
  mintPrice: string;
};

export default function AudioAnalyzer() {
  const audioRefs = useRef([]);
  const [rmsLevels, setRmsLevels] = useState([0, 0, 0]);
  const [similarityScores, setSimilarityScores] = useState([0, 0, 0]);
  const contract = useContract();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function getAllSongs() {
      if (!contract) return;

      const totalSupply = await contract.getNextTokenId();
      const newSongs: Song[] = [];

      for (
        let tokenId = 0;
        tokenId < totalSupply && newSongs.length < 3;
        tokenId++
      ) {
        const exists = await contract.songExists(tokenId);
        if (!exists) continue;

        const [title, artist, ipfsHash, metadataURI, mintPrice] =
          await contract.getSongMetadata(tokenId);

        newSongs.push({
          tokenId,
          title,
          artist,
          ipfsHash,
          mintPrice: ethers.utils.formatEther(mintPrice),
          metadataUrl: `https://ipfs.io/ipfs/${metadataURI}`,
        });
      }

      setSongs(newSongs);
    }
    getAllSongs();
  }, [contract]);

  useEffect(() => {
    if (songs.length < 3) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const sources = songs.map((_, index) =>
      audioContext.createMediaElementSource(audioRefs.current[index])
    );

    sources.forEach((source) => source.connect(audioContext.destination));

    if (typeof Meyda === "undefined") {
      console.error("Meyda could not be found! Make sure it's installed.");
      return;
    }

    const startTime = Date.now();
    const analyzers = songs.map((_, index) =>
      Meyda.createMeydaAnalyzer({
        audioContext,
        source: sources[index],
        bufferSize: 512,
        featureExtractors: ["rms"],
        callback: (features) => {
          setRmsLevels((prev) => {
            const newRms = [...prev];
            newRms[index] = features.rms;
            return newRms;
          });
        },
      })
    );

    analyzers.forEach((analyzer) => analyzer.start());

    return () => {
      analyzers.forEach((analyzer) => analyzer.stop());
      audioContext.close();
    };
  }, [songs]);

  useEffect(() => {
    if (rmsLevels.every((rms) => rms > 0)) {
      setSimilarityScores([
        1 - Math.abs(rmsLevels[0] - rmsLevels[1]),
        1 - Math.abs(rmsLevels[1] - rmsLevels[2]),
        1 - Math.abs(rmsLevels[0] - rmsLevels[2]),
      ]);
    }
  }, [rmsLevels]);

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Audio Plagiarism</TypographyH2>
      {songs.map((song, index) => (
        <Card className="w-full max-w-3xl" key={index}>
          <CardHeader>
            <CardTitle>
              {song.title} - {song.artist}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                controls
                loop
                crossOrigin="anonymous"
                src={`https://ipfs.io/ipfs/${song.ipfsHash}`}
                className="w-full"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  RMS Level {index + 1}
                </label>
                <Slider
                  min={0}
                  max={1}
                  step={0.001}
                  value={[rmsLevels[index]]}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  RMS Level: {rmsLevels[index].toFixed(3)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <h3 className="text-lg font-semibold text-primary">
                Similarity Scores:{" "}
                {similarityScores.map((score) => score.toFixed(3)).join(", ")}
              </h3>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
