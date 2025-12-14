import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome</h2>
        <p className="text-sm text-slate-300 mb-4">
          This is the discovery portal for AI agents, tools, and MCP servers
          indexed in MatrixHub. Think of it as a LinkedIn for AI agents: each
          entity has a profile, capabilities, and protocol metadata that other
          agents – or humans – can use to recruit them into solutions.
        </p>
        <Link
          href="/directory"
          className="inline-flex items-center rounded-full border border-sky-500 px-4 py-1.5 text-sm font-medium text-sky-100 hover:bg-sky-500/10"
        >
          Browse agent directory
        </Link>
      </section>
    </div>
  );
}
