import SongNFT from "@/../blockchain/artifacts/contracts/SongNFT.sol/SongNFT.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export function useContract() {
  const [contract, setContract] = useState<ethers.Contract>();

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum!);
    setContract(
      new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        SongNFT.abi,
        provider
      )
    );
  }, []);

  return contract;
}
