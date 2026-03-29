import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { TrendingVideo } from '@/types';
import { 
  formatNumber, 
  formatRelativeTime,
} from '@/lib/utils';
import {
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

// Mock trending videos
const MOCK_TRENDING: TrendingVideo[] = [
  {
    id: '1',
    title: 'The Future of AI: What You Need to Know',
    description: 'Exploring the latest developments in artificial intelligence.',
    thumbnail: '',
    channelId: 'channel1',
    channelTitle: 'Tech Insights',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    duration: 'PT15M30S',
    viewCount: 2500000,
    likeCount: 150000,
    commentCount: 12000,
    viralScore: 95,
    viewVelocity: 2500,
    category: '28',
    region: 'US',
  },
  {
    id: '2',
    title: 'I Spent 24 Hours in the World\'s Most Dangerous Place',
    description: 'An adventure into the unknown.',
    thumbnail: '',
    channelId: 'channel2',
    channelTitle: 'Adventure Vlogs',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    duration: 'PT25M45S',
    viewCount: 1800000,
    likeCount: 98000,
    commentCount: 8500,
    viralScore: 88,
    viewVelocity: 1800,
    category: '22',
    region: 'US',
  },
  {
    id: '3',
    title: 'This New Game Will Change Everything',
    description: 'First look at the most anticipated game of 2024.',
    thumbnail: '',
    channelId: 'channel3',
    channelTitle: 'Gaming Central',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    duration: 'PT12M15S',
    viewCount: 3200000,
    likeCount: 210000,
    commentCount: 18000,
    viralScore: 92,
    viewVelocity: 3200,
    category: '20',
    region: 'US',
  },
  {
    id: '4',
    title: 'How to Cook the Perfect Steak',
    description: 'Master chef secrets revealed.',
    thumbnail: '',
    channelId: 'channel4',
    channelTitle: 'Cooking Masterclass',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    duration: 'PT8M30S',
    viewCount: 950000,
    likeCount: 65000,
    commentCount: 4200,
    viralScore: 78,
    viewVelocity: 950,
    category: '26',
    region: 'US',
  },
  {
    id: '5',
    title: 'The Untold Story of Space Exploration',
    description: 'A journey through the history of space travel.',
    thumbnail: '',
    channelId: 'channel5',
    channelTitle: 'Space Documentaries',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    duration: 'PT45M00S',
    viewCount: 750000,
    likeCount: 45000,
    commentCount: 3200,
    viralScore: 72,
    viewVelocity: 750,
    category: '27',
    region: 'US',
  },
];

export default function Trending() {
  const [videos, setVideos] = useState<TrendingVideo[]>(MOCK_TRENDING);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadTrending = async () => {
    setIsLoading(true);
    try {
      // In production, this would call the actual API
      // const trendingVideos = await getTrendingVideos(selectedRegion);
      // setVideos(trendingVideos);
      
      // For demo, shuffle and filter mock data
      setTimeout(() => {
        const shuffled = [...MOCK_TRENDING].sort(() => Math.random() - 0.5);
        setVideos(shuffled);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load trending videos');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, [selectedRegion, selectedCategory]);

  const getViralBadge = (score: number) => {
    if (score >= 90) return { label: 'Viral', color: 'bg-red-500' };
    if (score >= 80) return { label: 'Trending', color: 'bg-orange-500' };
    if (score >= 70) return { label: 'Rising', color: 'bg-yellow-500' };
    return { label: 'Normal', color: 'bg-gray-500' };
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
            Discover viral content and trending topics across YouTube.
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Viral Videos</p>
                <p className="text-xl font-bold">{videos.filter(v => v.viralScore >= 90).length}</p>
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
                <p className="text-xl font-bold">{videos.filter(v => v.viralScore >= 80).length}</p>
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
                  {formatNumber(Math.round(videos.reduce((sum, v) => sum + v.viewVelocity, 0) / videos.length))}/h
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
          <Button variant="outline" size="sm" onClick={loadTrending} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {videos.map((video, index) => {
              const viralBadge = getViralBadge(video.viralScore);
              return (
                <div
                  key={video.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
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
                        <Flame className="w-3 h-3 mr-1" />
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
                        <TrendingUp className="w-4 h-4" />
                        {video.viralScore} viral score
                      </span>
                      <span>{formatRelativeTime(video.publishedAt)}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
