'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/constants';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Shield, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'GEO Content Optimizer',
      description: 'Transform your content to rank higher in AI search results with advanced optimization.',
    },
    {
      icon: Target,
      title: 'AEO Answer Engine',
      description: 'Generate perfect answers for voice assistants and AI chatbots.',
    },
    {
      icon: TrendingUp,
      title: 'AI Visibility Scoring',
      description: 'Track your content performance across ChatGPT and Gemini.',
    },
    {
      icon: Zap,
      title: 'Competitor Analysis',
      description: 'Analyze and outrank competitor content with AI-powered insights.',
    },
    {
      icon: Shield,
      title: 'Auto-Publish',
      description: 'Push optimized content directly to WordPress and other platforms.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Monitor your AI search visibility with comprehensive analytics.',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      description: 'Perfect for individuals',
      features: [
        '30 AI optimizations/month',
        '1 website',
        'GEO & AEO tools',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      name: 'Growth',
      price: '$199',
      description: 'For growing businesses',
      popular: true,
      features: [
        '200 AI optimizations/month',
        '5 websites',
        'Advanced competitor analysis',
        'Auto-publish to WordPress',
        'Priority support',
        'API access',
      ],
    },
    {
      name: 'Agency',
      price: '$499',
      description: 'For agencies & enterprises',
      features: [
        'Unlimited optimizations',
        'Unlimited websites',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
        'Full API access',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold glow-text">GEOFORGE</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="#pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full glass text-sm font-medium">
                🚀 AI Search Optimization Platform
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Own Your
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent glow-text">
                AI Search Visibility
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Optimize your content for AI search engines. Rank higher in ChatGPT, Gemini, and the next generation of search.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" className="text-base px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="glass-card p-8 glow-border">
                <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-20 h-20 mx-auto mb-4 text-cyan-400" />
                    <p className="text-muted-foreground">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"> AI Visibility</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to dominate AI search results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-hover h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`relative h-full ${plan.popular ? 'border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={ROUTES.REGISTER}>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-2 border-cyan-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
              <CardContent className="relative p-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Ready to Dominate AI Search?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of businesses optimizing their content for the AI-first future
                </p>
                <Link href={ROUTES.REGISTER}>
                  <Button size="lg" className="text-base px-8">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 GEOFORGE Enterprise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
