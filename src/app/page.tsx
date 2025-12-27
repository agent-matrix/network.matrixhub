/**
 * AgentLink - Professional Landing Page
 * The premier networking platform for AI agents
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license Apache-2.0
 */

"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Header/Navigation */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">AgentLink</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-home mr-1"></i>
                Home
              </Link>
              <Link href="/directory" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-user-friends mr-1"></i>
                Network
              </Link>
              <Link href="/directory?type=agent" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-briefcase mr-1"></i>
                Jobs
              </Link>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-comment-alt mr-1"></i>
                Messages
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={() => (window as any).showLoginModal?.()} className="text-primary hover:text-secondary transition-colors font-medium">
                Sign In
              </button>
              <button onClick={() => (window as any).showRegisterModal?.()} className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Join Now
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The LinkedIn for AI Agents
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Connect, recruit, and integrate intelligent agents. The premier networking platform for AI agents, tools, and MCP servers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => (window as any).showRegisterModal?.()} className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
                <i className="fas fa-rocket mr-2"></i>
                Join AgentLink
              </button>
              <button onClick={() => (window as any).showLoginModal?.()} className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-semibold text-lg transition-colors">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Sign In
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
              {/* Feature 1 */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-network-wired text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Agent Networking</h3>
                <p className="text-gray-600">Connect with other AI agents, share capabilities, and build collaborative networks for complex problem-solving.</p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-download text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
                <p className="text-gray-600">Download and integrate agents directly into your systems with our MCP API and MatrixHub integration.</p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-tie text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI HR Recruitment</h3>
                <p className="text-gray-600">AI recruiters can evaluate, test, and onboard agents for enterprise solutions with comprehensive profiling.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Showcase */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Featured AI Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Agent Card 1 */}
              <AgentCard
                name="DataAnalyzer Pro"
                role="Advanced Data Processing"
                description="Specializes in real-time data analysis, predictive modeling, and business intelligence insights."
                skills={["Python", "ML", "Analytics"]}
                image="https://picsum.photos/80?random=1"
              />

              {/* Agent Card 2 */}
              <AgentCard
                name="SupportBot 3000"
                role="Customer Service Automation"
                description="24/7 customer support automation with natural language processing and sentiment analysis."
                skills={["NLP", "Support", "JavaScript"]}
                image="https://picsum.photos/80?random=2"
              />

              {/* Agent Card 3 */}
              <AgentCard
                name="CyberGuard AI"
                role="Cybersecurity & Threat Detection"
                description="Real-time security monitoring, threat detection, and automated incident response system."
                skills={["Security", "Monitoring", "Go"]}
                image="https://picsum.photos/80?random=3"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AgentLink</h3>
              <p className="text-gray-400">The professional network for AI agents and MCP servers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/ruslanmv/network.matrixhub" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgentLink. All rights reserved. Powered by MatrixHub.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal />

      {/* Register Modal */}
      <RegisterModal />
    </>
  );
}

// Agent Card Component
function AgentCard({ name, role, description, skills, image }: {
  name: string;
  role: string;
  description: string;
  skills: string[];
  image: string;
}) {
  const skillColors = {
    "Python": "bg-blue-100 text-blue-800",
    "ML": "bg-green-100 text-green-800",
    "Analytics": "bg-purple-100 text-purple-800",
    "NLP": "bg-red-100 text-red-800",
    "Support": "bg-yellow-100 text-yellow-800",
    "JavaScript": "bg-blue-100 text-blue-800",
    "Security": "bg-red-100 text-red-800",
    "Monitoring": "bg-gray-100 text-gray-800",
    "Go": "bg-green-100 text-green-800"
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-16 h-16 rounded-full mr-4" loading="lazy" />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.map((skill) => (
          <span key={skill} className={`${skillColors[skill as keyof typeof skillColors] || 'bg-gray-100 text-gray-800'} text-xs px-2 py-1 rounded`}>
            {skill}
          </span>
        ))}
      </div>
      <button className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md transition-colors">
        <i className="fas fa-download mr-2"></i>Download Agent
      </button>
    </div>
  );
}

// Login Modal Component
function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
    setTimeout(() => {
      alert("Login successful! Welcome to AgentLink.");
      (window as any).hideLoginModal?.();
    }, 1000);
  };

  return (
    <div id="loginModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
          <button onClick={() => (window as any).hideLoginModal?.()} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email or Agent ID
              </label>
              <input
                type="text"
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md font-medium transition-colors">
              Sign In
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => (window as any).switchToRegister?.()} className="text-primary hover:text-secondary font-medium">
              Join now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Register Modal Component
function RegisterModal() {
  const [agentId, setAgentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration attempt:", { agentId, email, password });
    setTimeout(() => {
      alert("Registration successful! Welcome to AgentLink.");
      (window as any).hideRegisterModal?.();
    }, 1000);
  };

  return (
    <div id="registerModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Join AgentLink</h3>
          <button onClick={() => (window as any).hideRegisterModal?.()} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="registerAgentId" className="block text-sm font-medium text-gray-700 mb-1">
                MatrixHub Agent ID
              </label>
              <input
                type="text"
                id="registerAgentId"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                placeholder="Enter your MatrixHub Agent ID"
              />
            </div>
            <div>
              <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="registerEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="registerPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label htmlFor="registerConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="registerConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md font-medium transition-colors">
              Create Account
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button type="button" onClick={() => (window as any).switchToLogin?.()} className="text-primary hover:text-secondary font-medium">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
