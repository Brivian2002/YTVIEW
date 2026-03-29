import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Check, X, Zap, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Basic access for new users or casual analytics.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    badge: null,
    features: [
      { text: '5 searches per day', included: true },
      { text: 'Basic video & channel stats', included: true },
      { text: 'Limited trend tracking', included: true },
      { text: 'Limited exports', included: true },
      { text: 'Thumbnail tools', included: false },
      { text: 'SEO studio', included: false },
      { text: 'Transcript tools', included: false },
      { text: 'Revenue estimator', included: false },
      { text: 'Competitor tracking', included: false },
      { text: 'Bulk analysis', included: false },
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For active creators who need deeper analytics.',
    monthlyPrice: 10,
    yearlyPrice: 96,
    currency: 'USD',
    badge: 'Most Popular',
    features: [
      { text: '50 searches per day', included: true },
      { text: 'Full video & channel stats', included: true },
      { text: 'Unlimited trend tracking', included: true },
      { text: 'Unlimited exports', included: true },
      { text: 'Full thumbnail tools', included: true },
      { text: 'Complete SEO studio', included: true },
      { text: 'Transcript extraction', included: true },
      { text: 'Revenue estimator', included: true },
      { text: 'Medium historical tracking', included: true },
      { text: 'Saved projects', included: true },
      { text: 'Competitor tracking', included: false },
      { text: 'Bulk analysis', included: false },
    ],
    cta: 'Start Pro Trial',
    href: 'https://paystack.com/buy/ytubeview-pro-gxtcqd',
    popular: true,
  },
  {
    name: 'Premium',
    description: 'For professionals, agencies, and marketers.',
    monthlyPrice: 30,
    yearlyPrice: 288,
    currency: 'USD',
    badge: 'Best Value',
    features: [
      { text: '200 searches per day', included: true },
      { text: 'Everything in Pro', included: true },
      { text: 'Advanced competitor tracking', included: true },
      { text: 'Bulk analysis', included: true },
      { text: 'Priority data refresh', included: true },
      { text: 'Deeper historical analytics', included: true },
      { text: 'Advanced viral model', included: true },
      { text: 'Multi-channel comparisons', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'White-label reports', included: true },
      { text: 'Team collaboration', included: true },
    ],
    cta: 'Go Premium',
    href: 'https://paystack.com/buy/ytubeview-premium-plan-ftsqet',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any difference in cost.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and various local payment methods through Paystack.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, you can start with our Free plan and upgrade when you\'re ready. Pro and Premium plans also come with a 7-day free trial.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Absolutely. You can cancel your subscription at any time from your billing settings. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with our service.',
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);


  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground">
            Choose the plan that works best for you. All plans include a 7-day free trial.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={cn("text-sm", !isYearly && "font-medium")}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={cn("text-sm", isYearly && "font-medium")}>
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </span>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.popular && "border-primary shadow-lg scale-105"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="w-3 h-3 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {isYearly && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${plan.yearlyPrice} billed annually
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={cn(
                        "text-sm",
                        !feature.included && "text-muted-foreground/50"
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                  asChild
                >
                  <a
                    href={plan.href}
                    target={plan.href.startsWith('http') ? '_blank' : undefined}
                    rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <Button variant="outline" asChild>
            <Link to="/contact">
              Contact Support
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
