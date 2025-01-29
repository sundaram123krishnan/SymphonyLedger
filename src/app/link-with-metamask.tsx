"use client";

import { useEffect } from "react";
import { ethers } from "ethers";
import { useSession } from "@/lib/auth-client";
import { linkWithMetamask } from "./actions";
import { toast } from "@/hooks/use-toast";

export function LinkWithMetamask() {
  const session = useSession();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request!({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const userAddress = await signer.getAddress();
        return userAddress;
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  useEffect(() => {
    connectWallet().then(async (address) => {
      if (!session || !address) return;
      linkWithMetamask(address).then((r) => {
        if (r) toast({ title: "Connected wallet successfully!" });
      });
    });
  }, [session]);

  return null;
}
