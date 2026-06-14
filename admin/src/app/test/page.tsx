'use client';

import { StatCard, Card, CardHeader, CardTitle, CardContent, Button, Badge, Input } from '@/components';
import { Users, Building2, Activity, DollarSign, Search, Filter } from 'lucide-react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Component Test Page</h1>
          <p className="text-muted-foreground">Testing all new components</p>
        </div>

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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Component Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This is a test card component with proper styling.</p>
              <div className="mt-4 space-y-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Danger</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Test input field..." />
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive">Danger</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}