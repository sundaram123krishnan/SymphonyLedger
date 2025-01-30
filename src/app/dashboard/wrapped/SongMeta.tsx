"use client";

import { useEffect, useState } from "react";

export function SongMeta({ metaIpfs }: { metaIpfs: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metadata, setMetadata] = useState<any | undefined>();

  useEffect(() => {
    async function getMeta() {
      const response = await fetch(`https://ipfs.io/ipfs/${metaIpfs}`);
      const metadata = await response.json();
      console.log(metadata);
      setMetadata(metadata);
    }
    getMeta();
  }, [metaIpfs]);

  return (
    <span className="truncate max-w-12">
      {metadata?.title}
    </span>
  );
}
