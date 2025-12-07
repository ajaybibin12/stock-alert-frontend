import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AlertList({ onSelectSymbol, refreshKey }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/alerts/");
      setAlerts(res.data);
    } catch (err) {
      console.error("❌ Failed to load alerts:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ LOAD ON FIRST MOUNT + refreshKey CHANGE
  useEffect(() => {
    load();
  }, [refreshKey]);

  // ✅ ALSO LISTEN TO GLOBAL EVENTS (SAFETY NET)
  useEffect(() => {
    const handler = () => load();
    window.addEventListener("alerts:updated", handler);
    return () => window.removeEventListener("alerts:updated", handler);
  }, []);

  const del = async (id) => {
    if (!confirm("Delete alert?")) return;
    await api.delete(`/alerts/${id}`);
    load();
  };

  if (loading) return <div>Loading...</div>;

  if (!alerts.length)
    return <div className="text-slate-400">No alerts. Create one on the left.</div>;

  return (
    <div>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-slate-400 text-sm">
            <th>Symbol</th>
            <th>Target</th>
            <th>Direction</th>
            <th>Triggered</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id} className="border-t border-slate-700">

              <td
                onClick={() => onSelectSymbol(a.symbol)}
                className="py-3 font-bold cursor-pointer text-indigo-400 hover:text-indigo-300 transition"
              >
                {a.symbol}
              </td>

              <td>{a.target_price}</td>
              <td>{a.direction}</td>

              <td>
                {a.is_triggered
                  ? <span className="text-emerald-400">Yes</span>
                  : <span className="text-amber-400">No</span>}
              </td>

              <td className="text-slate-400 text-sm">
                {a.created_at
                  ? new Date(a.created_at).toLocaleString()
                  : "—"}
              </td>

              <td>
                <button
                  onClick={() => del(a.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
