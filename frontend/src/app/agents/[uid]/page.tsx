/**
 * Network MatrixHub - Agent Profile Page
 *
 * Enterprise-grade agent profile page with LinkedIn-style design.
 * Displays comprehensive agent information, capabilities, and integration options.
 *
 * @author Ruslan Magana (ruslanmv.com)
 * @license Apache-2.0
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Calendar,
  Code2,
  Zap,
  Shield,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Tag,
  GitBranch,
  Package,
  Award,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface EntityRead {
  id: string;
  type: string;
  name: string;
  version: string;
  summary?: string | null;
  description?: string | null;
  capabilities: string[];
  frameworks: string[];
  providers: string[];
  license?: string | null;
  homepage?: string | null;
  source_url?: string | null;
  quality_score: number;
  release_ts?: string | null;
  readme_blob_ref?: string | null;
  created_at: string;
  updated_at: string;
  protocols: string[];
  manifests?: Record<string, unknown> | null;
}

export default function AgentProfilePage() {
  const params = useParams();
  const uid = params?.uid as string;
  const [entity, setEntity] = useState<EntityRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "capabilities" | "protocols" | "manifests">("overview");

  useEffect(() => {
    if (!uid) return;

    const fetchEntity = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/entities/${encodeURIComponent(uid)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch entity: ${res.status}`);
        }
        const data: EntityRead = await res.json();
        setEntity(data);
      } catch (err) {
        console.error("Failed to load entity", err);
        setEntity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-slate-400">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-6xl">🤖</div>
          <h2 className="text-2xl font-bold text-white">Agent Not Found</h2>
          <p className="text-slate-400">
            The agent you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const typeColor =
    entity.type === "agent"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : entity.type === "tool"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-purple-500/10 text-purple-400 border-purple-500/20";

  const qualityColor =
    entity.quality_score >= 80
      ? "text-green-400"
      : entity.quality_score >= 60
      ? "text-yellow-400"
      : "text-orange-400";

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <Link
        href="/directory"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      {/* Header Card */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {entity.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {entity.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${typeColor}`}
                      >
                        <Package className="w-3 h-3" />
                        {entity.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                        <Tag className="w-3 h-3" />
                        v{entity.version}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 ${qualityColor}`}>
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-2xl font-bold">
                        {entity.quality_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {entity.summary && (
                  <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                    {entity.summary}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <QuickStat
                  icon={<Zap className="w-4 h-4" />}
                  label="Capabilities"
                  value={entity.capabilities.length}
                />
                <QuickStat
                  icon={<Code2 className="w-4 h-4" />}
                  label="Frameworks"
                  value={entity.frameworks.length || "—"}
                />
                <QuickStat
                  icon={<GitBranch className="w-4 h-4" />}
                  label="Protocols"
                  value={entity.protocols.length || "—"}
                />
                <QuickStat
                  icon={<Calendar className="w-4 h-4" />}
                  label="Last Updated"
                  value={formatDate(entity.updated_at)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {entity.homepage && (
                  <a
                    href={entity.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Homepage
                  </a>
                )}
                {entity.source_url && (
                  <a
                    href={entity.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    View Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </TabButton>
        <TabButton
          active={activeTab === "capabilities"}
          onClick={() => setActiveTab("capabilities")}
        >
          Capabilities
        </TabButton>
        <TabButton
          active={activeTab === "protocols"}
          onClick={() => setActiveTab("protocols")}
        >
          Protocols
        </TabButton>
        <TabButton
          active={activeTab === "manifests"}
          onClick={() => setActiveTab("manifests")}
        >
          Manifests
        </TabButton>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {entity.description && (
                <ContentCard title="Description" icon={<Shield className="w-5 h-5" />}>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {entity.description}
                  </p>
                </ContentCard>
              )}

              {entity.capabilities.length > 0 && (
                <ContentCard title="Key Capabilities" icon={<CheckCircle2 className="w-5 h-5" />}>
                  <div className="grid md:grid-cols-2 gap-3">
                    {entity.capabilities.map((cap) => (
                      <div
                        key={cap}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </ContentCard>
              )}
            </div>
          )}

          {activeTab === "capabilities" && (
            <ContentCard title="All Capabilities" icon={<Zap className="w-5 h-5" />}>
              {entity.capabilities.length === 0 ? (
                <p className="text-slate-400">No capabilities listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {entity.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 hover:border-blue-500/50 hover:bg-slate-800 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      {cap}
                    </span>
                  ))}
                </div>
              )}
            </ContentCard>
          )}

          {activeTab === "protocols" && (
            <ContentCard title="Supported Protocols" icon={<GitBranch className="w-5 h-5" />}>
              {entity.protocols.length === 0 ? (
                <p className="text-slate-400">No protocols specified.</p>
              ) : (
                <div className="space-y-3">
                  {entity.protocols.map((protocol) => (
                    <div
                      key={protocol}
                      className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{protocol}</div>
                        <div className="text-xs text-slate-400">Protocol Support</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ContentCard>
          )}

          {activeTab === "manifests" && (
            <ContentCard title="Protocol Manifests" icon={<Code2 className="w-5 h-5" />}>
              {!entity.manifests ? (
                <p className="text-slate-400">No protocol manifests available.</p>
              ) : (
                <pre className="overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300 border border-slate-800">
                  {JSON.stringify(entity.manifests, null, 2)}
                </pre>
              )}
            </ContentCard>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ContentCard title="Metadata" icon={<Shield className="w-5 h-5" />}>
            <div className="space-y-3 text-sm">
              {entity.license && (
                <MetadataItem
                  label="License"
                  value={entity.license}
                  icon={<Award className="w-4 h-4 text-blue-400" />}
                />
              )}
              <MetadataItem
                label="Created"
                value={formatDate(entity.created_at)}
                icon={<Clock className="w-4 h-4 text-green-400" />}
              />
              <MetadataItem
                label="Updated"
                value={formatDate(entity.updated_at)}
                icon={<Clock className="w-4 h-4 text-orange-400" />}
              />
              {entity.release_ts && (
                <MetadataItem
                  label="Released"
                  value={formatDate(entity.release_ts)}
                  icon={<Calendar className="w-4 h-4 text-purple-400" />}
                />
              )}
            </div>
          </ContentCard>

          {entity.frameworks.length > 0 && (
            <ContentCard title="Frameworks" icon={<Code2 className="w-5 h-5" />}>
              <div className="flex flex-wrap gap-2">
                {entity.frameworks.map((framework) => (
                  <span
                    key={framework}
                    className="rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs text-slate-300"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </ContentCard>
          )}

          {entity.providers.length > 0 && (
            <ContentCard title="AI Providers" icon={<Zap className="w-5 h-5" />}>
              <div className="flex flex-wrap gap-2">
                {entity.providers.map((provider) => (
                  <span
                    key={provider}
                    className="rounded-md border border-slate-700 bg-slate-800/50 px-2 py-1 text-xs text-slate-300"
                  >
                    {provider}
                  </span>
                ))}
              </div>
            </ContentCard>
          )}
        </aside>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-3">
      <div className="text-blue-400">{icon}</div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function ContentCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-blue-400">{icon}</div>}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetadataItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && <div className="mt-0.5 flex-shrink-0">{icon}</div>}
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-slate-200">{value}</div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
