export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Platform Overview
        </h1>
        <p className="text-admin-primary-light">
          Welcome to AROHAN Platform Admin Dashboard
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="1,247"
          change="+12%"
          trend="up"
          color="admin-primary"
        />
        <MetricCard
          title="Total Companies"
          value="89"
          change="+8%"
          trend="up"
          color="admin-success"
        />
        <MetricCard
          title="Active Sessions"
          value="342"
          change="+15%"
          trend="up"
          color="admin-info"
        />
        <MetricCard
          title="Revenue (Monthly)"
          value="₹4,52,000"
          change="+18%"
          trend="up"
          color="admin-warning"
        />
      </div>

      {/* System Health */}
      <div className="bg-admin-background-secondary rounded-lg p-6 border border-admin-background-tertiary">
        <h2 className="text-xl font-semibold text-white mb-4">
          System Health Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ServiceStatus name="API" status="healthy" uptime="99.9%" />
          <ServiceStatus name="Database" status="healthy" uptime="99.8%" />
          <ServiceStatus name="Queue" status="degraded" uptime="99.5%" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-admin-background-secondary rounded-lg p-6 border border-admin-background-tertiary">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <ActivityItem
            message="New company onboarded: LogisticsPro Ltd"
            time="2 hours ago"
            type="company"
          />
          <ActivityItem
            message="User created: priya.sharma@logisticspro.com"
            time="3 hours ago"
            type="user"
          />
          <ActivityItem
            message="Subscription upgraded: Growth plan"
            time="5 hours ago"
            type="billing"
          />
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  trend,
  color,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}) {
  const colorClasses = {
    'admin-primary': 'from-admin-primary to-admin-primary-light',
    'admin-success': 'from-admin-success to-emerald-400',
    'admin-info': 'from-admin-info to-blue-400',
    'admin-warning': 'from-admin-warning to-amber-400',
  };

  return (
    <div className="bg-admin-background-secondary rounded-lg p-6 border border-admin-background-tertiary">
      <h3 className="text-sm font-medium text-admin-primary-light mb-2">
        {title}
      </h3>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div
        className={`text-sm ${
          trend === 'up' ? 'text-admin-success' : 'text-admin-danger'
        }`}
      >
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}

// Service Status Component
function ServiceStatus({
  name,
  status,
  uptime,
}: {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: string;
}) {
  const statusColors = {
    healthy: 'bg-admin-success',
    degraded: 'bg-admin-warning',
    unhealthy: 'bg-admin-danger',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-admin-background-tertiary rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        <span className="text-white font-medium">{name}</span>
      </div>
      <span className="text-admin-primary-light text-sm">{uptime}</span>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  message,
  time,
  type,
}: {
  message: string;
  time: string;
  type: 'user' | 'company' | 'billing' | 'system';
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-admin-background-tertiary rounded-lg">
      <div className="w-2 h-2 rounded-full bg-admin-primary mt-2" />
      <div className="flex-1">
        <p className="text-white text-sm">{message}</p>
        <p className="text-admin-primary-light text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
