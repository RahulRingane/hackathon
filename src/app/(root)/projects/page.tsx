"use client";

import { assertAuthenticated } from "@/lib/session";
import { getAllProjects } from "@/use-cases/project";
import { Suspense, useEffect, useRef, useState } from "react";
import { EmptyProject } from "./_components/empty-project";
import { Header } from "./_components/header";
import { ProjectCard } from "./_components/project-card";
import { ProjectSkelteon } from "./_components/project-skeleton";
import { Heading } from "lucide-react";
import Projects from "./_components/projects";
import IDELayout from "./_components/IDELayout";
import { io } from "socket.io-client";
// import { cookies } from "next/headers";
import { log } from "node:console";

export default function ProjectsPage() {
  const [code, setCode] = useState<string>(`// Write your code here
      function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  for (let i = 0; i < 10; i++) {
    console.log(fibonacci(i));
  }
  `);
  const [output, setOutput] = useState("");

  const socketRef = useRef<any | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        reconnection: true, // auto reconnect
        reconnectionAttempts: 5, // retry max 5 times
        reconnectionDelay: 1000, // wait 1s between retries
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Connected:", socketRef.current?.id);
        // socketRef.current?.emit("message", "Hello from Next.js client!");
        // let a = Cookies.get("authjs.session-token");
        // setOutput(a);

        // socketRef.current.emit("userAuth", {
        // jwtToken: a,
        // });
      });

      socketRef.current.on("output", (out: any) => {
        setOutput(out.output);
      });

      socketRef.current.on("");

      // socketRef.current.on("disconnect", () => {
      //   console.log("❌ Disconnected, will try to reconnect…");
      // });
    }
  });

  const sendCodeToRun = (langId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("run", {
        code: code,
        langId: langId,
      });
    }
  };

  const sendCodeToAnalyze = (langId: number, etype: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("suggestErr", {
        code: code,
        langId: langId,
        etype: etype,
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* <Header title="Your Projects" /> */}
      <Suspense fallback={<ProjectSkelteon />}>
        {/* <Projects /> */}
        <IDELayout
          code={code}
          setCode={setCode}
          output={output}
          setOutput={setOutput}
          sendCodeToRun={sendCodeToRun}
          sendCodeToAnalyze={sendCodeToAnalyze}
        />
      </Suspense>
      {/* <CreateModal /> */}
      {/* <EditModal /> */}
      {/* <DeleteModal /> */}
    </div>
  );
}

/*
const Projects = async () => {
  const session = await assertAuthenticated();
  const projects = await getAllProjects(session.id);
  return projects && Array.isArray(projects) && projects.length > 0 ? (
    <div className="p-3 w-full h-full">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {projects.map((data, index) => (
          <ProjectCard key={index} data={data} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-1 justify-center items-center w-full h-full">
      <EmptyProject />
    </div>
  );
};
*/
