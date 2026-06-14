'use client';

import { useState } from 'react';
import { 
  StatCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Badge, 
  Input,
  ThemeToggle,
  LanguageSwitcher
} from '@/components';
import { Users, Building2, Activity, DollarSign, Search, Filter, Moon, Sun } from 'lucide-react';

export default function WorkingDemo() {
  const [searchValue, setSearchValue] = useState('');
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">✅ Working Component Demo</h1>
            <p className="text-muted-foreground">All new components are working properly!</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => setCount(count + 1)}>
                Count: {count}
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>

            <div className="flex gap-2">
              <Input 
                placeholder="Type something..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="max-w-md"
              />
              <span className="text-muted-foreground self-center">
                You typed: {searchValue || '(nothing)'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="1,247"
            change={{ value: 12, trend: "up" }}
            icon={<Users className="w-5 h-5" />}
            delay={0}
          />
          <StatCard
            title="Total Companies"
            value="89"
            change={{ value: 8, trend: "up" }}
            icon={<Building2 className="w-5 h-5" />}
            delay={0.1}
          />
          <StatCard
            title="Active Sessions"
            value="342"
            change={{ value: 15, trend: "up" }}
            icon={<Activity className="w-5 h-5" />}
            delay={0.2}
          />
          <StatCard
            title="Revenue"
            value="₹4,52,000"
            change={{ value: 18, trend: "up" }}
            icon={<DollarSign className="w-5 h-5" />}
            delay={0.3}
          />
        </div>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Badge variant="success">Success Badge</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="border-green-500 bg-green-500/10">
          <CardHeader>
            <CardTitle className="text-green-500">🎉 Success!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600 dark:text-green-400">
              All components are working correctly! The UI now uses proper CSS variables,
              has consistent theming, and follows modern React best practices.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}