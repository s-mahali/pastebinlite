"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | "">("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(
    null
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl || undefined,
          max_views: maxViews || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setResult(data);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Pastebin Lite</h1>
        <p className="text-slate-500">Create a paste and share it instantly</p>
      </header>

{/* result section */}
      {result && (
        <div className="p-4 bg-green-200 border-green-200 rouded-lg text-green-800">
          <p className="font-semibold">Paste Created!</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              readOnly
              value={result.url}
              className="flex-1 p-2 text-sm border rounded bg-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(result.url)}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* error section */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

{/* form section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Content (Required)</label>
          <textarea
            required
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paste your text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">TTL (Seconds)</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded-lg"
              placeholder="e.g. 3600"
              value={ttl}
              onChange={(e) => setTtl(e.target.value ? parseInt(e.target.value) : "")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Views</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded-lg"
              placeholder="e.g. 5"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value ? parseInt(e.target.value) : "")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>
    </main>
  );
}
