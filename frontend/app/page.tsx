"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, Loader2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DetectPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    disease: string;
    confidence?: number;
    treatment: string;
  }>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await analyzeImage(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);

    // Create form data to send to backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Replace with your actual backend URL if different
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend returned an error");
      }

      const data = await response.json();

      // Check if backend returned an error message
      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        setResult(null);
      } else {
        setResult(data);
        toast({
          title: "Analysis Complete",
          description: "Disease detection results are ready.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      console.error("Image analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Plant Disease Detection</h1>
            <p className="text-xl text-muted-foreground">
              Upload a photo of your plant to instantly detect diseases and get treatment recommendations.
            </p>
          </div>

          <Card
            className={cn(
              "p-12 border-2 border-dashed transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border",
              isAnalyzing ? "opacity-50" : ""
            )}
          >
            <div
              className="text-center"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Drag and drop your image here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click the buttons below
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="relative"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={isAnalyzing}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement camera capture
                    toast({
                      title: "Coming Soon",
                      description: "Camera capture will be available soon!",
                    });
                  }}
                  disabled={isAnalyzing}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </div>
            </div>
          </Card>

          {isAnalyzing && (
            <Card className="mt-8 p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg">Analyzing your plant image...</p>
            </Card>
          )}

          {result && !isAnalyzing && (
            <Card className="mt-8 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-600/10 rounded-full p-3">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Detection Results
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Detected Disease:</p>
                      <p className="text-lg text-red-600">{result.disease}</p>
                    </div>
                    {result.confidence !== undefined && (
                      <div>
                        <p className="font-medium">Confidence:</p>
                        <p className="text-lg">{result.confidence}%</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Recommended Treatment:</p>
                      <p className="text-muted-foreground">{result.treatment}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button size="lg">Save Results</Button>
                    <Button size="lg" variant="outline">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
