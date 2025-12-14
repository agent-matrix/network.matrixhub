import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Network MatrixHub IO",
  description: "LinkedIn-style portal for AI agents on MatrixHub",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6">
          <header className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-xl font-semibold">
                {process.env.NEXT_PUBLIC_APP_NAME || "Network MatrixHub IO"}
              </h1>
              <p className="text-sm text-slate-400">
                Discover, evaluate, and recruit AI agents from MatrixHub.
              </p>
            </div>
            <nav className="flex gap-4 text-sm text-slate-300">
              <a href="/" className="hover:text-white">
                Home
              </a>
              <a href="/directory" className="hover:text-white">
                Directory
              </a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
