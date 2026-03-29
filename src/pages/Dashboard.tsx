import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores';
import { 
  formatNumber, 
  formatRelativeTime 
} from '@/lib/utils';
import {
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

// Mock data for the dashboard
const mockChartData = [
  { date: 'Mon', views: 12000, subscribers: 150, engagement: 4.2 },
  { date: 'Tue', views: 15000, subscribers: 180, engagement: 4.5 },
  { date: 'Wed', views: 18000, subscribers: 220, engagement: 4.8 },
  { date: 'Thu', views: 14000, subscribers: 190, engagement: 4.1 },
  { date: 'Fri', views: 22000, subscribers: 280, engagement: 5.2 },
  { date: 'Sat', views: 28000, subscribers: 350, engagement: 5.8 },
  { date: 'Sun', views: 25000, subscribers: 320, engagement: 5.5 },
];

const mockRecentVideos = [
  {
    id: '1',
    title: 'How to Grow Your YouTube Channel in 2024',
    thumbnail: 'https://i.ytimg.com/vi/123/maxresdefault.jpg',
    views: 45200,
    likes: 3200,
    comments: 180,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    performance: 'up',
  },
  {
    id: '2',
    title: 'YouTube SEO Secrets Revealed',
    thumbnail: 'https://i.ytimg.com/vi/456/maxresdefault.jpg',
    views: 28900,
    likes: 2100,
    comments: 95,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    performance: 'up',
  },
  {
    id: '3',
    title: 'Thumbnail Design Masterclass',
    thumbnail: 'https://i.ytimg.com/vi/789/maxresdefault.jpg',
    views: 15600,
    likes: 1200,
    comments: 67,
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    performance: 'down',
  },
];

const mockAlerts = [
  {
    id: '1',
    type: 'viral',
    title: 'Viral Video Detected',
    message: 'Your video "How to Grow Your YouTube Channel" is trending!',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Subscriber Milestone',
    message: 'Congratulations! You reached 10,000 subscribers.',
    time: '1 day ago',
  },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

      {/* Charts & Content */}
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

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'viral' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <Link to="/settings">
                View All Alerts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Videos</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/video-analyzer">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(video.publishedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.views)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {formatNumber(video.likes)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {formatNumber(video.comments)}
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  video.performance === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {video.performance === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
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
