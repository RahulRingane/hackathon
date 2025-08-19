"use client";

import React, { useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Card } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// ✅ Supported Judge0 languages
const languages = [
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 50, name: "C (GCC 9.2.0)" },
  { id: 68, name: "PHP (7.4.1)" },
];

export default function IDELayout({
  code,
  setCode,
  output,
  setOutput,
  sendCodeToRun,
  sendCodeToAnalyze,
}: any) {
  const [activeTab, setActiveTab] = useState<"editor" | "canvas">("editor");
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const editorRef = useRef<any>(null);

  // ✅ get both editor + monaco instance
  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;

    // capture changes in code
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });

    // capture key events
    editor.onKeyDown((e: any) => {
      if (e.keyCode === monaco.KeyCode.Backspace) {
        console.log("⌫ Backspace pressed");
        sendCodeToAnalyze(selectedLang.id, "backspace");
      }

      if (e.keyCode === monaco.KeyCode.Enter && !e.ctrlKey) {
        console.log("⏎ Enter pressed");
      }

      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Enter) {
        console.log("🚀 Ctrl + Enter pressed → Run code");
        sendCodeToRun(selectedLang.id);
        e.preventDefault();
      }

      if (e.ctrlKey && e.keyCode === monaco.KeyCode.KeyS) {
        console.log("💾 Ctrl + S pressed → Save code");
        e.preventDefault();
        // socket.emit("save", editor.getValue()); // example
      }
    });
  }

  return (
    <div className="h-full w-full bg-slate-900 text-white flex flex-col">
      {/* Top Bar */}
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

        <div className="ml-auto flex items-center gap-2">
          {/* Run Button */}
          <button
            className="px-3 py-1 rounded bg-green-600"
            onClick={() => {
              sendCodeToRun(selectedLang.id);
            }}
          >
            ▶ Run
          </button>

          {/* Dropdown for Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-white border-gray-600"
              >
                {selectedLang.name} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 text-white">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.id}
                  onClick={() => setSelectedLang(lang)}
                  className="hover:bg-slate-700 cursor-pointer"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Panels */}
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={40}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={40}>
              <Card className="h-full bg-slate-950 p-2 flex flex-col">
                {activeTab === "editor" ? (
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onMount={handleEditorDidMount} // ✅ gives editor + monaco
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

            <Panel defaultSize={30} minSize={20}>
              <Card className="h-full bg-black text-green-400 p-2 font-mono overflow-auto">
                {output || "Output will appear here..."}
              </Card>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-500 cursor-col-resize" />

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
