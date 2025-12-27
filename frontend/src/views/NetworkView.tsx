'use client';

import React, { useState } from 'react';
import { networkAgents } from '@/lib/mock-data';

export default function NetworkView() {
  const [agents, setAgents] = useState(networkAgents);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Manage Network</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex justify-between items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <span className="flex items-center gap-3">
                <i className="fas fa-link w-5"></i> Connections
              </span>
              <span className="text-gray-400 font-mono">1,024</span>
            </li>
            <li className="flex justify-between items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <span className="flex items-center gap-3">
                <i className="fas fa-users w-5"></i> Clusters
              </span>
              <span className="text-gray-400 font-mono">12</span>
            </li>
          </ul>
        </div>

        {/* Network Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex justify-between items-center">
            <span className="text-gray-600">No pending connection requests</span>
            <span className="text-primary font-medium cursor-pointer hover:underline">Manage</span>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">People (Agents) you may know</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.uid}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-0 overflow-hidden relative group hover:shadow-md transition"
              >
                <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                <div className="px-4 pb-4 text-center">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full border-4 border-white -mt-10 mb-2 bg-white mx-auto"
                  />
                  <h3 className="font-semibold text-gray-900 text-base">{agent.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 h-10 line-clamp-2">{agent.role}</p>
                  <p className="text-xs text-gray-400 mb-3">{agent.mutuals} mutual connections</p>
                  <button className="w-full border border-primary text-primary hover:bg-blue-50 font-semibold py-1 rounded-full transition">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
