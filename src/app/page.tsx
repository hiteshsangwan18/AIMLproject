"use client";

import { useState } from 'react';
import { detectEmotions, type DetectEmotionsOutput } from '@/ai/flows/detect-emotions';
import { ImageUploadSection } from '@/components/image-upload-section';
import { EmotionResultsSection } from '@/components/emotion-results-section';
import { FaceFeelLogo } from '@/components/facefeel-logo';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const [analysisResult, setAnalysisResult] = useState<DetectEmotionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageAnalyzed = async (photoDataUri: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null); 
    try {
      const result = await detectEmotions({ photoDataUri });
      setAnalysisResult(result);
    } catch (error) {
      console.error("Emotion detection error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <header className="w-full max-w-5xl mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mt-2">
          Understand Emotions with AI
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Upload an image to get an AI-powered analysis of facial expressions.
        </p>
      </header>

      <Separator className="my-6 md:my-8 w-full max-w-5xl" />
      
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="md:col-span-1">
          <ImageUploadSection onImageAnalyzed={handleImageAnalyzed} isLoading={isLoading} />
        </div>
        
        <div className="md:col-span-1">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <EmotionResultsSection analysisResult={analysisResult} />
        </div>
      </main>
    </div>
  );
}
