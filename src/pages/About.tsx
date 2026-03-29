import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Zap, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Globe,
  ArrowRight,
  Play,
  Award,
  Shield
} from 'lucide-react';

const stats = [
  { value: '10M+', label: 'Videos Analyzed' },
  { value: '500K+', label: 'Channels Tracked' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
];

const values = [
  {
    icon: Target,
    title: 'Data-Driven Insights',
    description: 'We believe in the power of data to transform content creation. Our platform provides actionable analytics that help creators make informed decisions.',
  },
  {
    icon: Zap,
    title: 'Innovation First',
    description: 'We constantly evolve our tools to stay ahead of platform changes and provide cutting-edge features for our users.',
  },
  {
    icon: Users,
    title: 'Creator-Centric',
    description: 'Everything we build is designed with creators in mind. We understand the challenges of growing a channel and aim to solve them.',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your data is yours. We prioritize security and transparency in everything we do, ensuring your information remains protected.',
  },
];

export default function About() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ytubeview</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering creators with professional-grade YouTube analytics and growth tools. 
            Our mission is to help every creator unlock their full potential.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <Card className="mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Ytubeview, we believe that every creator deserves access to powerful analytics 
                  tools that were once only available to large media companies. Our platform democratizes 
                  YouTube intelligence, making it accessible to creators of all sizes—from those just 
                  starting out to established channels with millions of subscribers.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We combine advanced data analysis with intuitive design to help you understand 
                  your audience, optimize your content, and grow your channel faster than ever before.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Comprehensive Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep insights into channel performance, audience demographics, 
                      engagement metrics, and growth trends.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Trend Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover viral content, track trending topics, and stay ahead 
                      of the competition with real-time insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SEO Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered tools for generating optimized titles, descriptions, 
                      tags, and thumbnails that drive more views.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Competitor Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your competitors, analyze their strategies, and identify 
                      opportunities to outperform them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Channel?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of creators who use Ytubeview to make data-driven decisions 
            and accelerate their YouTube growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
