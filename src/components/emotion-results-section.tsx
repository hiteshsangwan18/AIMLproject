"use client";

import type { DetectEmotionsOutput } from "@/ai/flows/detect-emotions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionBarChart } from "./emotion-bar-chart";
import { Separator } from "@/components/ui/separator";
import { FileText, BarChart3 } from "lucide-react";

type EmotionResultsSectionProps = {
  analysisResult: DetectEmotionsOutput | null;
};

export function EmotionResultsSection({ analysisResult }: EmotionResultsSectionProps) {
  if (!analysisResult) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Upload an image and click "Analyze Emotions" to see the results here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Emotion Analysis</CardTitle>
        <CardDescription>Detected emotions and their likelihood scores.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Emotion Scores
          </h3>
          <EmotionBarChart emotions={analysisResult.emotions} />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Emotion Summary
          </h3>
          <p className="text-base leading-relaxed bg-secondary/50 p-4 rounded-md shadow-sm">
            {analysisResult.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
