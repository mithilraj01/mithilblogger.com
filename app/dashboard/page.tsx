'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Content Optimized',
      value: '24',
      change: '+12%',
      icon: Zap,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Avg Visibility Score',
      value: '87',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'AI Requests Used',
      value: '18/30',
      change: '60%',
      icon: Target,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Ranking Probability',
      value: '92%',
      change: '+8%',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's your AI visibility overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} opacity-20 flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-green-400">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest optimization actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-xl glass-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Content Optimized</p>
                  <p className="text-sm text-muted-foreground">
                    Blog post optimized for AI search engines
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  2h ago
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visibility Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Visibility Trends</CardTitle>
          <CardDescription>
            Your AI search visibility over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
              <p className="text-muted-foreground">Chart visualization would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
