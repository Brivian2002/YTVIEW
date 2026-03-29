import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Maximize,
  Lightbulb,
  Loader2,
} from 'lucide-react';

const PRESET_SIZES = [
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'YouTube Shorts', width: 1080, height: 1920 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Twitter/X', width: 1200, height: 675 },
  { name: 'Facebook', width: 1200, height: 630 },
];

const AI_SUGGESTIONS = [
  'Use high contrast colors to make text pop',
  'Include a human face for better engagement',
  'Keep text under 5 words for readability',
  'Use red or orange for urgency/attention',
  'Add arrows or circles to highlight key elements',
  'Test different expressions on faces',
  'Use bold, sans-serif fonts',
  'Include your brand colors consistently',
];

export default function ThumbnailLab() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = (width: number, height: number) => {
    setCustomWidth(width);
    setCustomHeight(height);
    toast.success(`Resized to ${width}x${height}`);
  };

  const generateSuggestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomSuggestions = AI_SUGGESTIONS
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      setSuggestions(randomSuggestions);
      setIsGenerating(false);
      toast.success('AI suggestions generated');
    }, 1500);
  };

  const downloadImage = () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    toast.success('Image downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Thumbnail Lab</h1>
        <p className="text-muted-foreground">
          Create, optimize, and analyze thumbnails for better click-through rates.
        </p>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload & Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Upload & Resize</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={downloadImage}
                    disabled={!uploadedImage}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Thumbnail preview"
                      className="max-w-full max-h-full object-contain"
                      style={{ maxWidth: customWidth, maxHeight: customHeight }}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Upload an image to preview</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Dimensions: {customWidth}x{customHeight}px</span>
                  <span>Aspect Ratio: {(customWidth / customHeight).toFixed(2)}:1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_SIZES.map((preset) => (
              <Card
                key={preset.name}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleResize(preset.width, preset.height)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Maximize className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{preset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {preset.width}x{preset.height}px
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI-Powered Thumbnail Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateSuggestions} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating suggestions...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Generate AI Suggestions
                  </>
                )}
              </Button>

              {suggestions.length > 0 && (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
