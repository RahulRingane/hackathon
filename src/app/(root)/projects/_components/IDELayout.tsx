"use client";

import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function IDELayout({ code, setCode }: any) {
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "canvas">("editor");

  return (
    <div className="h-full w-full bg-slate-900 text-white flex flex-col">
      {/* 🔘 Top Bar with buttons */}
      <div className="flex gap-2 p-2 bg-slate-800 border-b border-gray-700">
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "editor" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "canvas" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("canvas")}
        >
          Canvas
        </button>
        <button className="px-3 py-1 rounded bg-green-600 ml-auto">
          ▶ Run
        </button>
        <button className="px-3 py-1 rounded bg-green-600">
          ▶ Analyze your code
        </button>
      </div>

      {/* Main Panels */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* LEFT SIDE → Editor/Canvas + Output */}
        <Panel defaultSize={70} minSize={40}>
          <PanelGroup direction="vertical">
            {/* Editor / Canvas */}
            <Panel defaultSize={70} minSize={40}>
              <Card className="h-full bg-slate-950 p-2 flex flex-col">
                {activeTab === "editor" ? (
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                  />
                ) : (
                  <ReactSketchCanvas
                    style={{
                      border: "1px solid #fff",
                      borderRadius: "8px",
                      width: "100%",
                      height: "100%",
                    }}
                    strokeWidth={3}
                    strokeColor="white"
                    canvasColor="#111"
                  />
                )}
              </Card>
            </Panel>

            <PanelResizeHandle className="h-2 bg-gray-700 hover:bg-gray-500 cursor-row-resize" />

            {/* Output Panel BELOW Editor */}
            <Panel defaultSize={30} minSize={20}>
              <Card className="h-full bg-black text-green-400 p-2 font-mono overflow-auto">
                {output || "Output will appear here..."}
              </Card>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-500 cursor-col-resize" />

        {/* RIGHT SIDE → Suggestions / Bot */}
        <Panel defaultSize={30} minSize={20}>
          <Card className="h-full bg-slate-950 p-4">
            <h2 className="text-lg font-bold mb-2">🤖 Suggestions</h2>
            <div className="h-full flex items-center justify-center text-gray-500">
              (Future Sentiment Analysis / Improvements UI)
            </div>
          </Card>
        </Panel>
      </PanelGroup>
    </div>
  );
}
