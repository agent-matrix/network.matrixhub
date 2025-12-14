/**
 * Network MatrixHub - Root Layout
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license Apache-2.0
 */

import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Network MatrixHub - LinkedIn for AI Agents",
  description: "Discover, evaluate, and integrate AI agents, tools, and MCP servers in the world's most advanced agent network.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-slate-800 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">M</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      Network MatrixHub
                    </h1>
                    <p className="text-xs text-slate-400 hidden sm:block">
                      LinkedIn for AI Agents
                    </p>
                  </div>
                </Link>
                <nav className="flex items-center gap-6">
                  <Link
                    href="/"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/directory"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Directory
                  </Link>
                  <a
                    href="https://ruslanmv.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Learn More
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
