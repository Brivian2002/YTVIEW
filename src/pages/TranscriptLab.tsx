import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Copy, 
  Search,
  Sparkles,
  Clock,
  BookOpen,
  Lightbulb,
  Loader2,
  Check,
} from 'lucide-react';

// Mock transcript data
const MOCK_TRANSCRIPT = `0:00 - Welcome back to the channel everyone!
0:05 - In today's video, we're going to discuss the top strategies for growing your YouTube channel.
0:15 - First, let's talk about consistency. Posting regularly is key to building an audience.
0:30 - The algorithm favors channels that upload consistently.
0:45 - Second, engagement is crucial. Respond to comments and build a community.
1:00 - Third, optimize your thumbnails and titles for click-through rate.
1:15 - A great thumbnail can make the difference between a viral video and one that gets ignored.
1:30 - Fourth, use analytics to understand what works and what doesn't.
1:45 - Look at your retention graphs and see where people drop off.
2:00 - Fifth, collaborate with other creators in your niche.
2:15 - This helps you reach new audiences and grow faster.
2:30 - Thanks for watching! Don't forget to subscribe and hit the notification bell.`;

const MOCK_SUMMARY = `This video covers 5 key strategies for growing a YouTube channel:

1. Consistency - Post regularly to build audience and please the algorithm
2. Engagement - Respond to comments and build community
3. Thumbnails & Titles - Optimize for higher click-through rates
4. Analytics - Use data to understand what content performs best
5. Collaboration - Work with other creators to reach new audiences`;

const MOCK_KEY_POINTS = [
  'Consistency in posting is essential for channel growth',
  'Engagement with your community builds loyalty',
  'Thumbnails directly impact click-through rates',
  'Analytics reveal what content resonates with viewers',
  'Collaborations expand your reach to new audiences',
];

const MOCK_CHAPTERS = [
  { title: 'Introduction', time: '0:00' },
  { title: 'Strategy 1: Consistency', time: '0:15' },
  { title: 'Strategy 2: Engagement', time: '0:45' },
  { title: 'Strategy 3: Thumbnails', time: '1:00' },
  { title: 'Strategy 4: Analytics', time: '1:30' },
  { title: 'Strategy 5: Collaboration', time: '2:00' },
  { title: 'Conclusion', time: '2:30' },
];

export default function TranscriptLab() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [chapters, setChapters] = useState<{ title: string; time: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const extractTranscript = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTranscript(MOCK_TRANSCRIPT);
      setSummary(MOCK_SUMMARY);
      setKeyPoints(MOCK_KEY_POINTS);
      setChapters(MOCK_CHAPTERS);
      setIsLoading(false);
      toast.success('Transcript extracted successfully');
    }, 2000);
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranscript = (format: 'txt' | 'docx' | 'pdf') => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  const filteredTranscript = searchQuery
    ? transcript.split('\n').filter(line => 
        line.toLowerCase().includes(searchQuery.toLowerCase())
      ).join('\n')
    : transcript;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Transcript Lab</h1>
        <p className="text-muted-foreground">
          Extract, analyze, and summarize video transcripts.
        </p>
      </div>

      {/* URL Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter YouTube video URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={extractTranscript} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Extract
            </Button>
          </div>
        </CardContent>
      </Card>

      {transcript && (
        <Tabs defaultValue="transcript" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="keypoints">Key Points</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
          </TabsList>

          {/* Transcript */}
          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Full Transcript
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transcript..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={copyTranscript}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-[500px] overflow-auto">
                  {filteredTranscript || 'No matches found'}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => downloadTranscript('txt')}>
                    <Download className="w-4 h-4 mr-2" />
                    TXT
                  </Button>
                  <Button variant="outline" onClick={() => downloadTranscript('docx')}>
                    <Download className="w-4 h-4 mr-2" />
                    DOCX
                  </Button>
                  <Button variant="outline" onClick={() => downloadTranscript('pdf')}>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 whitespace-pre-wrap">
                  {summary}
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => copyToClipboard(summary)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Summary
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Points */}
          <TabsContent value="keypoints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chapters */}
          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Auto-Generated Chapters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{chapter.time}</span>
                        <span className="text-sm">{chapter.title}</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  className="mt-4 w-full" 
                  variant="outline"
                  onClick={() => {
                    const chapterText = chapters.map(c => `${c.time} - ${c.title}`).join('\n');
                    copyToClipboard(chapterText);
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Chapters
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}
