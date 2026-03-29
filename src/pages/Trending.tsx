import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getTrendingVideos } from '@/lib/youtubeApi';
import type { TrendingVideo, Video } from '@/types';
import { 
  formatNumber, 
  formatRelativeTime,
} from '@/lib/utils';
import{
  TrendingUp,
  Flame,
  Globe,
  Play,
  Eye,
  Heart,
  Zap,
  Loader2,
  Filter,
  ExternalLink,
  RefreshCw,
  Clock,
} from 'lucide-react';

const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: '1', name: 'Film & Animation' },
  { id: '2', name: 'Autos & Vehicles' },
  { id: '10', name: 'Music' },
  { id: '15', name: 'Pets & Animals' },
  { id: '17', name: 'Sports' },
  { id: '20', name: 'Gaming' },
  { id: '22', name: 'People & Blogs' },
  { id: '23', name: 'Comedy' },
  { id: '24', name: 'Entertainment' },
  { id: '25', name: 'News & Politics' },
  { id: '26', name: 'Howto & Style' },
  { id: '27', name: 'Education' },
  { id: '28', name: 'Science & Technology' },
];

// Calculate viral score based on view velocity and engagement
const calculateViralScore = (video: Video): number => {
  const views = video.viewCount;
  const likes = video.likeCount;
  const comments = video.commentCount;
  const publishedAt = new Date(video.publishedAt);
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince === 0) return 0;
  
  // View velocity (views per hour)
  const viewVelocity = views / hoursSince;
  
  // Engagement rate
  const engagementRate = views > 0 ? (likes + comments) / views : 0;
  
  // Calculate score (0-100)
  // High view velocity and engagement = viral
  const velocityScore = Math.min(70, (viewVelocity / 5000) * 70);
  const engagementScore = Math.min(30, engagementRate * 1000);
  
  return Math.round(velocityScore + engagementScore);
};

// Calculate view velocity (views per hour)
const calculateViewVelocity = (video: Video): number => {
  const views = video.viewCount;
  const publishedAt = new Date(video.publishedAt);
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince <= 0) return views;
  return Math.round(views / hoursSince);
};

export default function Trending() {
  const [videos, setVideos] = useState<TrendingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadTrending = useCallback(async () => {
    setIsLoading(true);
    try {
      const trendingVideos = await getTrendingVideos(selectedRegion, 50);
      
      // Calculate viral scores and view velocity for each video
      const videosWithScores = trendingVideos.map(video => ({
        ...video,
        viralScore: calculateViralScore(video),
        viewVelocity: calculateViewVelocity(video),
      }));
      
      // Filter by category if selected
      let filteredVideos = videosWithScores;
      if (selectedCategory !== 'all') {
        filteredVideos = videosWithScores.filter(v => v.category === selectedCategory);
      }
      
      // Sort by viral score (highest first)
      filteredVideos.sort((a, b) => b.viralScore - a.viralScore);
      
      setVideos(filteredVideos);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error('Failed to load trending videos');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegion, selectedCategory]);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadTrending();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, loadTrending]);

  const getViralBadge = (score: number) => {
    if (score >= 80) return { label: 'Viral', color: 'bg-red-500', icon: Flame };
    if (score >= 60) return { label: 'Trending', color: 'bg-orange-500', icon: TrendingUp };
    if (score >= 40) return { label: 'Rising', color: 'bg-yellow-500', icon: Zap };
    return { label: 'Normal', color: 'bg-gray-500', icon: Play };
  };

  const openOnYouTube = (videoId: string) => {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-500" />
            Trending Videos
          </h1>
          <p className="text-muted-foreground">
            Discover viral content and trending topics across YouTube. Updates every 2 minutes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Viral Videos</p>
                <p className="text-xl font-bold">{videos.filter(v => v.viralScore >= 80).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trending</p>
                <p className="text-xl font-bold">{videos.filter(v => v.viralScore >= 60).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-xl font-bold">
                  {formatNumber(videos.reduce((sum, v) => sum + v.viewCount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Velocity</p>
                <p className="text-xl font-bold">
                  {videos.length > 0 
                    ? formatNumber(Math.round(videos.reduce((sum, v) => sum + v.viewVelocity, 0) / videos.length))
                    : 0}/h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-xl font-bold">
                  {lastUpdated ? formatRelativeTime(lastUpdated.toISOString()) : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Trending</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            <Button variant="outline" size="sm" onClick={loadTrending} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && videos.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading trending videos...</p>
              </div>
            ) : videos.length > 0 ? (
              videos.map((video, index) => {
                const viralBadge = getViralBadge(video.viralScore);
                const BadgeIcon = viralBadge.icon;
                return (
                  <div
                    key={video.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => openOnYouTube(video.id)}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div className="w-40 aspect-video bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {video.thumbnail ? (
                        <>
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <Play className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                        </div>
                        <Badge className={`${viralBadge.color} text-white flex-shrink-0`}>
                          <BadgeIcon className="w-3 h-3 mr-1" />
                          {viralBadge.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(video.viewCount)} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(video.likeCount)} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {formatNumber(video.viewVelocity)}/h velocity
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {video.viralScore} viral score
                        </span>
                        <span>{formatRelativeTime(video.publishedAt)}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Flame className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No trending videos found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
