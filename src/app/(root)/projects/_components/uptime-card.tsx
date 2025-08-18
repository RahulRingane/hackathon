"use client";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type UptimeStatus = "good" | "bad" | "unknown";

interface ProjectCardProps {
  data: {
    id: string;
    name: string;
    domain: string;
    status: string; // "up" | "down"
    lastChecked: string | null;
    checks: {
      id: string;
      status: string; // "up" | "down"
      responseTime: number | null;
      statusCode: number | null;
      timestamp: Date;
    }[];
  };
}

function StatusCircle({ status }: { status: UptimeStatus }) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        status === "good"
          ? "bg-green-500"
          : status === "bad"
          ? "bg-red-500"
          : "bg-gray-500"
      }`}
    />
  );
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, idx) => (
        <div
          key={idx}
          className={`w-8 h-2 rounded ${
            tick === "good"
              ? "bg-green-500"
              : tick === "bad"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        />
      ))}
    </div>
  );
}

export function UptimeCard({ data }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

const processed = useMemo(() => {
  const sortedChecks = [...data.checks].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Last 30 min window
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const recentChecks = sortedChecks.filter(
    (c: any) => new Date(c.timestamp) > thirtyMinAgo
  );

  // Build 10 windows of 3 min each
  const windows: UptimeStatus[] = [];
  for (let i = 0; i < 10; i++) {
    const start = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
    const end = new Date(Date.now() - i * 3 * 60 * 1000);

    const windowChecks = recentChecks.filter(
      (c) =>
        new Date(c.timestamp) >= start && new Date(c.timestamp) < end
    );

    const upCount = windowChecks.filter((c) => c.status === "up").length;
    windows[9 - i] =
      windowChecks.length === 0
        ? "unknown"
        : upCount / windowChecks.length >= 0.5
        ? "good"
        : "bad";
  }

  const total = sortedChecks.length;
  const upTotal = sortedChecks.filter((c) => c.status === "up").length;
  const uptimePercentage = total === 0 ? 100 : (upTotal / total) * 100;
  console.log("total", total)

  return {
    status:
      windows.length > 0 ? windows[windows.length - 1] : "unknown",
    uptimePercentage,
    lastChecked: data.lastChecked
      ? new Date(data.lastChecked).toLocaleTimeString()
      : "Never",
    responseTime: sortedChecks[0]?.responseTime ?? null,
    ticks: windows,
  };
}, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between bg-gray-600 dark:hover:bg-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={processed.status} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {data.name}
            </h3>
            <p className="text-sm text-gray-500">{data.domain}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {processed.uptimePercentage.toFixed(1)}% uptime
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Last 30 minutes status:
            </p>
            <UptimeTicks ticks={processed.ticks} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last checked: {processed.lastChecked}
          </p>
          {processed.responseTime !== null && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Response time: {processed.responseTime} ms
            </p>
          )}
        </div>
      )}
    </div>
  );
}
