"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { io } from "socket.io-client";

// ---------------- Languages ----------------
const languages = [
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 50, name: "C (GCC 9.2.0)" },
  { id: 68, name: "PHP (7.4.1)" },
];

// ---------------- Components ----------------

// ✅ Language Dropdown
function LanguageDropdown({ selectedLang, setSelectedLang }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-700 text-white border-gray-600"
        >
          {selectedLang.name}
          <ChevronDown className="ml-2 h-4 w-4" />
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
  );
}

// ✅ TopBar
function TopBar({
  activeTab,
  setActiveTab,
  selectedLang,
  setSelectedLang,
  sendCodeToRun,
}: any) {
  return (
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
          onClick={() => sendCodeToRun(selectedLang.id)}
        >
          ▶ Run
        </button>

        {/* Dropdown */}
        <LanguageDropdown
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
      </div>
    </div>
  );
}

// ✅ Output Panel
function OutputPanel({ output }: any) {
  return (
    <Card className="h-full bg-black text-green-400 p-2 font-mono overflow-auto">
      {output || "Output will appear here..."}
    </Card>
  );
}

// ✅ Suggestions Panel
function SuggestionsPanel({ data }: any) {
  const improvements = data?.improvements || [];
  const wholeConcise = data?.wholeConcise || "";

  return (
    <Card className="h-full bg-slate-950 p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4">🤖 Suggestions</h2>

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-blue-400 mb-2">
            Improvements
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {improvements.map((item: any, idx: number) => (
              <li key={idx}>
                <span className="font-semibold text-green-400">
                  {item.type}:
                </span>{" "}
                {item.suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Whole Concise */}
      {wholeConcise && (
        <div>
          <h3 className="text-md font-semibold text-blue-400 mb-2">
            Analysis Summary
          </h3>
          <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
            {wholeConcise}
          </div>
        </div>
      )}

      {!improvements.length && !wholeConcise && (
        <div className="text-gray-500 text-center">
          (No suggestions yet — run code analysis)
        </div>
      )}
    </Card>
  );
}

// ---------------- Main IDE ----------------
export default function IDELayout({
  code,
  setCode,
  output,
  setOutput,
  sendCodeToRun,
  sendCodeToAnalyze,
  data, // 👈 pass API response here
}: any) {
  const [activeTab, setActiveTab] = useState<"editor" | "canvas">("editor");
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const editorRef = useRef<any>(null);
  const [newLineCnt, setNewLineCnt] = useState(0);

  // Trigger analyze when 5+ new lines
  useEffect(() => {
    if (newLineCnt >= 5) {
      sendCodeToAnalyze(selectedLang.id, "newLine");
      setNewLineCnt(0);
    }
  }, [newLineCnt, selectedLang.id, sendCodeToAnalyze]);

  // ✅ Stable callback so editor events are not lost on re-renders
  const handleEditorDidMount = useCallback(
    (editor: any, monaco: any) => {
      editorRef.current = editor;

      editor.onDidChangeModelContent(() => {
        setCode(editor.getValue());
      });

      editor.onKeyDown((e: any) => {
        switch (true) {
          case e.keyCode === monaco.KeyCode.Backspace: {
            const pos = editor.getPosition();
            const model = editor.getModel();
            if (pos && model) {
              const lineContent = model.getLineContent(pos.lineNumber);
              const charBefore = lineContent.charAt(pos.column - 2);
              if (charBefore && charBefore.trim() !== "") {
                sendCodeToAnalyze(selectedLang.id, "backspace");
              }
            }
            break;
          }

          case e.keyCode === monaco.KeyCode.Enter && !e.ctrlKey:
            setNewLineCnt((cnt) => cnt + 1);
            break;

          case e.ctrlKey && e.keyCode === monaco.KeyCode.Enter:
            sendCodeToRun(selectedLang.id);
            e.preventDefault();
            break;

          case e.ctrlKey && e.keyCode === monaco.KeyCode.KeyS:
            sendCodeToAnalyze(selectedLang.id, "save");
            e.preventDefault();
            break;
        }
      });
    },
    [selectedLang.id, sendCodeToRun, sendCodeToAnalyze, setCode]
  );

  return (
    <div className="h-full w-full bg-slate-900 text-white flex flex-col">
      {/* Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        sendCodeToRun={sendCodeToRun}
      />

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
                    onMount={handleEditorDidMount}
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
              <OutputPanel output={output} />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-500 cursor-col-resize" />

        <Panel defaultSize={30} minSize={20}>
          <SuggestionsPanel data={data} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
