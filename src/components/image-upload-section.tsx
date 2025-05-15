"use client";

import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ImageUploadSectionProps = {
  onImageAnalyzed: (dataUri: string) => Promise<void>;
  isLoading: boolean;
};

export function ImageUploadSection({ onImageAnalyzed, isLoading }: ImageUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB. Please choose a smaller image.");
        setSelectedFile(null);
        setPreviewUrl(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please select an image (JPEG, PNG, GIF, WEBP).");
        setSelectedFile(null);
        setPreviewUrl(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        await onImageAnalyzed(dataUri);
         toast({
          title: "Analysis Complete",
          description: "Emotion detection successful.",
          variant: "default",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
        setError(`Analysis failed: ${errorMessage}`);
        toast({
          title: "Analysis Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
       toast({
          title: "File Read Error",
          description: "Could not read the selected image file.",
          variant: "destructive",
        });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Upload Your Image</CardTitle>
        <CardDescription>Select an image of a face to analyze its expressions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-base">Choose Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WEBP.</p>
          </div>

          {previewUrl && (
            <div className="mt-4 border border-dashed border-border rounded-lg p-4 flex justify-center items-center bg-muted/50 aspect-square max-h-[300px] overflow-hidden">
              <Image
                src={previewUrl}
                alt="Selected image preview"
                width={280}
                height={280}
                className="object-contain rounded-md max-w-full max-h-full"
                data-ai-hint="person face"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full text-base py-3" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" />
                Analyze Emotions
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
