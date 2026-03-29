import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { getVideo, searchVideos } from '@/lib/youtubeApi';
import type { Video } from '@/types';
import { 
  formatNumber, 
  formatDuration,
  formatRelativeTime,
  isValidYouTubeUrl,
  extractVideoId 
} from '@/lib/utils';
import {
  Search,
  Play,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  Loader2,
  Tag,
  BarChart3,
  Target,
  Zap,
  AlertCircle,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock view velocity data
const mockViewData = [
  { hour: '0h', views: 1000 },
  { hour: '6h', views: 3500 },
  { hour: '12h', views: 8200 },
  { hour: '18h', views: 15000 },
  { hour: '24h', views: 22000 },
  { hour: '30h', views: 28000 },
  { hour: '36h', views: 32000 },
  { hour: '42h', views: 35000 },
  { hour: '48h', views: 38000 },
];

export default function VideoAnalyzer() {
  const { canSearch, incrementSearch } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState<Video | null>(null);
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    if (!canSearch()) {
      toast.error('Daily search limit reached. Upgrade your plan for more searches.');
      return;
    }

    setIsLoading(true);
    setVideo(null);
    setSearchResults([]);

    try {
      let result: Video | null = null;

      if (isValidYouTubeUrl(searchQuery)) {
        const videoId = extractVideoId(searchQuery);
        if (videoId) {
          result = await getVideo(videoId);
        }
      } else {
        const results = await searchVideos(searchQuery, 5);
        if (results.length === 1) {
          result = results[0];
        } else if (results.length > 1) {
          setSearchResults(results);
          setIsLoading(false);
          return;
        }
      }

      if (result) {
        setVideo(result);
        incrementSearch();
      } else {
        toast.error('No videos found');
      }
    } catch (error) {
      toast.error('Failed to search videos');
    } finally {
      setIsLoading(false);
    }
  };

  const selectVideo = (selectedVideo: Video) => {
    if (!canSearch()) {
      toast.error('Daily search limit reached');
      return;
    }

    setVideo(selectedVideo);
    setSearchResults([]);
    incrementSearch();
  };

  // Calculate metrics
  const engagementRate = video
    ? ((video.likeCount + video.commentCount) / video.viewCount) * 100
    : 0;

  const likeRatio = video
    ? (video.likeCount / video.viewCount) * 100
    : 0;

  const commentRatio = video
    ? (video.commentCount / video.viewCount) * 100
    : 0;

  const performanceScore = video
    ? Math.min(100, Math.round(
        (video.viewCount / 10000) * 30 +
        engagementRate * 10 +
        (video.tags?.length || 0) * 5
      ))
    : 0;

  const viralScore = video
    ? Math.min(100, Math.round(
        (video.viewCount / 50000) * 40 +
        engagementRate * 20 +
        likeRatio * 20 +
        commentRatio * 20
      ))
    : 0;

  const isOverperforming = performanceScore > 70;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Video Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze any YouTube video for performance metrics and optimization opportunities.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter video URL or search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Analyze
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectVideo(result)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">{result.title}</p>
                    <p className="text-sm text-muted-foreground">{result.channelTitle}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(result.viewCount)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(result.duration)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Analysis */}
      {video && (
        <>
          {/* Video Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 aspect-video bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold line-clamp-2">{video.title}</h2>
                  <p className="text-muted-foreground mt-1">{video.channelTitle}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(video.viewCount)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(video.likeCount)} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {formatNumber(video.commentCount)} comments
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(video.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatRelativeTime(video.publishedAt)}
                    </span>
                  </div>
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {video.tags.slice(0, 10).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {video.tags.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.tags.length - 10} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-xl font-bold">{engagementRate.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Like Ratio</p>
                    <p className="text-xl font-bold">{likeRatio.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comment Ratio</p>
                    <p className="text-xl font-bold">{commentRatio.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <p className="text-xl font-bold">{video.tags?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scores & Charts */}
          <Tabs defaultValue="scores" className="space-y-4">
            <TabsList>
              <TabsTrigger value="scores">Scores</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="font-medium">Performance Score</span>
                      </div>
                      <Badge variant={isOverperforming ? 'default' : 'secondary'}>
                        {isOverperforming ? 'Overperforming' : 'Underperforming'}
                      </Badge>
                    </div>
                    <div className="text-4xl font-bold mb-2">{performanceScore}</div>
                    <Progress value={performanceScore} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-3">
                      Based on views, engagement, and optimization
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Viral Score</span>
                      </div>
                      <Badge variant={viralScore > 70 ? 'default' : 'secondary'}>
                        {viralScore > 70 ? 'Trending' : 'Normal'}
                      </Badge>
                    </div>
                    <div className="text-4xl font-bold mb-2">{viralScore}</div>
                    <Progress value={viralScore} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-3">
                      Based on view velocity and engagement rate
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>View Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockViewData}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="hour" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorViews)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Title Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Your title is {video.title.length} characters. Aim for 50-60 characters for optimal display.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Tags</p>
                      <p className="text-sm text-muted-foreground">
                        You have {video.tags?.length || 0} tags. {video.tags && video.tags.length >= 10 
                          ? 'Good job! You have a healthy number of tags.' 
                          : 'Consider adding more relevant tags (aim for 10-15).'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">
                        Your description is {video.description.length} characters. 
                        {video.description.length < 200 
                          ? ' Consider adding a more detailed description with keywords.' 
                          : ' Good length for SEO optimization.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
