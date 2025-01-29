"use client";
import { TypographyH2 } from "@/components/typography/H2";

import dynamic from "next/dynamic";
import Mapper from "@/components/Map";
import { ArtistTable } from "./artist-table";
// const LazyMap = dynamic(() => import("@/components/Map"), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });

export default function HeatMaps() {
  return (
    <div>
      <TypographyH2>Heat Maps</TypographyH2>
      <div className="flex justify-center gap-2">
        <ArtistTable />
        <Mapper />
      </div>
    </div>
  );
}
