import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, TrendingUp, Search, Image } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'How to Use Channel Analytics to Triple Your Growth',
    excerpt: 'Learn how to leverage Ytubeview\'s channel analyzer to identify growth opportunities, understand your audience, and optimize your content strategy for maximum impact.',
    category: 'Analytics',
    readTime: '8 min read',
    date: 'March 15, 2024',
    icon: TrendingUp,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 2,
    title: 'Master YouTube SEO: A Complete Guide to Ranking Higher',
    excerpt: 'Discover proven SEO strategies using Ytubeview\'s SEO Studio. From keyword research to optimized descriptions, learn how to make your videos discoverable.',
    category: 'SEO',
    readTime: '12 min read',
    date: 'March 10, 2024',
    icon: Search,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 3,
    title: 'Thumbnail Design Secrets That Boost Click-Through Rates',
    excerpt: 'Unlock the psychology behind high-performing thumbnails. Learn how to use Ytubeview\'s Thumbnail Lab to create visuals that stop the scroll and drive clicks.',
    category: 'Design',
    readTime: '10 min read',
    date: 'March 5, 2024',
    icon: Image,
    color: 'bg-purple-500/10 text-purple-500',
  },
];

export default function Blog() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ytubeview Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tips, strategies, and insights to help you grow your YouTube channel faster.
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 md:p-12 flex items-center">
                <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="p-8 md:p-12">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="text-2xl font-bold mb-4">
                  The Ultimate Guide to YouTube Growth in 2024
                </h2>
                <p className="text-muted-foreground mb-6">
                  A comprehensive roadmap to growing your YouTube channel using data-driven 
                  strategies. Learn how top creators use analytics to make informed decisions 
                  and consistently outperform their competition.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    March 20, 2024
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    15 min read
                  </span>
                </div>
                <Link 
                  to="#" 
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${post.color}`}>
                  <post.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>
                <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <Link 
                  to="#" 
                  className="inline-flex items-center text-sm text-primary font-medium hover:underline"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get the latest YouTube growth tips and Ytubeview updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-input bg-background"
              />
              <button className="w-full sm:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
