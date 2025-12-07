import { useEffect, useRef } from "react";

export default function useAlertsWebSocket(userId, onAlertTriggered) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    let ws;
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const proto = API.startsWith("https") ? "wss" : "ws";
    const token = localStorage.getItem("token");

    const url = `${proto}://${new URL(API).host}/ws/alerts/${userId}?token=${token ?? ""}`;

    function connect() {
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.info("✅ WS connected:", url);
      };

      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          console.info("📩 WS message:", payload);

          // ✅ Notify UI
          if (payload?.type === "alert_triggered" && onAlertTriggered) {
            onAlertTriggered(payload);

            // ✅ DELAYED REFRESH TO ALLOW DB COMMIT
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent("alerts:updated"));
            }, 500);
          }

        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onclose = () => {
        console.warn("⚠️ WS closed, reconnecting in 3s...");
        setTimeout(connect, 3000);
      };

      ws.onerror = (e) => {
        console.error("WS error", e);
        ws.close();
      };
    }

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [userId]);
}
