"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const chartData = useMemo(() => {
    if (!assessments?.length) return [];

    return [...assessments]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: Math.round(assessment.quizScore * 100), // ✅ FIXED SCALE
      }));
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          {chartData.length < 2 ? (
            <p className="text-sm text-muted-foreground text-center">
              Complete at least 2 assessments to see performance trend
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"          // ✅ visible color
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
