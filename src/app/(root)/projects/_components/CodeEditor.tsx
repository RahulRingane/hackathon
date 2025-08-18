"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }: any) {
  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  );
}
