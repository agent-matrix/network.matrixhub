/**
 * Network MatrixHub - Professional Landing Page
 *
 * Enterprise-grade homepage for the AI Agent Network, inspired by LinkedIn's
 * professional design language.
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license Apache-2.0
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Network,
  Shield,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Code2,
  Cpu,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({ agents: 0, tools: 0, connections: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Animate stats on mount
    setTimeout(() => {
      setStats({ agents: 1247, tools: 856, connections: 3421 });
    }, 500);
  }, []);

  return (
    <div className="flex flex-col gap-0 -mt-6 -mx-4 md:-mx-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 px-4 md:px-8 py-20 md:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 animate-float opacity-20">
          <Sparkles className="w-16 h-16 text-blue-400" />
        </div>
        <div className="absolute bottom-20 left-10 animate-float-delayed opacity-20">
          <Network className="w-20 h-20 text-purple-400" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>The Professional Network for AI Agents</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              LinkedIn for
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Agents
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover, evaluate, and integrate AI agents, tools, and MCP servers
              in the world's most advanced agent network.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link
                href="/directory"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
              >
                Explore Agents
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/directory?type=tool"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/50 px-8 py-4 text-lg font-semibold text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm"
              >
                Browse Tools
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <StatCard
                value={stats.agents}
                label="AI Agents"
                mounted={mounted}
              />
              <StatCard
                value={stats.tools}
                label="Tools & Servers"
                mounted={mounted}
              />
              <StatCard
                value={stats.connections}
                label="Active Connections"
                mounted={mounted}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-20 bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Enterprise-Grade Agent Network
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for the future of AI collaboration and integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Network className="w-6 h-6" />}
              title="Agent Discovery"
              description="Browse thousands of AI agents with detailed profiles, capabilities, and performance metrics."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Quality Assurance"
              description="Every agent is scored and verified with comprehensive quality metrics and peer reviews."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Integration"
              description="Seamlessly integrate agents via MCP, A2A, or custom protocols with one-click deployment."
              gradient="from-orange-500 to-yellow-500"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Agent Networking"
              description="Connect agents to form multi-agent systems with intelligent collaboration."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Protocol Support"
              description="Native support for MCP, A2A, and custom agent communication protocols."
              gradient="from-red-500 to-rose-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Analytics & Insights"
              description="Track agent performance, usage patterns, and optimization opportunities."
              gradient="from-indigo-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 md:px-8 py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Discover Agents"
              description="Browse our comprehensive directory of AI agents, tools, and MCP servers with advanced search and filtering."
              icon={<Globe className="w-8 h-8" />}
            />
            <StepCard
              number="2"
              title="Evaluate & Compare"
              description="Review detailed profiles, capabilities, performance metrics, and community feedback before choosing."
              icon={<CheckCircle className="w-8 h-8" />}
            />
            <StepCard
              number="3"
              title="Integrate & Deploy"
              description="Connect agents to your systems with native protocol support and automated deployment workflows."
              icon={<Cpu className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20 bg-gradient-to-br from-blue-950 via-purple-950 to-slate-950">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of
            AI-powered applications with our agent network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-12 bg-slate-950 border-t border-slate-800">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Network MatrixHub</h3>
              <p className="text-sm text-slate-400">
                The professional network for AI agents, tools, and MCP servers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/directory?type=agent" className="hover:text-white transition-colors">Agents</Link></li>
                <li><Link href="/directory?type=tool" className="hover:text-white transition-colors">Tools</Link></li>
                <li><Link href="/directory?type=mcp_server" className="hover:text-white transition-colors">MCP Servers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About</a></li>
                <li><a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="https://github.com/ruslanmv/network.matrixhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>&copy; 2025 Network MatrixHub. Built with ❤️ by <a href="https://ruslanmv.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Ruslan Magana</a></p>
            <p className="mt-2">Licensed under Apache 2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label, mounted }: { value: number; label: string; mounted: boolean }) {
  return (
    <div className="text-center space-y-2">
      <div className={`text-4xl md:text-5xl font-bold text-white transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {value.toLocaleString()}+
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative space-y-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
            {number}
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
