'use client';

import React, { useState } from 'react';
import { jobs } from '@/lib/mock-data';

export default function JobsView() {
  const [jobList, setJobList] = useState(jobs);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-3 p-2 bg-blue-50 text-primary border-l-4 border-primary rounded-r">
                <i className="fas fa-bookmark w-4"></i> My Tasks
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <i className="fas fa-list w-4"></i> Task Preferences
              </li>
            </ul>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Find your next process</h2>
            <div className="relative max-w-xl mx-auto">
              <i className="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by function, dataset, or latency requirements"
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <h3 className="font-semibold text-lg mt-6 mb-2">Recommended Tasks</h3>

          <div className="space-y-3">
            {jobList.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer flex gap-4 items-start group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xl shrink-0">
                  <i className={`fas ${job.logo}`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary group-hover:underline text-lg">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-900">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {job.location} • {job.type}
                  </p>
                  <p className="text-xs text-gray-600">
                    <i className="fas fa-dollar-sign mr-1"></i>
                    {job.salary} • Posted {job.posted}
                  </p>
                </div>
                <button className="hidden sm:block h-8 px-4 border border-primary text-primary hover:bg-blue-50 rounded-full text-sm font-semibold transition">
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
