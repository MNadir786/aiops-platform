import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Helper to call backend (proxied through Nginx)
  const apiBase = "/api";

  useEffect(() => {
    // Fetch health
    fetch(`${apiBase}/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: "error" }));

    // Fetch logs
    fetch(`${apiBase}/logs`)
      .then(res => res.json())
      .then(data => setLogs(data.logs || []))
      .catch(() => setLogs([]));

    // Fetch metrics
    fetch(`${apiBase}/metrics`)
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(() => setMetrics(null));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🚀 AIOps Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Health Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">System Health</h2>
          {health ? (
            <p className="text-green-600">✅ {health.status} @ {health.timestamp}</p>
          ) : (
            <p className="text-red-600">❌ Unable to fetch health</p>
          )}
        </div>

        {/* Metrics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">System Metrics</h2>
          {metrics ? (
            <ul className="text-gray-700 space-y-1">
              <li>CPU: {metrics.cpu_usage}</li>
              <li>Memory: {metrics.memory_usage}</li>
              <li>Requests/min: {metrics.requests_per_minute}</li>
              <li>Errors/min: {metrics.errors_last_minute}</li>
            </ul>
          ) : (
            <p className="text-red-600">❌ Unable to fetch metrics</p>
          )}
        </div>

        {/* Logs Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Logs</h2>
          {logs.length > 0 ? (
            <ul className="text-sm text-gray-600 space-y-1">
              {logs.map((log, idx) => (
                <li key={idx}>
                  <span className="font-mono text-gray-500">{log.timestamp}</span> —
                  <span className="font-semibold">[{log.level}]</span> {log.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600">❌ No logs available</p>
          )}
        </div>
      </div>
    </div>
  );
}
