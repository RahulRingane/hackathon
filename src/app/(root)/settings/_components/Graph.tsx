"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export function ThoughtProcessAnalysis() {
  const metrics = {
    pseudocodePresence: true,
    testDriven: "partial", // 'full' | 'partial' | 'none'
    refactoringOccurred: false,
    totalTime: 452, // seconds
    debugAttempts: 3,
  };

  // Radar data → high-level analysis
  const radarData = [
    {
      question: "Did they start with pseudocode?",
      value: metrics.pseudocodePresence ? 100 : 0,
    },
    {
      question: "Did they write tests first?",
      value:
        metrics.testDriven === "full"
          ? 100
          : metrics.testDriven === "partial"
            ? 50
            : 0,
    },
    {
      question: "Did they refactor their code?",
      value: metrics.refactoringOccurred ? 100 : 0,
    },
    {
      question: "How did they debug errors?",
      value: Math.min(metrics.debugAttempts * 20, 100), // scale attempts
    },
  ];

  // Line chart → evolution of debug attempts over time
  // (Here: Hardcoded for demo; later you can map from session logs)
  const debugTimeline = [
    { step: "Start", attempts: 0 },
    { step: "First Error", attempts: 1 },
    { step: "Second Error", attempts: 2 },
    { step: "Final Fix", attempts: 3 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 items-center justify-center">
      {/* Radar Chart */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-2">
          Thought Process Analysis
        </h2>
        <RadarChart outerRadius={120} width={420} height={340} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="question" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Analysis"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.5}
          />
          <Tooltip />
        </RadarChart>
      </div>

      {/* Line Chart */}
      <div>
        <h2 className="text-lg font-semibold text-center mb-2">
          Debug Attempts Over Time
        </h2>
        <LineChart width={420} height={300} data={debugTimeline}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="step" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="attempts"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
