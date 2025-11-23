"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

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

  useEffect(() => {
    if (!uid) return;

    const fetchEntity = async () => {
      setLoading(true);
      try {
        const res = await axios.get<EntityRead>(`${API_BASE}/api/entities/${encodeURIComponent(uid)}`);
        setEntity(res.data);
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
    return <div className="text-sm text-slate-300">Loading profile...</div>;
  }

  if (!entity) {
    return <div className="text-sm text-red-300">Profile not found.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">{entity.name}</h2>
            <div className="text-xs text-slate-400">
              {entity.type} · v{entity.version}
            </div>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <div>quality: {entity.quality_score.toFixed(2)}</div>
            <div className="text-[10px]">
              created {new Date(entity.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        {entity.summary && (
          <p className="mt-2 text-sm text-slate-200">{entity.summary}</p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          {entity.description && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-sm font-semibold mb-2">Overview</h3>
              <p className="text-sm whitespace-pre-line text-slate-200">
                {entity.description}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-200">
              {entity.capabilities.length === 0 && (
                <span className="text-slate-400">No capabilities listed.</span>
              )}
              {entity.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="rounded-full border border-slate-700 px-2 py-0.5"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200">
            <h3 className="text-sm font-semibold mb-2">Metadata</h3>
            {entity.homepage && (
              <div className="mb-1">
                <span className="text-slate-400">Homepage: </span>
                <a
                  href={entity.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:underline"
                >
                  {entity.homepage}
                </a>
              </div>
            )}
            {entity.source_url && (
              <div className="mb-1">
                <span className="text-slate-400">Manifest: </span>
                <a
                  href={entity.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:underline"
                >
                  source_url
                </a>
              </div>
            )}
            {entity.license && (
              <div className="mb-1">
                <span className="text-slate-400">License: </span>
                <span>{entity.license}</span>
              </div>
            )}
            <div className="mb-1">
              <span className="text-slate-400">Frameworks: </span>
              {entity.frameworks.length ? entity.frameworks.join(", ") : "—"}
            </div>
            <div className="mb-1">
              <span className="text-slate-400">Providers: </span>
              {entity.providers.length ? entity.providers.join(", ") : "—"}
            </div>
            <div className="mt-2">
              <span className="text-slate-400">Protocols: </span>
              {entity.protocols.length ? entity.protocols.join(", ") : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200">
            <h3 className="text-sm font-semibold mb-2">Manifests (raw)</h3>
            {!entity.manifests && (
              <div className="text-slate-400">No protocol-native manifests stored.</div>
            )}
            {entity.manifests && (
              <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all text-[10px] bg-slate-950/60 p-2 rounded-md border border-slate-800">
                {JSON.stringify(entity.manifests, null, 2)}
              </pre>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
