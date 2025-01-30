import { TypographyH2 } from "@/components/typography/H2";
import Mapper from "@/components/Map";
import { ArtistTable } from "./artist-table";
import { Suspense } from "react";

export default function HeatMaps() {
  return (
    <div>
      <TypographyH2>Heatmap</TypographyH2>
      <div className="flex justify-center gap-2">
        <Suspense>
          <ArtistTable />
        </Suspense>
        <Mapper />
      </div>
    </div>
  );
}
