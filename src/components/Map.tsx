"use client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { addressPoints } from "@/app/dashboard/heatmaps/addresspoint";

export default function Mapper() {
  useEffect(() => {
    let map = L.map("map").setView([-37.87, 175.475], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const points = addressPoints
      ? addressPoints.map((p) => {
          return [p[0], p[1]];
        })
      : [];

    L.heatLayer(points).addTo(map);
  }, []);

  return <div id="map" style={{ height: "90vh", width: "70vw" }}></div>;
}
