"use client";
import { useEffect, useState } from "react";
import { UptimeCard } from "../../_components/uptime-card";// adjust path
import { Loader2 } from "lucide-react";

interface Check {
  id: string;
  status: string;
  responseTime: number | null;
  statusCode: number | null;
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  domain: string;
  status: string;
  lastChecked: string | null;
  checks: Check[];
}

export default function UptimeDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project"); // 👈 API endpoint
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        // Convert checks' createdAt to timestamp: Date
        const projectsWithTimestamps: Project[] = data.map((project: any) => ({
          ...project,
          checks: (project.checks ?? []).map((check: any) => ({
            ...check,
            timestamp: new Date(check.timestamp),
          })),
        }));
        setProjects(projectsWithTimestamps);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // 🔄 Refresh every 30s
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-center text-muted-foreground">No projects found.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Uptime Dashboard</h1>
      {projects.map((project) => (
        <UptimeCard key={project.id} data={project} />
      ))}
    </div>
  );
}
