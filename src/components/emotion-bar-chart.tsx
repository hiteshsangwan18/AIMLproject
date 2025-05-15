"use client";

import type { DetectEmotionsOutput } from "@/ai/flows/detect-emotions";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Angry, Frown, Meh, ShieldAlert, Smile, Info } from "lucide-react";
import type { ReactNode } from "react";

type EmotionChartProps = {
  emotions: DetectEmotionsOutput["emotions"];
};

const emotionConfig = {
  happiness: { label: "Happiness", color: "hsl(var(--chart-1))", icon: Smile },
  sadness: { label: "Sadness", color: "hsl(var(--chart-2))", icon: Frown },
  anger: { label: "Anger", color: "hsl(var(--chart-3))", icon: Angry },
  surprise: { label: "Surprise", color: "hsl(var(--chart-4))", icon: Info },
  fear: { label: "Fear", color: "hsl(var(--chart-5))", icon: ShieldAlert },
  neutral: { label: "Neutral", color: "hsl(var(--muted))", icon: Meh },
} as const;

type EmotionKey = keyof typeof emotionConfig;

export function EmotionBarChart({ emotions }: EmotionChartProps) {
  const chartData = Object.entries(emotions)
    .map(([key, score]) => {
      const config = emotionConfig[key as EmotionKey];
      return {
        name: config?.label || key,
        score: score * 100, // Convert to percentage
        fill: config?.color || "hsl(var(--muted))",
        Icon: config?.icon,
      };
    })
    .sort((a, b) => b.score - a.score); // Sort by score descending

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
      icon: item.Icon,
    };
    return acc;
  }, {} as any);
  

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full sm:min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          accessibilityLayer
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={({ x, y, payload }) => {
              const IconComponent = chartData.find(d => d.name === payload.value)?.Icon;
              return (
                <g transform={`translate(${x - 20},${y})`}>
                  {IconComponent && <IconComponent style={{ transform: 'translateY(-8px) translateX(-10px)'}} className="inline-block mr-1 h-4 w-4 text-muted-foreground" />}
                  <text x={IconComponent ? 10 : -10} y={0} dy={4} textAnchor="end" fill="hsl(var(--foreground))" fontSize={12}>
                    {payload.value}
                  </text>
                </g>
              );
            }}
            width={100}
          />
          <RechartsTooltip
            cursor={{ fill: "hsl(var(--muted)/0.3)" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="score" radius={4} barSize={20}>
             {/* The 'fill' attribute is managed by ChartContainer based on config */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
