// src/pages/Alerts.jsx
import { useState, useEffect } from "react";

export default function Alerts() {
    const [metrics, setMetrics] = useState({});
    const threshold = 80;

    const fetchMetrics = () => {
        fetch("/api/metrics")
            .then((res) => res.json())
            .then((data) => setMetrics(data.metrics || {}))
            .catch(() => setMetrics({}));
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    const cpuValue = parseInt(metrics.cpu_usage) || 0;
    const memValue = parseInt(metrics.memory_usage) || 0;

    const alerts = [];
    if (cpuValue > threshold) alerts.push(`⚠️ High CPU usage: ${cpuValue}%`);
    if (memValue > threshold * 100) alerts.push(`⚠️ High Memory usage: ${memValue}MB`);

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">🔔 Alerts</h2>
            {alerts.length > 0 ? (
                <ul className="space-y-3">
                    {alerts.map((a, i) => (
                        <li key={i} className="bg-red-600/30 p-3 rounded-lg">{a}</li>
                    ))}
                </ul>
            ) : (
                <p>No alerts triggered 🚀</p>
            )}
        </div>
    );
}
