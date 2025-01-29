"use client";

import { useParams } from "next/navigation";
import AudioPlayer from "./audio-player";

export default function Song() {
  const params = useParams<{ songId: string }>();

  return (
    <>
      <AudioPlayer tokenId={parseInt(params.songId)} />
    </>
  );
}
