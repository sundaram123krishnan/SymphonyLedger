import { TypographyH2 } from "@/components/typography/H2";
import { SongsTable } from "./SongsTable";
import { Suspense } from "react";

export default function SongsPage() {
  return (
    <>
      <TypographyH2>Songs</TypographyH2>
      <Suspense>
        <SongsTable />
      </Suspense>
    </>
  );
}
