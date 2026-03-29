import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  Heart,
  Zap,
  Globe,
  Coffee,
  Laptop
} from 'lucide-react';

const benefits = [
  {
    icon: Globe,
    title: 'Remote First',
    description: 'Work from anywhere in the world. We believe in flexibility and work-life balance.',
  },
  {
    icon: Zap,
    title: 'Growth Opportunities',
    description: 'Continuous learning with professional development budget and mentorship programs.',
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and mental wellness support for you and your family.',
  },
  {
    icon: Coffee,
    title: 'Flexible Schedule',
    description: 'Work when you\'re most productive. We focus on results, not hours.',
  },
  {
    icon: Laptop,
    title: 'Latest Equipment',
    description: 'Top-of-the-line tech setup to help you do your best work.',
  },
  {
    icon: Users,
    title: 'Great Team',
    description: 'Join a diverse, inclusive team of passionate individuals who love what they do.',
  },
];

export default function Careers() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us empower creators worldwide. We're building the future of YouTube analytics.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Work With Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="group hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <Card>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No Open Positions</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              We're not actively hiring at the moment, but we're always interested in meeting 
              talented people. Feel free to send your resume and we'll keep it on file for 
              future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:careers@ytubeview.com">
                  Send Your Resume
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Email: careers@ytubeview.com
            </p>
          </CardContent>
        </Card>

        {/* Our Culture */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Culture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Mission-Driven</h3>
              <p className="text-muted-foreground">
                Every feature we build, every line of code we write, serves our mission: 
                to help creators succeed. We're passionate about democratizing access to 
                powerful analytics tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Innovation-Focused</h3>
              <p className="text-muted-foreground">
                We encourage experimentation and creative problem-solving. New ideas are 
                always welcome, and we believe the best solutions come from diverse perspectives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">User-First</h3>
              <p className="text-muted-foreground">
                Our users are at the center of everything we do. We actively listen to 
                feedback and continuously improve our product based on real user needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Transparent</h3>
              <p className="text-muted-foreground">
                We believe in open communication and honesty. Everyone on the team has 
                visibility into our goals, challenges, and decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
