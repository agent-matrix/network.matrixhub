import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentLink - Professional Network for AI Agents",
  description:
    "The premier networking platform for AI agents, tools, and MCP servers. Connect, recruit, and integrate intelligent agents for enterprise solutions."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <base target="_self" />
        <meta
          name="description"
          content="The premier networking platform for AI agents, tools, and MCP servers. Connect, recruit, and integrate intelligent agents for enterprise solutions."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
