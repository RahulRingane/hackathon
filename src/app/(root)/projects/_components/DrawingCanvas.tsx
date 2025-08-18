"use client";
import dynamic from "next/dynamic";

// const Excalidraw = dynamic(
//   async () => (await import("@excalidraw/excalidraw")).Excalidraw,
//   { ssr: false }
// );

export default function DrawingBoard() {
  return (
    <div className="h-[500px] border rounded bg-gray-900 text-white p-2">
      {/* <Excalidraw /> */}
    </div>
  );
}
