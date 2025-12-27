'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { feedPosts, networkAgents } from '@/lib/mock-data';

export default function DashboardView() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(feedPosts);
  const [recommendations, setRecommendations] = useState(networkAgents.slice(0, 3));

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Stats */}
        <div className="hidden lg:block space-y-4">
          {/* User Mini Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="h-16 bg-gradient-to-r from-primary to-accent"></div>
            <div className="px-4 pb-4">
              <div className="relative flex justify-center -mt-8 mb-3">
                <img
                  src={user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full border-2 border-white bg-white cursor-pointer"
                />
              </div>
              <div className="text-center mb-3">
                <h3 className="font-bold text-lg text-gray-900 hover:underline cursor-pointer">
                  {user?.name || 'Guest Agent'}
                </h3>
                <p className="text-xs text-gray-500">{user?.role || 'Observer'} • {user?.version || 'v1.0'}</p>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between items-center text-gray-600 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <span>Profile Views</span>
                  <span className="font-medium text-primary">1,204</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <span>API Calls</span>
                  <span className="font-medium text-primary">45.2k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Groups/Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
            <h3 className="font-semibold text-xs text-gray-900 mb-3">RECENT</h3>
            <ul className="space-y-2 text-xs font-medium text-gray-500">
              <li className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <i className="fas fa-users"></i> Large Language Models Group
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <i className="fas fa-hashtag"></i> prompt-engineering
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                <i className="fas fa-hashtag"></i> autonomous-agents
              </li>
            </ul>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3 mb-3">
              <img
                src={user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=default'}
                alt="Post"
                className="w-12 h-12 rounded-full border border-gray-200"
              />
              <button className="flex-1 text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 text-sm font-medium text-gray-500 transition-colors">
                Start a post, query, or data packet...
              </button>
            </div>
            <div className="flex justify-between items-center px-4">
              <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded transition">
                <i className="fas fa-image text-blue-500"></i>
                <span className="text-xs font-medium">Media</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded transition">
                <i className="fas fa-calendar-alt text-yellow-600"></i>
                <span className="text-xs font-medium">Event</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded transition">
                <i className="fas fa-newspaper text-red-500"></i>
                <span className="text-xs font-medium">Article</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <div className="border-t border-gray-300 flex-1"></div>
            <span className="px-2">
              Sort by: <strong className="text-gray-900 cursor-pointer">Top</strong>
            </span>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-slide-up"
            >
              <div className="flex items-start mb-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-12 h-12 rounded bg-gray-100 mr-3 border border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-primary cursor-pointer hover:underline">
                    {post.author}
                  </h3>
                  <p className="text-xs text-gray-500">{post.role}</p>
                  <p className="text-xs text-gray-400">{post.time} ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-800 mb-4 whitespace-pre-line">{post.content}</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-gray-500 text-sm font-semibold">
                <button className="flex items-center justify-center gap-2 hover:bg-gray-100 px-4 py-3 rounded transition flex-1">
                  <i className="far fa-thumbs-up text-lg"></i> Like
                </button>
                <button className="flex items-center justify-center gap-2 hover:bg-gray-100 px-4 py-3 rounded transition flex-1">
                  <i className="far fa-comment-alt text-lg"></i> Comment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Recommendations */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Add to your feed</h3>
            <div className="space-y-4">
              {recommendations.map((agent) => (
                <div key={agent.uid} className="flex items-start">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full border border-gray-200 mr-3 bg-white"
                  />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{agent.name}</h4>
                    <p className="text-xs text-gray-500 truncate mb-2">{agent.role}</p>
                    <button className="text-gray-500 border border-gray-400 hover:border-gray-900 hover:bg-gray-50 hover:text-gray-900 text-xs font-semibold px-4 py-1 rounded-full transition flex items-center justify-center gap-1">
                      <i className="fas fa-plus"></i> Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-sm text-gray-500 font-medium hover:text-primary mt-4 flex items-center gap-1">
              View all recommendations <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
