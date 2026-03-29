import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores';
import { getTrendingVideos } from '@/lib/youtubeApi';
import type { Video } from '@/types';
import { 
  formatNumber, 
  formatRelativeTime 
} from '@/lib/utils';
import{
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  Zap,
  ArrowRight,
  Play,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Loader2,
  Flame,
} from 'lucide-react';
import{
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Mock chart data for analytics
const mockChartData = [
  { date: 'Mon', views: 12000, subscribers: 150, engagement: 4.2 },
  { date: 'Tue', views: 15000, subscribers: 180, engagement: 4.5 },
  { date: 'Wed', views: 18000, subscribers: 220, engagement: 4.8 },
  { date: 'Thu', views: 14000, subscribers: 190, engagement: 4.1 },
  { date: 'Fri', views: 22000, subscribers: 280, engagement: 5.2 },
  { date: 'Sat', views: 28000, subscribers: 350, engagement: 5.8 },
  { date: 'Sun', views: 25000, subscribers: 320, engagement: 5.5 },
];

// Calculate viral score
const calculateViralScore = (video: Video): number => {
  const views = video.viewCount;
  const likes = video.likeCount;
  const comments = video.commentCount;
  const publishedAt = new Date(video.publishedAt);
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  
  if (hoursSince === 0 || hoursSince > 168) return 0; // Only videos from last 7 days
  
  const viewVelocity = views / hoursSince;
  const engagementRate = views > 0 ? (likes + comments) / views : 0;
  
  const score = Math.min(100, (viewVelocity / 1000) * 15 + engagementRate * 200);
  return Math.round(score);
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [viralVideos, setViralVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch trending videos for recent/viral section
  const fetchRecentVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const trending = await getTrendingVideos('US', 20);
      
      // Sort by published date (most recent first)
      const sortedByDate = [...trending].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      // Get top 5 most recent
      setRecentVideos(sortedByDate.slice(0, 5));
      
      // Calculate viral scores and filter viral videos (score > 60)
      const withViralScore = trending.map(v => ({
        ...v,
        viralScore: calculateViralScore(v)
      }));
      
      const viral = withViralScore
        .filter(v => v.viralScore > 60)
        .sort((a, b) => b.viralScore - a.viralScore)
        .slice(0, 3);
      
      setViralVideos(viral);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRecentVideos();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRecentVideos, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const plan = user?.plan || 'free';
  const dailySearches = user?.dailySearches || 0;
  const searchLimit = plan === 'premium' ? 200 : plan === 'pro' ? 50 : 5;
  const searchPercentage = (dailySearches / searchLimit) * 100;

  const stats = [
    {
      title: 'Total Views',
      value: 156000,
      change: 12.5,
      icon: Eye,
      trend: 'up',
    },
    {
      title: 'Subscribers',
      value: 12500,
      change: 8.2,
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Engagement Rate',
      value: 4.8,
      change: -2.1,
      icon: Heart,
      trend: 'down',
      suffix: '%',
    },
    {
      title: 'Est. Revenue',
      value: 1240,
      change: 15.3,
      icon: DollarSign,
      trend: 'up',
      prefix: '$',
    },
  ];

  const openOnYouTube = (videoId: string) => {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your channel today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/channel-analyzer">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyze Channel
            </Link>
          </Button>
          <Button asChild>
            <Link to="/video-analyzer">
              <Play className="w-4 h-4 mr-2" />
              Analyze Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Daily Searches</p>
                <p className="text-sm text-muted-foreground">
                  {dailySearches} of {searchLimit} used today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 sm:w-48">
                <Progress value={searchPercentage} className="h-2" />
              </div>
              <Badge variant={searchPercentage > 80 ? 'destructive' : 'secondary'}>
                {Math.round(searchPercentage)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">
                  {stat.prefix}{formatNumber(stat.value)}{stat.suffix}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Viral Videos */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
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

        {/* Viral Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              Trending Now
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={fetchRecentVideos}
              disabled={isLoadingVideos}
            >
              {isLoadingVideos ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {viralVideos.length > 0 ? (
                viralVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => openOnYouTube(video.id)}
                  >
                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {video.thumbnail ? (
                        <>
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <Play className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Flame className="w-3 h-3 mr-1 text-red-500" />
                          {calculateViralScore(video)} viral
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(video.viewCount)} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {isLoadingVideos ? (
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  ) : (
                    <Flame className="w-8 h-8 mx-auto mb-2" />
                  )}
                  <p className="text-sm">
                    {isLoadingVideos ? 'Loading trending videos...' : 'No viral videos detected'}
                  </p>
                </div>
              )}
            </div>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Updated {formatRelativeTime(lastUpdated.toISOString())}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Recent Videos
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {formatRelativeTime(lastUpdated.toISOString())}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchRecentVideos}
              disabled={isLoadingVideos}
            >
              {isLoadingVideos ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/trending">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVideos.length > 0 ? (
              recentVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => openOnYouTube(video.id)}
                >
                  <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                    {video.thumbnail ? (
                      <>
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <Play className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">{video.title}</p>
                    <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(video.publishedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(video.viewCount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(video.likeCount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {formatNumber(video.commentCount)}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {isLoadingVideos ? (
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                ) : (
                  <Play className="w-12 h-12 mx-auto mb-4" />
                )}
                <p>{isLoadingVideos ? 'Loading recent videos...' : 'No recent videos found'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Analyze Channel', href: '/channel-analyzer', icon: Users },
          { label: 'Analyze Video', href: '/video-analyzer', icon: Play },
          { label: 'SEO Studio', href: '/seo-studio', icon: Zap },
          { label: 'Trending', href: '/trending', icon: TrendingUp },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-4 justify-start"
            asChild
          >
            <Link to={action.href}>
              <action.icon className="w-5 h-5 mr-3" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
