import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  Search,
  Image,
  FileText,
  DollarSign,
  BarChart3,
  Zap,
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Channel Analytics',
    description: 'Deep insights into any YouTube channel with growth tracking, engagement metrics, and performance scores.',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Video Analysis',
    description: 'Analyze individual videos for performance, SEO optimization, and competitor comparison.',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: Image,
    title: 'Thumbnail Lab',
    description: 'Create, optimize, and A/B test thumbnails to maximize click-through rates.',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: Search,
    title: 'SEO Studio',
    description: 'Generate optimized titles, descriptions, tags, and keywords for better discoverability.',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: FileText,
    title: 'Transcript Tools',
    description: 'Extract, summarize, and analyze video transcripts for content insights.',
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Trend Intelligence',
    description: 'Discover viral content, track trends, and stay ahead of the competition.',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    icon: DollarSign,
    title: 'Revenue Estimator',
    description: 'Calculate potential earnings with RPM and CPM analytics for any channel.',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: Zap,
    title: 'Real-time Alerts',
    description: 'Get notified about viral videos, competitor uploads, and keyword movements.',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
];

const stats = [
  { value: '10M+', label: 'Videos Analyzed' },
  { value: '500K+', label: 'Channels Tracked' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Creator',
    avatar: 'SJ',
    content: 'Ytubeview transformed how I approach my YouTube strategy. The analytics are incredibly detailed and the SEO tools have helped me double my views.',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    role: 'Digital Marketer',
    avatar: 'MC',
    content: 'The competitor tracking features are game-changing. I can now monitor trends and adjust my strategy in real-time.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Agency Owner',
    avatar: 'ED',
    content: 'We manage 50+ channels and Ytubeview makes it easy to track performance across all of them. The reporting features save us hours every week.',
    rating: 5,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              🚀 Now with AI-powered SEO tools
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              YouTube Analytics{' '}
              <span className="text-gradient">Reimagined</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional-grade analytics, SEO optimization, and growth tools for YouTube creators, 
              agencies, and brands. Make data-driven decisions to grow your channel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link to="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </>
              )}
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free plan available</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to grow
            </h2>
            <p className="text-muted-foreground">
              Powerful tools and insights to help you understand your audience, 
              optimize your content, and grow your channel faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover-lift">
                <CardContent className="p-6">
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", feature.color)}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Get started in minutes and start making data-driven decisions for your channel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Channel',
                description: 'Sign up and connect your YouTube channel with a single click using Google OAuth.',
              },
              {
                step: '02',
                title: 'Analyze Performance',
                description: 'Get instant insights into your channel metrics, audience demographics, and content performance.',
              },
              {
                step: '03',
                title: 'Optimize & Grow',
                description: 'Use our SEO tools and recommendations to optimize your content and grow faster.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-muted/20 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by creators
            </h2>
            <p className="text-muted-foreground">
              See what our users have to say about Ytubeview.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to grow your channel?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators who use Ytubeview to make data-driven decisions 
              and grow their YouTube presence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
