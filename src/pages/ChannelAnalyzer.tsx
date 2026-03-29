import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import { searchChannels, getChannel, getChannelVideos } from '@/lib/youtubeApi';
import type { Channel, Video } from '@/types';
import { 
  formatNumber, 
  formatDate,
  formatRelativeTime,
  isValidYouTubeUrl,
  extractChannelId 
} from '@/lib/utils';
import{
  Search,
  Users,
  Eye,
  Video as VideoIcon,
  Calendar,
  Globe,
  TrendingUp,
  Loader2,
  Play,
  BarChart3,
  Award,
  Target,
  Zap,
  ExternalLink,
} from 'lucide-react';
import{
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock historical data
const mockHistoricalData = [
  { month: 'Jan', subscribers: 5000, views: 50000 },
  { month: 'Feb', subscribers: 6200, views: 65000 },
  { month: 'Mar', subscribers: 7800, views: 82000 },
  { month: 'Apr', subscribers: 9500, views: 98000 },
  { month: 'May', subscribers: 11200, views: 125000 },
  { month: 'Jun', subscribers: 12500, views: 156000 },
];

export default function ChannelAnalyzer() {
  const { canSearch, incrementSearch } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchResults, setSearchResults] = useState<Channel[]>([]);

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
    setChannel(null);
    setSearchResults([]);

    try {
      let results: Channel[] = [];

      if (isValidYouTubeUrl(searchQuery)) {
        const channelId = extractChannelId(searchQuery);
        if (channelId) {
          const channelData = await getChannel(channelId);
          if (channelData) {
            results = [channelData];
          }
        }
      } else {
        results = await searchChannels(searchQuery);
      }

      if (results.length === 1) {
        setChannel(results[0]);
        const channelVideos = await getChannelVideos(results[0].id, 10);
        setVideos(channelVideos);
        incrementSearch();
      } else if (results.length > 1) {
        setSearchResults(results);
      } else {
        toast.error('No channels found');
      }
    } catch (error) {
      toast.error('Failed to search channels');
    } finally {
      setIsLoading(false);
    }
  };

  const selectChannel = async (selectedChannel: Channel) => {
    if (!canSearch()) {
      toast.error('Daily search limit reached');
      return;
    }

    setIsLoading(true);
    setChannel(selectedChannel);
    setSearchResults([]);

    try {
      const channelVideos = await getChannelVideos(selectedChannel.id, 10);
      setVideos(channelVideos);
      incrementSearch();
    } catch (error) {
      toast.error('Failed to load channel videos');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const avgViews = videos.length > 0
    ? videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length
    : 0;

  const avgEngagement = videos.length > 0
    ? videos.reduce((sum, v) => sum + (v.likeCount + v.commentCount), 0) / videos.reduce((sum, v) => sum + v.viewCount, 0) * 100
    : 0;

  const performanceScore = Math.min(100, Math.round(
    (channel?.subscriberCount || 0) / 1000 +
    (avgViews / 1000) +
    avgEngagement * 10
  ));

  const growthScore = Math.min(100, Math.round(
    ((channel?.subscriberCount || 0) / 10000) * 50 +
    (avgViews / 50000) * 50
  ));

  const seoScore = Math.min(100, Math.round(
    videos.length > 0
      ? videos.filter(v => v.tags && v.tags.length > 5).length / videos.length * 100
      : 0
  ));

  const consistencyScore = Math.min(100, Math.round(
    videos.length > 0
      ? (videos.filter(v => {
          const daysSince = (Date.now() - new Date(v.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysSince < 30;
        }).length / 10) * 100
      : 0
  ));

  const openOnYouTube = (videoId: string) => {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  };

  const openChannelOnYouTube = (channelId: string) => {
    window.open(`https://youtube.com/channel/${channelId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Channel Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze any YouTube channel for insights and performance metrics.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter channel URL, handle, or search query..."
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
            <CardTitle>Select a Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => selectChannel(result)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  {result.thumbnail ? (
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(result.subscriberCount)} subscribers
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(result.viewCount)} views
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Channel Overview */}
      {channel && (
        <>
          {/* Channel Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {channel.thumbnail ? (
                  <img
                    src={channel.thumbnail}
                    alt={channel.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center">
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{channel.title}</h2>
                  <p className="text-muted-foreground mt-1 line-clamp-2">
                    {channel.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    {channel.customUrl && (
                      <Badge variant="secondary">@{channel.customUrl}</Badge>
                    )}
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {channel.country || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(channel.publishedAt)}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => openChannelOnYouTube(channel.id)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on YouTube
                  </Button>
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
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                    <p className="text-xl font-bold">{formatNumber(channel.subscriberCount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-xl font-bold">{formatNumber(channel.viewCount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <VideoIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Videos</p>
                    <p className="text-xl font-bold">{formatNumber(channel.videoCount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Views/Video</p>
                    <p className="text-xl font-bold">{formatNumber(Math.round(avgViews))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scores & Charts */}
          <Tabs defaultValue="scores" className="space-y-4">
            <TabsList>
              <TabsTrigger value="scores">Scores</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
              <TabsTrigger value="videos">Top Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{performanceScore}</div>
                    <Progress value={performanceScore} className="h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Growth</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{growthScore}</div>
                    <Progress value={growthScore} className="h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">SEO</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{seoScore}</div>
                    <Progress value={seoScore} className="h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">Consistency</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{consistencyScore}</div>
                    <Progress value={consistencyScore} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="growth">
              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockHistoricalData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="subscribers"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => openOnYouTube(video.id)}
                      >
                        <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {video.thumbnail ? (
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Play className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{video.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatRelativeTime(video.publishedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatNumber(video.viewCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {avgEngagement.toFixed(1)}%
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
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
