"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StakeholderChart } from "./chart";
import { TypographyH2 } from "@/components/typography/H2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StakeholderPage() {
  const [stakeholders, setStakeholders] = useState<
    {
      address: string;
      percent: number;
    }[]
  >([]);
  const [address, setAddress] = useState("");
  const [percent, setPercent] = useState(0.0);

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
      <TypographyH2 className="mb-6">Stakeholder Overview</TypographyH2>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Stakeholder Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StakeholderChart />
          </CardContent>
        </Card>

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
