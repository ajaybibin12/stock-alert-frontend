import React, { useState } from "react";
import api from "../../api/axios";

export default function CreateAlertForm() {
  const [symbol, setSymbol] = useState("");
  const [target, setTarget] = useState("");
  const [dir, setDir] = useState("above");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create alert in DB
      await api.post("/alerts/create", {
        symbol,
        target_price: Number(target),
        direction: dir
      });

      // 2️⃣ Schedule QStash job to trigger /tasks/process
      await api.post("/tasks/schedule", { symbol });

      setMsg({ type: "success", text: "Alert created and scheduled!" });
      setSymbol("");
      setTarget("");

      // 3️⃣ Notify other components to refresh
      window.dispatchEvent(new Event("alerts:updated"));
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.detail || err.message
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Create Alert</h3>

      {msg && (
        <div
          className={`p-2 rounded mb-3 ${
            msg.type === "success"
              ? "bg-emerald-600/30 text-emerald-200"
              : "bg-red-600/30 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol (AAPL)"
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          required
        />

        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target price"
          type="number"
          step="0.01"
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          required
        />

        <select
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>

        <button className="w-full py-3 rounded bg-emerald-500 hover:bg-emerald-600">
          Create
        </button>
      </form>
    </div>
  );
}
