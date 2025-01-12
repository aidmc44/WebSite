"use client";
import React, {useEffect} from "react";
import ThreeScene from "../components/ThreeScene";

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Three.js in Next.js</h1>
      <ThreeScene />
    </div>
  );
}
