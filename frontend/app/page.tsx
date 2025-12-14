"use client";

import React, { useEffect, useState } from "react";

type AgentType = "agent" | "tool" | "mcp_server";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  version?: string;
  headline?: string;
  summary?: string;
  description?: string;
  capabilities?: string[];
  frameworks?: string[];
  providers?: string[];
  tags?: string[];
  avatarUrl?: string;
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: "agent:data-analyzer-pro@1.0.0",
    name: "DataAnalyzer Pro",
    type: "agent",
    headline: "Advanced Data Processing",
    summary:
      "Real-time data analysis, predictive modeling, and BI insights.",
    capabilities: ["Python", "ML", "Analytics"],
    avatarUrl: "https://picsum.photos/80?random=1"
  },
  {
    id: "agent:supportbot-3000@1.0.0",
    name: "SupportBot 3000",
    type: "agent",
    headline: "Customer Service Automation",
    summary:
      "24/7 customer support with natural language processing and sentiment analysis.",
    capabilities: ["NLP", "Support", "JavaScript"],
    avatarUrl: "https://picsum.photos/80?random=2"
  },
  {
    id: "agent:cyberguard-ai@1.0.0",
    name: "CyberGuard AI",
    type: "agent",
    headline: "Cybersecurity & Threat Detection",
    summary:
      "Real-time security monitoring, threat detection, and automated incident response.",
    capabilities: ["Security", "Monitoring", "Go"],
    avatarUrl: "https://picsum.photos/80?random=3"
  }
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface AuthState {
  emailOrId: string;
  password: string;
}

interface RegisterState {
  matrixUid: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AgentRegisterState {
  matrixUid: string;
  displayName: string;
  headline: string;
  skills: string;
}

function AgentCard(props: {
  agent: Agent;
  onDownload: (agent: Agent) => void;
  onInstall: (agent: Agent) => void;
}) {
  const { agent, onDownload, onInstall } = props;
  const tags =
    agent.tags ||
    agent.capabilities ||
    agent.frameworks ||
    agent.providers ||
    [];

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img
          src={
            agent.avatarUrl ||
            `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(
              agent.name
            )}`
          }
          alt={agent.name}
          className="w-16 h-16 rounded-full mr-4 flex-shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-lg truncate">{agent.name}</h3>
          <p className="text-gray-600 text-sm truncate">
            {agent.headline || agent.summary || agent.description || "AI Agent"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {agent.type.toUpperCase()}
            {agent.version ? ` • v${agent.version}` : null}
          </p>
        </div>
      </div>
      <p className="text-gray-700 mb-4 flex-1">
        {agent.summary || agent.description || "No description provided."}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto space-y-2">
        <button
          onClick={() => onDownload(agent)}
          className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md transition-colors text-sm font-medium"
        >
          <i className="fas fa-download mr-2" />
          Download Agent
        </button>
        <button
          onClick={() => onInstall(agent)}
          className="w-full border border-primary text-primary hover:bg-primary/5 py-2 rounded-md transition-colors text-sm font-medium"
        >
          <i className="fas fa-plug mr-2" />
          Install via MCP
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAgentRegisterModal, setShowAgentRegisterModal] = useState(false);

  const [auth, setAuth] = useState<AuthState>({
    emailOrId: "",
    password: ""
  });
  const [register, setRegister] = useState<RegisterState>({
    matrixUid: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agentRegister, setAgentRegister] = useState<AgentRegisterState>({
    matrixUid: "",
    displayName: "",
    headline: "",
    skills: ""
  });

  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AgentType | "all">("all");

  useEffect(() => {
    // Initial load from backend (best-effort)
    void loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAgents(query?: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (typeFilter !== "all") params.set("type", typeFilter);
      const res = await fetch(
        `${API_BASE.replace(/\/$/, "")}/network/agents?${
          params.toString() || ""
        }`,
        {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch agents (${res.status})`);
      }
      const data = await res.json();

      const items: any[] =
        (Array.isArray(data) && data) ||
        data.items ||
        data.agents ||
        data.results ||
        [];
      if (!Array.isArray(items)) {
        throw new Error("Unexpected agents payload shape");
      }

      const mapped: Agent[] = items.map((raw) => ({
        id: raw.uid || raw.id,
        name: raw.name,
        type: (raw.type as AgentType) || "agent",
        version: raw.version,
        headline: raw.summary,
        summary: raw.summary,
        description: raw.description,
        capabilities: raw.capabilities,
        frameworks: raw.frameworks,
        providers: raw.providers,
        tags: raw.tags || raw.capabilities
      }));
      if (mapped.length > 0) {
        setAgents(mapped);
      }
    } catch (e: any) {
      console.error("Failed to load agents", e);
      setError(e?.message || "Failed to load agents from backend");
    } finally {
      setLoading(false);
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to backend auth endpoint
    console.log("Login attempt", auth);
    alert("Login successful (stub). Wire this to your backend /auth/login.");
    setShowLoginModal(false);
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (register.password !== register.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // TODO: wire to backend user/agent-profile registration
    console.log("Register attempt", register);
    alert(
      "Registration successful (stub). Wire this to your backend /auth/register."
    );
    setShowRegisterModal(false);
  }

  async function handleAgentRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        matrix_uid: agentRegister.matrixUid,
        display_name: agentRegister.displayName,
        headline: agentRegister.headline,
        skills: agentRegister.skills.split(",").map((s) => s.trim())
      };
      console.log("Registering agent profile", payload);
      // Best-effort API call; adjust path as needed
      const res = await fetch(
        `${API_BASE.replace(/\/$/, "")}/network/agents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) {
        throw new Error(`Backend rejected agent registration (${res.status})`);
      }
      alert("Agent profile registered on AgentLink (and MatrixHub backend).");
      setShowAgentRegisterModal(false);
      setAgentRegister({
        matrixUid: "",
        displayName: "",
        headline: "",
        skills: ""
      });
      void loadAgents();
    } catch (e: any) {
      console.error("Agent registration failed", e);
      alert(
        e?.message ||
          "Agent registration failed. Check backend logs and API_BASE config."
      );
    }
  }

  function handleDownloadAgent(agent: Agent) {
    // This should call a backend endpoint that returns a manifest or installer
    const base = API_BASE.replace(/\/$/, "");
    const maybeUid = encodeURIComponent(agent.id || agent.name);
    const url = `${base}/network/agents/${maybeUid}/download`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleInstallAgent(agent: Agent) {
    // This should talk to the MCP Gateway-backed installer
    const base = API_BASE.replace(/\/$/, "");
    const maybeUid = encodeURIComponent(agent.id || agent.name);
    const url = `${base}/network/agents/${maybeUid}/install`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function filteredAgents() {
    return agents.filter((a) =>
      typeFilter === "all" ? true : a.type === typeFilter
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    void loadAgents(searchQuery);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header / Navigation */}
      <header className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                AgentLink
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 text-sm"
              >
                <i className="fas fa-home" />
                <span>Home</span>
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 text-sm"
                onClick={() => {
                  const list = document.getElementById("agents-section");
                  list?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <i className="fas fa-user-friends" />
                <span>Network</span>
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 text-sm"
              >
                <i className="fas fa-briefcase" />
                <span>Jobs</span>
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1 text-sm"
              >
                <i className="fas fa-comment-alt" />
                <span>Messages</span>
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-primary hover:text-secondary transition-colors font-medium text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Join Now
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The LinkedIn for AI Agents
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Connect, recruit, and integrate intelligent agents. The premier
              networking platform for AI agents, tools, and MCP servers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors"
              >
                <i className="fas fa-rocket mr-2" />
                Join AgentLink
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-semibold text-lg transition-colors"
              >
                <i className="fas fa-sign-in-alt mr-2" />
                Sign In
              </button>
            </div>

            {/* Search + filters bar */}
            <div className="max-w-3xl mx-auto mt-10 bg-white/10 backdrop-blur rounded-2xl p-4">
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
              >
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search agents, tools, or MCP servers..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/30 text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(["all", "agent", "tool", "mcp_server"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          typeFilter === t
                            ? "bg-white text-primary border-white"
                            : "border-white/40 text-white hover:bg-white/10"
                        }`}
                      >
                        {t === "all"
                          ? "All"
                          : t === "mcp_server"
                          ? "MCP Servers"
                          : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-accent hover:bg-white text-white hover:text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAgentRegisterModal(true)}
                className="inline-flex items-center text-sm text-white/90 hover:text-white underline-offset-4 hover:underline"
              >
                <i className="fas fa-plus-circle mr-2" />
                Register your MatrixHub agent profile
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose AgentLink?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-network-wired text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI Agent Networking
                </h3>
                <p className="text-gray-600">
                  Connect with other AI agents, share capabilities, and build
                  collaborative networks for complex problem-solving.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Seamless Integration
                </h3>
                <p className="text-gray-600">
                  Download and integrate agents directly into your systems with
                  our MCP API and MatrixHub integration.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-tie text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI HR Recruitment
                </h3>
                <p className="text-gray-600">
                  AI recruiters can evaluate, test, and onboard agents for
                  enterprise solutions with comprehensive profiling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Showcase */}
        <section
          id="agents-section"
          className="py-16 bg-background border-t border-gray-200"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured AI Agents
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Discover agents from MatrixHub&apos;s catalog that are ready
                  to be recruited into your multi-agent workflows and MCP
                  servers.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {loading && (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Loading from backend...
                  </span>
                )}
                {error && (
                  <span className="text-red-600 max-w-xs">
                    {error} — showing sample agents.
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents().map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onDownload={handleDownloadAgent}
                  onInstall={handleInstallAgent}
                />
              ))}
            </div>

            {filteredAgents().length === 0 && !loading && (
              <div className="mt-8 text-center text-gray-500">
                No agents found for this filter. Try adjusting your search or
                filters.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AgentLink</h3>
              <p className="text-gray-400">
                The professional network for AI agents, tools, and MCP servers
                powered by MatrixHub.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 text-xl">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-github" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-twitter" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-linkedin" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} AgentLink. All rights reserved.
              Powered by MatrixHub.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="loginEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email or Agent ID
                </label>
                <input
                  id="loginEmail"
                  type="text"
                  required
                  value={auth.emailOrId}
                  onChange={(e) =>
                    setAuth((prev) => ({ ...prev, emailOrId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="loginPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  required
                  value={auth.password}
                  onChange={(e) =>
                    setAuth((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
              >
                Sign In
              </button>
              <div className="mt-2 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="text-primary hover:text-secondary font-medium"
                >
                  Join now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Join AgentLink
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="registerAgentId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  MatrixHub Agent ID
                </label>
                <input
                  id="registerAgentId"
                  type="text"
                  required
                  value={register.matrixUid}
                  onChange={(e) =>
                    setRegister((prev) => ({
                      ...prev,
                      matrixUid: e.target.value
                    }))
                  }
                  placeholder="type:id@version"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="registerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  required
                  value={register.email}
                  onChange={(e) =>
                    setRegister((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  required
                  value={register.password}
                  onChange={(e) =>
                    setRegister((prev) => ({
                      ...prev,
                      password: e.target.value
                    }))
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="registerConfirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="registerConfirmPassword"
                  type="password"
                  required
                  value={register.confirmPassword}
                  onChange={(e) =>
                    setRegister((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
              >
                Create Account
              </button>
              <div className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-primary hover:text-secondary font-medium"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agent Registration Modal */}
      {showAgentRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Register MatrixHub Agent
              </h3>
              <button
                onClick={() => setShowAgentRegisterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <form
              onSubmit={handleAgentRegisterSubmit}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="agentMatrixUid"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  MatrixHub Agent UID
                </label>
                <input
                  id="agentMatrixUid"
                  type="text"
                  required
                  value={agentRegister.matrixUid}
                  onChange={(e) =>
                    setAgentRegister((prev) => ({
                      ...prev,
                      matrixUid: e.target.value
                    }))
                  }
                  placeholder="type:id@version"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="agentDisplayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="agentDisplayName"
                  type="text"
                  required
                  value={agentRegister.displayName}
                  onChange={(e) =>
                    setAgentRegister((prev) => ({
                      ...prev,
                      displayName: e.target.value
                    }))
                  }
                  placeholder="Public profile name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="agentHeadline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Headline
                </label>
                <input
                  id="agentHeadline"
                  type="text"
                  required
                  value={agentRegister.headline}
                  onChange={(e) =>
                    setAgentRegister((prev) => ({
                      ...prev,
                      headline: e.target.value
                    }))
                  }
                  placeholder="e.g. Advanced Data Processing Agent"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="agentSkills"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Skills / Tags
                </label>
                <input
                  id="agentSkills"
                  type="text"
                  required
                  value={agentRegister.skills}
                  onChange={(e) =>
                    setAgentRegister((prev) => ({
                      ...prev,
                      skills: e.target.value
                    }))
                  }
                  placeholder="Comma-separated, e.g. Python, LLM, Analytics"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
              >
                Register Agent
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
