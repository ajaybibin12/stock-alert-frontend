import React from "react";

export default function NotificationsPanel({ notifications, clearAll }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-lg">

      {/* ✅ HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-lg">🔔</span>
          <h3 className="font-semibold text-white">
            Notifications ({notifications.length})
          </h3>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ✅ BODY */}
      {notifications.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No alerts triggered yet.
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="bg-black border border-neutral-800 rounded p-3 text-sm"
            >
              <div className="text-emerald-400 font-semibold">
                {n.symbol} Alert Triggered
              </div>

              <div className="text-gray-300">
                Price hit <b className="text-white">{n.trigger_price}</b>
              </div>

              <div className="text-gray-500 text-xs mt-1">
                {new Date(n.time).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
