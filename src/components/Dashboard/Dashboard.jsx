import React, { useState } from "react";
import CreateAlertForm from "./CreateAlertForm";
import AlertList from "./AlertList";
import StockChart from "./StockChart";
import NotificationsPanel from "./NotificationsPanel";
import { useAuth } from "../../hooks/useAuth";
import useAlertsWebSocket from "../../hooks/useWebSocket";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [manualSymbol, setManualSymbol] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ NEW

  // ✅ WebSocket callback when alert triggers
  useAlertsWebSocket(user?.id, (alertData) => {
    setNotifications((prev) => [
      {
        symbol: alertData.symbol,
        trigger_price: alertData.current_price,
        target_price: alertData.target_price,
        time: Date.now(),
      },
      ...prev,
    ]);

    // ✅ FORCE ALERT LIST REFRESH
    setRefreshKey(prev => prev + 1);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white">

      {/* ✅ HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-emerald-400">Stock</span>{" "}
          <span className="text-white">Alerts</span>
        </h1>

        <div className="flex items-center gap-4">
          <div className="text-gray-400 text-sm">
            Signed in as <b className="text-white ml-1">{user?.email}</b>
          </div>

          <button
            onClick={logout}
            className="py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ NOTIFICATIONS */}
      <NotificationsPanel
        notifications={notifications}
        clearAll={() => setNotifications([])}
      />

      {/* ✅ SYMBOL PICKER */}
      <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="text-gray-400 text-sm">
          Click any symbol from your alerts to view the chart
        </div>

        <div className="flex gap-2">
          <input
            value={manualSymbol}
            onChange={e => setManualSymbol(e.target.value.toUpperCase())}
            placeholder="Enter Symbol (Ex: TSLA)"
            className="bg-black border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500"
          />

          <button
            onClick={() => setSelectedSymbol(manualSymbol)}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition"
          >
            Load Chart
          </button>
        </div>
      </div>

      {/* ✅ CHART */}
      {selectedSymbol && <StockChart symbol={selectedSymbol} />}

      {/* ✅ MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-lg">
          <CreateAlertForm />
        </div>

        <div className="md:col-span-2 bg-neutral-900 p-5 rounded-xl border border-neutral-800 shadow-lg">
          <AlertList
            onSelectSymbol={setSelectedSymbol}
            refreshKey={refreshKey}   // ✅ PASSED HERE
          />
        </div>

      </div>
    </div>
  );
}
