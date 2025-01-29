"use client";

import SongNFT from "@/../blockchain/artifacts/contracts/SongNFT.sol/SongNFT.json";
import { FileUpload } from "@/components/file-upload";
import { TypographyH2 } from "@/components/typography/H2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { parseEther } from "ethers/src.ts/utils";
import { LoaderCircle, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export default function StakeholderPage() {
  const { toast } = useToast();
  const [stakeholders, setStakeholders] = useState<
    {
      address: string;
      percent: number;
    }[]
  >([]);
  const [address, setAddress] = useState("");
  const [percent, setPercent] = useState(0.0);
  const [title, setTitle] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSongFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setSongFile(files[0]);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!window.ethereum) return;

    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request!({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artists", address);
    if (genre) {
      formData.append("genre", genre);
    }
    if (songFile) {
      formData.append("file", songFile);
    }

    const response = await fetch("/api/upload-song-files", {
      method: "POST",
      body: formData,
    });
    const { metadataCID, songCID } = await response.json();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      SongNFT.abi,
      signer
    );
    const remainingStake =
      100 - stakeholders.reduce((stake, { percent }) => stake + percent, 0);
    if (remainingStake > 0) {
      stakeholders.push({ address, percent: remainingStake });
    }

    const tx = await contract.createSong(
      title,
      address,
      songCID,
      metadataCID,
      parseEther("0.1"),
      stakeholders.map(({ address }) => address),
      stakeholders.map(({ percent }) => percent * 100)
    );

    await tx.wait();
    toast({ title: "Song added successfully" });
    setLoading(false);
    redirect("/dashboard/songs");
  }

  function addStakeholder() {
    if (address && percent) {
      const holder = { address, percent };
      setStakeholders([...stakeholders, holder]);
      setAddress("");
      setPercent(0.0);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TypographyH2 className="mb-6">Create song</TypographyH2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Stakeholder Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StakeholderChart />
          </CardContent>
        </Card> */}
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="song-name" className="text-right">
              Song title
            </Label>
            <Input
              id="song-name"
              required
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="song-file" className="text-right">
              Song file
            </Label>
            <div className="col-span-3">
              <FileUpload onChange={handleSongFileUpload} />
              {songFile && (
                <p className="mt-2 text-sm text-gray-500">{songFile.name}</p>
              )}
            </div>
            <Label className="text-right">Genre</Label>
            <Input
              id="genre"
              type="text"
              className="w-full col-span-3"
              min={0}
              max={
                100 -
                stakeholders.reduce((stake, { percent }) => stake + percent, 0)
              }
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <Button type="submit">
            {loading ? <LoaderCircle className="animate-spin" /> : "Add"}
          </Button>
        </form>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stakeholder List</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stakeholder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Stakeholder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="percent" className="text-right">
                      Percent
                    </Label>
                    <div className="col-span-3 relative">
                      <Input
                        id="percent"
                        type="number"
                        value={percent}
                        onChange={(e) => setPercent(Number(e.target.value))}
                        className="pr-8"
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button onClick={addStakeholder}>Add Stakeholder</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  The artist owns{" "}
                  {100 -
                    stakeholders.reduce(
                      (stake, { percent }) => stake + percent,
                      0
                    )}
                  %
                </TableCaption>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
