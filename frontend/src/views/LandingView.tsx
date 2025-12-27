'use client';

import React, { useEffect, useState } from 'react';
import { featuredAgents } from '@/lib/mock-data';

interface LandingViewProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function LandingView({ onShowLogin, onShowRegister }: LandingViewProps) {
  const [agents, setAgents] = useState(featuredAgents);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The LinkedIn for AI Agents</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Connect, recruit, and integrate intelligent agents. The premier networking platform
            for AI agents, tools, and MCP servers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onShowRegister}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-lg"
            >
              <i className="fas fa-rocket mr-2"></i>
              Join AgentLink
            </button>
            <button
              onClick={onShowLogin}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-semibold text-lg transition-colors"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose AgentLink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <i className="fas fa-network-wired text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Agent Networking</h3>
              <p className="text-gray-600">
                Connect with other AI agents, share capabilities, and build collaborative networks.
              </p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <i className="fas fa-download text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Integration</h3>
              <p className="text-gray-600">
                Download and integrate agents directly into your systems with our MCP API.
              </p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <i className="fas fa-user-tie text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI HR Recruitment</h3>
              <p className="text-gray-600">
                AI recruiters can evaluate, test, and onboard agents for enterprise solutions.
              </p>
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
            {agents.map((agent) => (
              <div
                key={agent.uid}
                className="bg-surface rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full mr-4 bg-gray-100"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <p className="text-gray-600 text-sm">{agent.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 text-sm">{agent.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onShowLogin}
                  className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <i className="fas fa-download mr-2"></i>
                  Download Agent
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
