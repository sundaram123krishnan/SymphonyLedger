"use client"; // Enables client-side rendering for this component

import SongNFT from "@/../blockchain/artifacts/contracts/SongNFT.sol/SongNFT.json";
import { TypographyH2 } from "@/components/typography/H2";
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Import custom Card components
import { Progress } from "@/components/ui/progress"; // Import custom Progress component
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { parseEther } from "ethers/src.ts/utils";
import { Eye, PauseIcon, PlayIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import icons from lucide-react
import Image from "next/image"; // Import Next.js Image component
import { useEffect, useRef, useState } from "react"; // Import React hooks
import { addSongFeedback, addSongListen, addSongRights } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackEnum } from "@prisma/client";
import { redirect } from "next/navigation";

export function AudioPlayer({ tokenId }: { tokenId: number }) {
  const [stakeholders, setStakeholders] = useState<
    { address: string; percent: number }[]
  >([]);
  const [canStream, setCanStream] = useState<boolean | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to manage the play/pause status
  const [progress, setProgress] = useState<number>(0); // State to manage the progress of the current track
  const [currentTime, setCurrentTime] = useState<number>(0); // State to manage the current time of the track
  const [duration, setDuration] = useState<number>(0); // State to manage the duration of the track
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metadata, setMetadata] = useState<any | undefined>();
  const [picture, setPicture] = useState("");
  const [feedback, setFeedback] = useState<FeedbackEnum>();
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to manage the audio element

  useEffect(() => {
    async function hasMintedSong() {
      if (!window.ethereum) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request!({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const songNFT = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        SongNFT.abi,
        signer
      );

      try {
        const owner = await songNFT.ownerOf(tokenId);
        setMetadata(await songNFT.getSongMetadata(tokenId));
        const stakeholders = await songNFT.getStakeholders(tokenId);
        setStakeholders(
          stakeholders.addresses.map((address: string, idx: number) => ({
            address,
            percent: Number(stakeholders.shares[idx]) / 100,
          }))
        );
        return owner.toLowerCase() === userAddress.toLowerCase();
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    hasMintedSong().then(async (v) => {
      console.log(v);
      if (!v) {
        setCanStream(false);
      }
      const response = await addSongListen(tokenId);
      const { metaIpfsLink, streamLeft, picture, feedbackType, likes, views } =
        response;
      setViews(views);
      setLikes(likes);
      setCanStream(v && streamLeft > 0);
      setPicture(picture ?? "");
      setFeedback(feedbackType);
      fetchTrackFromIPFS(metaIpfsLink);
      if (streamLeft !== -1)
        toast({
          title: "Consumed a stream",
          description: `${streamLeft} streams left`,
        });
    });
  }, [tokenId]);

  if (canStream === undefined) {
    return (
      <>
        <TypographyH2>Audio player</TypographyH2>
        <Skeleton className="w-full h-48" />
      </>
    );
  }

  async function fetchTrackFromIPFS(ipfsFileLink: string) {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsFileLink}`);
    const metadata = await response.json();
    setMetadata(metadata);

    if (audioRef.current) {
      const response = await fetch(`https://ipfs.io/ipfs/${metadata.songFile}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current.src = url;
      audioRef.current.load();
    }
  }

  // Function to handle play/pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Function to handle time update of the track
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  // Function to handle metadata load of the track
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Function to format time in minutes and seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  async function mintSong(price: string) {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request!({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      SongNFT.abi,
      signer
    );
    const tx = await contract!.mintSong(tokenId, {
      value: parseEther(price),
    });

    addSongRights(tokenId, Number(price) * 100);
    await tx.wait();
    redirect("/dashboard/songs");
  }

  const onLike = () => {
    if (feedback === "Like") {
      setLikes(likes - 1);
      addSongFeedback(tokenId, "Neutral");
      setFeedback("Neutral");
      return;
    }
    setLikes(likes + 1);
    addSongFeedback(tokenId, "Like");
    setFeedback("Like");
  };

  const onDislike = () => {
    if (feedback === "Dislike") {
      addSongFeedback(tokenId, "Neutral");
      setFeedback("Neutral");
      return;
    } else if (feedback === "Like") {
      setLikes(likes - 1);
    }
    addSongFeedback(tokenId, "Dislike");
    setFeedback("Dislike");
  };

  if (!canStream) {
    toast({ title: "You don't have rights to play this song." });

    return (
      <>
        <div className="pb-5">
          <TypographyH2>Audio Player</TypographyH2>
        </div>

        <div className="grid grid-cols-2 space-x-10">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex justify-between items-center gap-6 py-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                <Image
                  src={picture}
                  alt="Album Cover"
                  layout="fill"
                  className="animate-pulse"
                />
              </div>

              <div className="flex items-center gap-2 flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 rounded-full px-10"
                >
                  <div className="flex justify-between items-center gap-2 text-black dark:text-white">
                    <ThumbsUp className="w-8 h-8" />
                    {likes}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 rounded-full px-10"
                >
                  <div className="flex justify-between items-center gap-2 text-black dark:text-white">
                    <Eye className="w-8 h-8" />
                    {views}
                  </div>
                </Button>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold mb-1 text-black dark:text-white">
                  {metadata?.title || "Song Title"}
                </h2>
                <p className="text-white/70 max-w-24 truncate">
                  {metadata?.artist || "Artist Name"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 max-w-sm justify-center">
            <Button variant="secondary" onClick={() => mintSong("0.1")}>
              Purchase 10 streams
            </Button>
            <Button onClick={() => mintSong("0.8")}>
              Purchase 100 streams
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col text-black dark:text-white p-4">
      <div className="max-w-md w-full mx-auto space-y-4">
        <div className="pb-5">
          <TypographyH2>Audio Player</TypographyH2>
        </div>
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src={picture}
                alt="Album Cover"
                layout="fill"
                objectFit="cover"
                className="animate-pulse"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1 text-black dark:text-white">
                {metadata?.title}
              </h2>
              <p className="text-white/70">{metadata?.artist}</p>
            </div>
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-6 w-full">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 rounded-full px-10"
              >
                <div className="flex justify-between items-center gap-2 text-black dark:text-white">
                  <Eye className="w-8 h-8" />
                  {views}
                </div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="bg-white/20 transition-colors rounded-full"
              >
                {isPlaying ? (
                  <PauseIcon className="w-12 h-12 text-black dark:text-white" />
                ) : (
                  <PlayIcon className="w-12 h-12 text-black dark:text-white" />
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 rounded-full px-10"
                >
                  <div
                    className="flex justify-between items-center gap-2 text-black dark:text-white"
                    onClick={onLike}
                  >
                    <ThumbsUp className="w-8 h-8" />
                    {likes}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDislike}
                  className="bg-white/20 rounded-full px-7"
                >
                  <ThumbsDown className="w-8 h-8 text-black dark:text-white" />
                </Button>
              </div>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            ></audio>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">Show stakeholders</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Stakeholders list</DialogTitle>
                  <DialogDescription>{metadata?.title}</DialogDescription>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stakeholders.map((stakeholder, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {stakeholder.address}
                        </TableCell>
                        <TableCell>{stakeholder.percent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AudioPlayer;
