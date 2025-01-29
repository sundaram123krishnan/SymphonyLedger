"use client"; // Enables client-side rendering for this component

import React, { useState, useRef, useEffect } from "react"; // Import React hooks
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card, CardContent } from "@/components/ui/card"; // Import custom Card components
import { Progress } from "@/components/ui/progress"; // Import custom Progress component
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
} from "lucide-react"; // Import icons from lucide-react
import Image from "next/image"; // Import Next.js Image component
import { Input } from "@/components/ui/input";
import { TypographyH2 } from "@/components/typography/H2";

// Define types for the component props and state
interface AudioPlayerProps {}

// Define the Track interface
interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]); // State to manage the list of tracks
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0); // State to manage the current track index
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to manage the play/pause status
  const [progress, setProgress] = useState<number>(0); // State to manage the progress of the current track
  const [currentTime, setCurrentTime] = useState<number>(0); // State to manage the current time of the track
  const [duration, setDuration] = useState<number>(0); // State to manage the duration of the track
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to manage the audio element

  // Function to handle file upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

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

  // Function to handle next track
  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  // Function to handle previous track
  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
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

  // useEffect to handle track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0); // Reset the current time for the new track
      setProgress(0); // Reset the progress for the new track
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  // JSX return statement rendering the Audio Player UI
  return (
    <div className="flex flex-col text-white p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <TypographyH2>Audio Player</TypographyH2>
          <label className="flex items-center cursor-pointer bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2">
            <UploadIcon className="w-5 h-5 mr-2" />
            <span>Upload</span>
            <Input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <Image
                src="/music.svg"
                alt="Album Cover"
                layout="fill"
                objectFit="cover"
                className="animate-pulse"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-white/70">
                {tracks[currentTrackIndex]?.artist || "Person Name"}
              </p>
            </div>
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevTrack}
                className="hover:bg-white/20 transition-colors"
              >
                <RewindIcon className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-12 h-12" />
                ) : (
                  <PlayIcon className="w-12 h-12" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextTrack}
                className="hover:bg-white/20 transition-colors"
              >
                <ForwardIcon className="w-8 h-8" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              src={tracks[currentTrackIndex]?.src}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioPlayer;
