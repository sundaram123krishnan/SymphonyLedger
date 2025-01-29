"use client";

import { useEffect, useRef, useState } from "react";
import Meyda from "meyda";
import { TypographyH2 } from "@/components/typography/H2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function AudioAnalyzer() {
  const audioRef1 = useRef(null);
  const audioRef2 = useRef(null);
  const [rms1, setRms1] = useState(0);
  const [rms2, setRms2] = useState(0);
  const [similarity, setSimilarity] = useState(0);
  const [rmsData1, setRmsData1] = useState<{ time: number; rms: number }[]>([]);
  const [rmsData2, setRmsData2] = useState<{ time: number; rms: number }[]>([]);

  useEffect(() => {
    if (!audioRef1.current || !audioRef2.current) return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source1 = audioContext.createMediaElementSource(audioRef1.current);
    const source2 = audioContext.createMediaElementSource(audioRef2.current);
    source1.connect(audioContext.destination);
    source2.connect(audioContext.destination);

    if (typeof Meyda === "undefined") {
      console.error("Meyda could not be found! Make sure it's installed.");
      return;
    }

    const startTime = Date.now();

    const analyzer1 = Meyda.createMeydaAnalyzer({
      audioContext,
      source: source1,
      bufferSize: 512,
      featureExtractors: ["rms"],
      callback: (features) => {
        const newRms = features.rms;
        setRms1(newRms);
        setRmsData1((prevData) => [
          ...prevData.slice(-100),
          { time: (Date.now() - startTime) / 1000, rms: newRms },
        ]);
      },
    });

    const analyzer2 = Meyda.createMeydaAnalyzer({
      audioContext,
      source: source2,
      bufferSize: 512,
      featureExtractors: ["rms"],
      callback: (features) => {
        const newRms = features.rms;
        setRms2(newRms);
        setRmsData2((prevData) => [
          ...prevData.slice(-100),
          { time: (Date.now() - startTime) / 1000, rms: newRms },
        ]);
      },
    });

    analyzer1.start();
    analyzer2.start();

    return () => {
      analyzer1.stop();
      analyzer2.stop();
      audioContext.close();
    };
  }, []);

  useEffect(() => {
    if (rms1 > 0 && rms2 > 0) {
      setSimilarity(1 - Math.abs(rms1 - rms2));
    }
  }, [rms1, rms2]);

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Audio Plagiarism</TypographyH2>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Audio Plagiarism Analysis</CardTitle>
          <CardDescription>
            Compare two audio samples for similarity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <audio
              ref={audioRef1}
              controls
              loop
              crossOrigin="anonymous"
              src="https://cdn.glitch.com/184ed7fc-13aa-4fdc-98ca-8683b9a5d877%2F9579__tictacshutup__sold-break-8-bars.wav?1537042752804"
              className="w-full"
            />
            <div className="space-y-2">
              <label htmlFor="level1" className="text-sm font-medium">
                Level 1
              </label>
              <Slider
                id="levelRange1"
                min={0}
                max={1}
                step={0.001}
                value={[rms1]}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                RMS Level 1: {rms1.toFixed(3)}
              </p>
            </div>
            <ChartContainer
              config={{
                rms: {
                  label: "RMS",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rmsData1}>
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis domain={[0, 1]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rms"
                    stroke="var(--color-rms)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-4">
            <audio
              ref={audioRef2}
              controls
              loop
              crossOrigin="anonymous"
              src="https://cdn.glitch.com/184ed7fc-13aa-4fdc-98ca-8683b9a5d877%2F9579__tictacshutup__sold-break-8-bars.wav?1537042752804"
              className="w-full"
            />
            <div className="space-y-2">
              <label htmlFor="level2" className="text-sm font-medium">
                Level 2
              </label>
              <Slider
                id="levelRange2"
                min={0}
                max={1}
                step={0.001}
                value={[rms2]}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                RMS Level 2: {rms2.toFixed(3)}
              </p>
            </div>
            <ChartContainer
              config={{
                rms: {
                  label: "RMS",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rmsData2}>
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis domain={[0, 1]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="rms"
                    stroke="var(--color-rms)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center">
            <h3 className="text-lg font-semibold text-primary">
              Similarity Score: {similarity.toFixed(3)}
            </h3>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
