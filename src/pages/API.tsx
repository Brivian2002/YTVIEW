import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  Check,
  Clock,
  Database
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Data',
    description: 'Access up-to-the-minute analytics for any YouTube channel or video.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Data from all regions and languages, worldwide.',
  },
  {
    icon: Database,
    title: 'Historical Data',
    description: 'Access months of historical performance data.',
  },
];

const endpoints = [
  {
    method: 'GET',
    path: '/v1/channels/{id}',
    description: 'Get detailed channel analytics',
  },
  {
    method: 'GET',
    path: '/v1/videos/{id}',
    description: 'Get video performance metrics',
  },
  {
    method: 'GET',
    path: '/v1/trending',
    description: 'Get trending videos by region',
  },
  {
    method: 'POST',
    path: '/v1/analyze',
    description: 'Analyze SEO and get recommendations',
  },
];

export default function APIPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ytubeview API</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful YouTube analytics at your fingertips. Build amazing applications 
            with our comprehensive API.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <Card className="mb-12 border-dashed">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Launching Q2 2024</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              We're putting the finishing touches on our API. Be the first to know 
              when it launches and get early access pricing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild>
                <Link to="/contact">
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:api@ytubeview.com">
                  Contact Sales
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">API Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">API Endpoints Preview</h2>
          <Card>
            <CardContent className="p-0">
              {endpoints.map((endpoint, index) => (
                <div 
                  key={endpoint.path}
                  className={`flex items-center gap-4 p-4 ${index !== endpoints.length - 1 ? 'border-b' : ''}`}
                >
                  <Badge 
                    variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                    className="w-16 justify-center"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {endpoint.description}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Planned Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    10,000 requests/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Basic endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Email support
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Pro</h3>
                  <Badge>Popular</Badge>
                </div>
                <div className="text-3xl font-bold mb-4">$149<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    100,000 requests/month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    All endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Historical data
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">Custom</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlimited requests
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Custom endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Dedicated support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    SLA guarantee
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get early access to our API and start building powerful YouTube analytics 
            into your applications.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Get Early Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
