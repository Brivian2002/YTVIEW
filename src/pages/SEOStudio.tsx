import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Tag,
  Type,
  FileText,
  Hash,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const TITLE_TEMPLATES = [
  'How to [Topic] in [Year]: Complete Guide',
  '[Number] Ways to [Achieve Result] Fast',
  'The Ultimate [Topic] Tutorial for Beginners',
  '[Topic] Secrets Experts Don\'t Want You to Know',
  'Why Your [Topic] Isn\'t Working (And How to Fix It)',
];

const DESCRIPTION_TEMPLATE = `🎯 In this video, you'll learn:

⏱️ TIMESTAMPS:
0:00 - Introduction
1:30 - Main Topic
5:00 - Key Points
10:00 - Conclusion

📌 RESOURCES MENTIONED:
• Resource 1
• Resource 2

🔔 Subscribe for more [niche] content!

#hashtag1 #hashtag2 #hashtag3`;

export default function SEOStudio() {
  const [topic, setTopic] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [seoScore, setSeoScore] = useState(0);

  const generateTitles = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const titles = TITLE_TEMPLATES.map(template =>
        template
          .replace('[Topic]', topic)
          .replace('[Year]', new Date().getFullYear().toString())
          .replace('[Number]', Math.floor(Math.random() * 10 + 5).toString())
          .replace('[Achieve Result]', `Master ${topic}`)
      );
      setGeneratedTitles(titles);
      setIsGenerating(false);
      toast.success('Titles generated successfully');
    }, 1500);
  };

  const generateTags = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const baseTags = topic.toLowerCase().split(' ');
      const relatedTags = [
        ...baseTags,
        `${topic} tutorial`,
        `${topic} guide`,
        `${topic} tips`,
        `${topic} for beginners`,
        `how to ${topic}`,
        `learn ${topic}`,
        `${topic} 2024`,
        `${topic} explained`,
        `${topic} basics`,
        `best ${topic}`,
      ];
      setGeneratedTags(relatedTags.slice(0, 15));
      setIsGenerating(false);
      toast.success('Tags generated successfully');
    }, 1000);
  };

  const analyzeSEO = () => {
    let score = 0;
    
    // Title length check (ideal: 50-60 chars)
    if (description.includes('Title:')) {
      const titleMatch = description.match(/Title:(.+)/);
      if (titleMatch) {
        const titleLength = titleMatch[1].trim().length;
        if (titleLength >= 50 && titleLength <= 60) score += 25;
        else if (titleLength > 0) score += 10;
      }
    }

    // Description length check (ideal: 200-300 chars minimum)
    if (description.length >= 200) score += 25;
    else if (description.length > 0) score += 10;

    // Hashtags check
    const hashtagCount = (description.match(/#/g) || []).length;
    if (hashtagCount >= 3 && hashtagCount <= 15) score += 25;
    else if (hashtagCount > 0) score += 10;

    // Timestamps check
    if (description.includes('TIMESTAMPS') || description.includes('0:')) score += 25;

    setSeoScore(score);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">SEO Studio</h1>
        <p className="text-muted-foreground">
          Generate optimized titles, descriptions, tags, and analyze your content.
        </p>
      </div>

      <Tabs defaultValue="titles" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
        </TabsList>

        {/* Title Generator */}
        <TabsContent value="titles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Title Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your video topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={generateTitles} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>

              {generatedTitles.length > 0 && (
                <div className="space-y-2">
                  {generatedTitles.map((title, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <span className="flex-1 mr-4">{title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {title.length} chars
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(title, `title-${index}`)}
                        >
                          {copied === `title-${index}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Description Generator */}
        <TabsContent value="descriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Description Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={description || DESCRIPTION_TEMPLATE}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {description.length || DESCRIPTION_TEMPLATE.length} characters
                </span>
                <Button
                  onClick={() => copyToClipboard(description || DESCRIPTION_TEMPLATE, 'desc')}
                >
                  {copied === 'desc' ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags Generator */}
        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your video topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={generateTags} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </Button>
              </div>

              {generatedTags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {generatedTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(generatedTags.join(', '), 'tags')}
                    className="w-full"
                  >
                    {copied === 'tags' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy All Tags
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hashtags */}
        <TabsContent value="hashtags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  '#YouTube', '#Tutorial', '#HowTo', '#Viral',
                  '#Trending', '#Education', '#Tech', '#Gaming',
                  '#Lifestyle', '#Fitness', '#Cooking', '#Travel',
                  '#Music', '#Comedy', '#Review', '#Unboxing',
                ].map((hashtag) => (
                  <Button
                    key={hashtag}
                    variant="outline"
                    className="justify-start"
                    onClick={() => copyToClipboard(hashtag, hashtag)}
                  >
                    {copied === hashtag ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Hash className="w-4 h-4 mr-2" />
                    )}
                    {hashtag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Analyzer */}
        <TabsContent value="analyzer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                SEO Score Checker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your title and description here to analyze..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px]"
              />
              <Button onClick={analyzeSEO} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze SEO
              </Button>

              {seoScore > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">SEO Score</span>
                      <span className={`text-2xl font-bold ${
                        seoScore >= 80 ? 'text-green-500' :
                        seoScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {seoScore}/100
                      </span>
                    </div>
                    <Progress value={seoScore} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Title length is optimal</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Description includes keywords</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Consider adding more hashtags</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
