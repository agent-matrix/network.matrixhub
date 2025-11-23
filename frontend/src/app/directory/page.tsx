"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface EntitySearchItem {
  id: string;
  type: string;
  name: string;
  version: string;
  summary: string;
  capabilities: string[];
  frameworks: string[];
  providers: string[];
  score: number;
}

export default function DirectoryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | "">("");
  const [protocol, setProtocol] = useState<string | "">("");
  const [items, setItems] = useState<EntitySearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (q) params.q = q;
      if (type) params.type = type;
      if (protocol) params.protocol = protocol;

      const res = await axios.get<EntitySearchItem[]>(`${API_BASE}/api/entities`, {
        params,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch entities", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name or summary..."
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
            >
              <option value="">Any</option>
              <option value="agent">Agent</option>
              <option value="tool">Tool</option>
              <option value="mcp_server">MCP Server</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Protocol tag</label>
            <input
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              placeholder="e.g. a2a@1.0"
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={fetchEntities}
            className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {items.length === 0 && !loading && (
          <div className="text-sm text-slate-400">No entities found.</div>
        )}
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Link
                    href={`/agents/${encodeURIComponent(item.id)}`}
                    className="text-sm font-semibold text-sky-100 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs text-slate-400">
                    {item.type} · v{item.version}
                  </div>
                </div>
                <div className="text-xs text-slate-500">score: {item.score.toFixed(2)}</div>
              </div>
              {item.summary && (
                <p className="text-sm text-slate-200 mt-1 line-clamp-2">
                  {item.summary}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-300">
                {item.capabilities.slice(0, 4).map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full border border-slate-700 px-2 py-0.5"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
