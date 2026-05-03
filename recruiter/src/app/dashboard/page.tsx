export default function RecruiterOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Hiring Dashboard
        </h1>
        <p className="text-recruiter-primary-light">
          Welcome to AROHAN Recruiter Dashboard
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Campaigns"
          value="12"
          change="+2"
          trend="up"
          color="recruiter-primary"
        />
        <MetricCard
          title="Total Candidates"
          value="847"
          change="+156"
          trend="up"
          color="recruiter-success"
        />
        <MetricCard
          title="Screened Today"
          value="34"
          change="+8"
          trend="up"
          color="recruiter-info"
        />
        <MetricCard
          title="Shortlisted"
          value="23"
          change="+5"
          trend="up"
          color="recruiter-warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-recruiter-background-secondary rounded-lg p-6 border border-recruiter-background-tertiary">
        <h2 className="text-xl font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Create Campaign"
            description="Launch new hiring campaign"
            icon="📢"
            href="/dashboard/campaigns/new"
          />
          <QuickAction
            title="Upload Candidates"
            description="Bulk upload candidate data"
            icon="📤"
            href="/dashboard/candidates/upload"
          />
          <QuickAction
            title="View Analytics"
            description="Hiring performance insights"
            icon="📊"
            href="/dashboard/analytics"
          />
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="bg-recruiter-background-secondary rounded-lg p-6 border border-recruiter-background-tertiary">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Candidates
        </h2>
        <div className="space-y-3">
          <CandidateItem
            name="Rajesh Kumar"
            phone="+91 98765 43210"
            role="Delivery Partner"
            score="85"
            status="shortlisted"
            time="2 hours ago"
          />
          <CandidateItem
            name="Priya Sharma"
            phone="+91 87654 32109"
            role="Warehouse Associate"
            score="78"
            status="screened"
            time="3 hours ago"
          />
          <CandidateItem
            name="Amit Patel"
            phone="+91 76543 21098"
            role="Retail Staff"
            score="92"
            status="shortlisted"
            time="5 hours ago"
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
  return (
    <div className="bg-recruiter-background-secondary rounded-lg p-6 border border-recruiter-background-tertiary">
      <h3 className="text-sm font-medium text-recruiter-primary-light mb-2">
        {title}
      </h3>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div
        className={`text-sm ${
          trend === 'up' ? 'text-recruiter-success' : 'text-recruiter-danger'
        }`}
      >
        {trend === 'up' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}

// Quick Action Component
function QuickAction({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 p-4 bg-recruiter-background-tertiary rounded-lg hover:bg-recruiter-background-secondary transition-colors"
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-recruiter-primary-light text-sm">{description}</p>
      </div>
    </a>
  );
}

// Candidate Item Component
function CandidateItem({
  name,
  phone,
  role,
  score,
  status,
  time,
}: {
  name: string;
  phone: string;
  role: string;
  score: string;
  status: 'shortlisted' | 'screened' | 'pending';
  time: string;
}) {
  const statusColors = {
    shortlisted: 'bg-recruiter-success/20 text-recruiter-success',
    screened: 'bg-recruiter-info/20 text-recruiter-info',
    pending: 'bg-recruiter-warning/20 text-recruiter-warning',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-recruiter-background-tertiary rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-recruiter-primary rounded-full flex items-center justify-center text-white font-medium">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-white font-medium">{name}</p>
          <p className="text-recruiter-primary-light text-sm">{phone}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-sm">{role}</p>
        <p className="text-recruiter-primary-light text-xs">Score: {score}</p>
      </div>
      <div className="text-right">
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
          {status}
        </span>
        <p className="text-recruiter-primary-light text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
