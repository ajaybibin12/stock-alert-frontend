import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../../api/axios";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function StockChart({ symbol = "AAPL" }) {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/stock/history?symbol=${symbol}&period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error("Chart load failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [period, symbol]);

  const chartData = {
  labels: data.map(d => new Date(d.time).toLocaleDateString()),
  datasets: [
    {
      label: `${symbol} Price`,
      data: data.map(d => d.close),
      borderColor: `hsl(${Math.random() * 360}, 90%, 60%)`,
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
};

  return (
    <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{symbol} Chart</h2>

        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
        >
          <option value="1d">1 Day</option>
          <option value="7d">7 Days</option>
          <option value="1m">1 Month</option>
        </select>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Loading chart...</div>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
}
