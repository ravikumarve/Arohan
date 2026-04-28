"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Activity,
  Phone,
  Brain,
  FileText,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "agents", icon: Bot, label: "Agent Testing" },
    { id: "sessions", icon: Users, label: "Sessions" },
    { id: "integrations", icon: MessageSquare, label: "Integrations" },
    { id: "scorecards", icon: FileText, label: "Scorecards" },
    { id: "monitoring", icon: BarChart3, label: "Monitoring" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">AROHAN</h1>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const OverviewTab = () => {
  const [loading, setLoading] = useState(false);

  const handleLiveStatus = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Live status updated - All systems operational");
    }, 1000);
  };

  const handleTestIVR = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("IVR test initiated - Check your phone");
    }, 1000);
  };

  const handleTestWhatsApp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("WhatsApp test initiated - Check your WhatsApp");
    }, 1000);
  };

  const handleTestAgents = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Agent test initiated - All agents responding");
    }, 1000);
  };

  const handleRunDiagnostics = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Diagnostics complete - No issues found");
    }, 1500);
  };

  const stats = [
    { label: "Total Sessions", value: "1,234", change: "+12%", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Active Agents", value: "3", change: "0%", icon: Bot, color: "from-purple-500 to-pink-500" },
    { label: "Avg Score", value: "78.5", change: "+5%", icon: BarChart3, color: "from-green-500 to-emerald-500" },
    { label: "Success Rate", value: "94.2%", change: "+2%", icon: CheckCircle, color: "from-orange-500 to-red-500" },
  ];

  const systemHealth = [
    { service: "FastAPI", status: "healthy", uptime: "99.9%" },
    { service: "PostgreSQL", status: "healthy", uptime: "99.8%" },
    { service: "Redis", status: "healthy", uptime: "99.9%" },
    { service: "RabbitMQ", status: "healthy", uptime: "99.7%" },
    { service: "Twilio", status: "healthy", uptime: "99.5%" },
    { service: "Meta WhatsApp", status: "healthy", uptime: "99.6%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400">Monitor your AROHAN system performance</p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={handleLiveStatus}
          disabled={loading}
        >
          <Activity className="w-4 h-4 mr-2" />
          {loading ? "Loading..." : "Live Status"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/30">
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Health</CardTitle>
            <CardDescription className="text-slate-400">Real-time service status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.map((service) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${service.status === "healthy" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-white font-medium">{service.service}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={service.status === "healthy" ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}>
                      {service.status}
                    </Badge>
                    <span className="text-slate-400 text-sm">{service.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">Test and manage your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleTestIVR}
                disabled={loading}
              >
                <Phone className="w-4 h-4 mr-2" />
                Test IVR
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleTestWhatsApp}
                disabled={loading}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Test WhatsApp
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleTestAgents}
                disabled={loading}
              >
                <Bot className="w-4 h-4 mr-2" />
                Test Agents
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleRunDiagnostics}
                disabled={loading}
              >
                <Zap className="w-4 h-4 mr-2" />
                Run Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AgentsTab = () => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleTestAgent = (agentName: string) => {
    setLoadingStates(prev => ({ ...prev, [agentName]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [agentName]: false }));
      alert(`${agentName} test completed successfully`);
    }, 1500);
  };

  const agents = [
    {
      name: "Proctor Agent",
      description: "Conducts adaptive voice interviews",
      status: "active",
      lastRun: "2 minutes ago",
      successRate: "98.5%",
    },
    {
      name: "Assessor Agent",
      description: "Analyzes transcripts and generates scorecards",
      status: "active",
      lastRun: "5 minutes ago",
      successRate: "97.2%",
    },
    {
      name: "Matchmaker Agent",
      description: "Matches candidates to job requisitions",
      status: "active",
      lastRun: "10 minutes ago",
      successRate: "99.1%",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Agent Testing</h2>
        <p className="text-slate-400">Test and monitor your AI agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={agent.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                    {agent.status}
                  </Badge>
                </div>
                <CardTitle className="text-white">{agent.name}</CardTitle>
                <CardDescription className="text-slate-400">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Last Run</span>
                  <span className="text-white">{agent.lastRun}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-green-400">{agent.successRate}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => handleTestAgent(agent.name)}
                  disabled={loadingStates[agent.name]}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loadingStates[agent.name] ? "Testing..." : "Test Agent"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Agent Configuration</CardTitle>
          <CardDescription className="text-slate-400">Configure agent behavior and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="proctor">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="proctor">Proctor</TabsTrigger>
              <TabsTrigger value="assessor">Assessor</TabsTrigger>
              <TabsTrigger value="matchmaker">Matchmaker</TabsTrigger>
            </TabsList>
            <TabsContent value="proctor" className="mt-4 space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Interview Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Duration</span>
                    <span className="text-white">5 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Question Count</span>
                    <span className="text-white">5-10 adaptive</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Language Detection</span>
                    <span className="text-white">Auto</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="assessor" className="mt-4 space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Scoring Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Confidence Threshold</span>
                    <span className="text-white">0.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Keyword Weight</span>
                    <span className="text-white">0.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fluency Score</span>
                    <span className="text-white">Enabled</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="matchmaker" className="mt-4 space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">Matching Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Geo Radius</span>
                    <span className="text-white">50 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Score Threshold</span>
                    <span className="text-white">70</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auto-notify</span>
                    <span className="text-white">Enabled</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const SessionsTab = () => {
  const [loading, setLoading] = useState(false);
  const [viewingSession, setViewingSession] = useState<string | null>(null);

  const handleNewSession = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("New session created - Ready to start interview");
    }, 1000);
  };

  const handleViewSession = (sessionId: string) => {
    setViewingSession(sessionId);
    setTimeout(() => {
      setViewingSession(null);
      alert(`Viewing session ${sessionId} - Opening details`);
    }, 500);
  };

  const sessions = [
    {
      id: "SES-001",
      candidate: "Rahul Sharma",
      phone: "+91 98765 43210",
      language: "Hindi",
      status: "completed",
      score: 85,
      duration: "4:32",
      date: "2025-04-28",
    },
    {
      id: "SES-002",
      candidate: "Priya Patel",
      phone: "+91 87654 32109",
      language: "English",
      status: "in_progress",
      score: null,
      duration: "2:15",
      date: "2025-04-28",
    },
    {
      id: "SES-003",
      candidate: "Amit Kumar",
      phone: "+91 76543 21098",
      language: "Tamil",
      status: "completed",
      score: 72,
      duration: "5:10",
      date: "2025-04-27",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Candidate Sessions</h2>
          <p className="text-slate-400">View and manage interview sessions</p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={handleNewSession}
          disabled={loading}
        >
          <Users className="w-4 h-4 mr-2" />
          {loading ? "Creating..." : "New Session"}
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4 text-slate-400 font-medium">Session ID</th>
                <th className="text-left p-4 text-slate-400 font-medium">Candidate</th>
                <th className="text-left p-4 text-slate-400 font-medium">Phone</th>
                <th className="text-left p-4 text-slate-400 font-medium">Language</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Score</th>
                <th className="text-left p-4 text-slate-400 font-medium">Duration</th>
                <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="p-4 text-white font-mono">{session.id}</td>
                  <td className="p-4 text-white">{session.candidate}</td>
                  <td className="p-4 text-slate-400">{session.phone}</td>
                  <td className="p-4 text-white">{session.language}</td>
                  <td className="p-4">
                    <Badge className={
                      session.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      session.status === "in_progress" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }>
                      {session.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-white">{session.score ?? "-"}</td>
                  <td className="p-4 text-slate-400">{session.duration}</td>
                  <td className="p-4 text-slate-400">{session.date}</td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewSession(session.id)}
                      disabled={viewingSession === session.id}
                    >
                      {viewingSession === session.id ? "Loading..." : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

const IntegrationsTab = () => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleTestConnection = (integrationName: string) => {
    setLoadingStates(prev => ({ ...prev, [integrationName]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [integrationName]: false }));
      alert(`${integrationName} connection test successful`);
    }, 1500);
  };

  const integrations = [
    { name: "Twilio", status: "connected", type: "IVR & SMS", lastSync: "2 min ago" },
    { name: "Meta WhatsApp", status: "connected", type: "Messaging", lastSync: "5 min ago" },
    { name: "Bhashini", status: "connected", type: "Speech-to-Text", lastSync: "1 min ago" },
    { name: "OpenAI", status: "connected", type: "AI Services", lastSync: "3 min ago" },
    { name: "Pinecone", status: "connected", type: "Vector Database", lastSync: "10 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Integration Testing</h2>
        <p className="text-slate-400">Test and monitor external service integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <Badge className={integration.status === "connected" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                    {integration.status}
                  </Badge>
                </div>
                <CardTitle className="text-white">{integration.name}</CardTitle>
                <CardDescription className="text-slate-400">{integration.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Last Sync</span>
                  <span className="text-white">{integration.lastSync}</span>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleTestConnection(integration.name)}
                  disabled={loadingStates[integration.name]}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loadingStates[integration.name] ? "Testing..." : "Test Connection"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ScorecardsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Scorecards</h2>
        <p className="text-slate-400">View AI-generated candidate scorecards</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Scorecards</CardTitle>
          <CardDescription className="text-slate-400">Latest AI assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No scorecards available yet</p>
            <p className="text-sm mt-2">Complete an interview session to generate scorecards</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MonitoringTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Monitoring</h2>
        <p className="text-slate-400">Real-time metrics and performance monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
            <CardDescription className="text-slate-400">System performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-400">
              <BarChart3 className="w-12 h-12 opacity-50" />
              <span className="ml-2">Charts will be displayed here</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Resource Usage</CardTitle>
            <CardDescription className="text-slate-400">CPU, Memory, and Network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">CPU Usage</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[45%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Memory Usage</span>
                  <span className="text-white">62%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[62%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Network I/O</span>
                  <span className="text-white">28%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[28%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // API Configuration State
  const [apiConfig, setApiConfig] = useState({
    apiUrl: "http://localhost:8000",
    wsUrl: "ws://localhost:8000",
    apiKey: "",
    apiTimeout: "30",
    maxRetries: "3",
  });

  // Notification Settings State
  const [notificationConfig, setNotificationConfig] = useState({
    emailEnabled: true,
    smsEnabled: true,
    whatsappEnabled: true,
    emailAlerts: "critical,warning",
    smsAlerts: "critical",
    whatsappAlerts: "critical,warning",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  // Security Settings State
  const [securityConfig, setSecurityConfig] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireTwoFactor: false,
    ipWhitelist: "",
    allowedOrigins: "http://localhost:3000",
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
    setSaveSuccess(null);
  };

  const handleSaveApiConfig = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess("api");
      setTimeout(() => setSaveSuccess(null), 3000);
    }, 1500);
  };

  const handleSaveNotificationConfig = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess("notification");
      setTimeout(() => setSaveSuccess(null), 3000);
    }, 1500);
  };

  const handleSaveSecurityConfig = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess("security");
      setTimeout(() => setSaveSuccess(null), 3000);
    }, 1500);
  };

  const handleResetApiConfig = () => {
    setApiConfig({
      apiUrl: "http://localhost:8000",
      wsUrl: "ws://localhost:8000",
      apiKey: "",
      apiTimeout: "30",
      maxRetries: "3",
    });
  };

  const handleResetNotificationConfig = () => {
    setNotificationConfig({
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: true,
      emailAlerts: "critical,warning",
      smsAlerts: "critical",
      whatsappAlerts: "critical,warning",
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    });
  };

  const handleResetSecurityConfig = () => {
    setSecurityConfig({
      sessionTimeout: "30",
      maxLoginAttempts: "5",
      passwordMinLength: "8",
      requireTwoFactor: false,
      ipWhitelist: "",
      allowedOrigins: "http://localhost:3000",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400">Configure your AROHAN system</p>
      </div>

      <div className="space-y-4">
        {/* API Configuration Section */}
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div
            className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
            onClick={() => toggleSection("api")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">API Configuration</h3>
                  <p className="text-sm text-slate-400">Configure API keys and endpoints</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess === "api" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Saved
                  </Badge>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === "api" ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {expandedSection === "api" && (
            <div className="px-6 pb-6 border-t border-slate-800 pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">API URL</label>
                    <input
                      type="text"
                      value={apiConfig.apiUrl}
                      onChange={(e) => setApiConfig({ ...apiConfig, apiUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="http://localhost:8000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">WebSocket URL</label>
                    <input
                      type="text"
                      value={apiConfig.wsUrl}
                      onChange={(e) => setApiConfig({ ...apiConfig, wsUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="ws://localhost:8000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">API Key</label>
                  <input
                    type="password"
                    value={apiConfig.apiKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">API Timeout (seconds)</label>
                    <input
                      type="number"
                      value={apiConfig.apiTimeout}
                      onChange={(e) => setApiConfig({ ...apiConfig, apiTimeout: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Max Retries</label>
                    <input
                      type="number"
                      value={apiConfig.maxRetries}
                      onChange={(e) => setApiConfig({ ...apiConfig, maxRetries: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={handleSaveApiConfig}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetApiConfig}
                    disabled={loading}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Notification Settings Section */}
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div
            className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
            onClick={() => toggleSection("notification")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                  <p className="text-sm text-slate-400">Configure alerts and notifications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess === "notification" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Saved
                  </Badge>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === "notification" ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {expandedSection === "notification" && (
            <div className="px-6 pb-6 border-t border-slate-800 pt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Email Notifications</div>
                        <div className="text-sm text-slate-400">Receive alerts via email</div>
                      </div>
                      <button
                        onClick={() => setNotificationConfig({ ...notificationConfig, emailEnabled: !notificationConfig.emailEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationConfig.emailEnabled ? "bg-purple-500" : "bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            notificationConfig.emailEnabled ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">SMS Notifications</div>
                        <div className="text-sm text-slate-400">Receive alerts via SMS</div>
                      </div>
                      <button
                        onClick={() => setNotificationConfig({ ...notificationConfig, smsEnabled: !notificationConfig.smsEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationConfig.smsEnabled ? "bg-purple-500" : "bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            notificationConfig.smsEnabled ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">WhatsApp Notifications</div>
                        <div className="text-sm text-slate-400">Receive alerts via WhatsApp</div>
                      </div>
                      <button
                        onClick={() => setNotificationConfig({ ...notificationConfig, whatsappEnabled: !notificationConfig.whatsappEnabled })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationConfig.whatsappEnabled ? "bg-purple-500" : "bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            notificationConfig.whatsappEnabled ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Alert Levels</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Email Alert Levels</label>
                      <input
                        type="text"
                        value={notificationConfig.emailAlerts}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, emailAlerts: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="critical,warning,info"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">SMS Alert Levels</label>
                      <input
                        type="text"
                        value={notificationConfig.smsAlerts}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, smsAlerts: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="critical"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">WhatsApp Alert Levels</label>
                      <input
                        type="text"
                        value={notificationConfig.whatsappAlerts}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, whatsappAlerts: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="critical,warning"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Quiet Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Start Time</label>
                      <input
                        type="time"
                        value={notificationConfig.quietHoursStart}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, quietHoursStart: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">End Time</label>
                      <input
                        type="time"
                        value={notificationConfig.quietHoursEnd}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, quietHoursEnd: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={handleSaveNotificationConfig}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetNotificationConfig}
                    disabled={loading}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Security Settings Section */}
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <div
            className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
            onClick={() => toggleSection("security")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                  <p className="text-sm text-slate-400">Manage authentication and authorization</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess === "security" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Saved
                  </Badge>
                )}
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === "security" ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {expandedSection === "security" && (
            <div className="px-6 pb-6 border-t border-slate-800 pt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Session Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={securityConfig.sessionTimeout}
                        onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeout: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Max Login Attempts</label>
                      <input
                        type="number"
                        value={securityConfig.maxLoginAttempts}
                        onChange={(e) => setSecurityConfig({ ...securityConfig, maxLoginAttempts: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Password Policy</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Minimum Password Length</label>
                    <input
                      type="number"
                      value={securityConfig.passwordMinLength}
                      onChange={(e) => setSecurityConfig({ ...securityConfig, passwordMinLength: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="8"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="text-white font-medium">Require 2FA</div>
                      <div className="text-sm text-slate-400">Enforce two-factor authentication for all users</div>
                    </div>
                    <button
                      onClick={() => setSecurityConfig({ ...securityConfig, requireTwoFactor: !securityConfig.requireTwoFactor })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        securityConfig.requireTwoFactor ? "bg-purple-500" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          securityConfig.requireTwoFactor ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Access Control</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">IP Whitelist (comma-separated)</label>
                      <input
                        type="text"
                        value={securityConfig.ipWhitelist}
                        onChange={(e) => setSecurityConfig({ ...securityConfig, ipWhitelist: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="192.168.1.1,10.0.0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Allowed Origins (CORS)</label>
                      <input
                        type="text"
                        value={securityConfig.allowedOrigins}
                        onChange={(e) => setSecurityConfig({ ...securityConfig, allowedOrigins: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="http://localhost:3000,https://yourdomain.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={handleSaveSecurityConfig}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetSecurityConfig}
                    disabled={loading}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "agents":
        return <AgentsTab />;
      case "sessions":
        return <SessionsTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "scorecards":
        return <ScorecardsTab />;
      case "monitoring":
        return <MonitoringTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        {renderTab()}
      </main>
    </div>
  );
}
