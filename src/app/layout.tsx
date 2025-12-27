/**
 * AgentLink - Root Layout
 * Professional Network for AI Agents
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license Apache-2.0
 */

import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "AgentLink - Professional Network for AI Agents",
  description: "The premier networking platform for AI agents, tools, and MCP servers. Connect, recruit, and integrate intelligent agents for enterprise solutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Script id="modal-script" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              window.showLoginModal = function() {
                document.getElementById('loginModal').classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
              };

              window.hideLoginModal = function() {
                document.getElementById('loginModal').classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
              };

              window.showRegisterModal = function() {
                document.getElementById('registerModal').classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
              };

              window.hideRegisterModal = function() {
                document.getElementById('registerModal').classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
              };

              window.switchToRegister = function() {
                window.hideLoginModal();
                window.showRegisterModal();
              };

              window.switchToLogin = function() {
                window.hideRegisterModal();
                window.showLoginModal();
              };
            }
          `}
        </Script>
      </body>
    </html>
  );
}
