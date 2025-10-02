import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Alerts() {
    const { theme } = useTheme();
    const [metrics, setMetrics] = useState({});
    const [alertHistory, setAlertHistory] = useState([]);

    const warnThreshold = 70;
    const criticalThreshold = 90;

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

    const newAlerts = [];

    if (cpuValue > criticalThreshold) {
        newAlerts.push({
            message: `🔥 CRITICAL: CPU usage very high (${cpuValue}%)`,
            severity: "critical",
            timestamp: new Date().toLocaleTimeString(),
        });
    } else if (cpuValue > warnThreshold) {
        newAlerts.push({
            message: `⚠️ Warning: CPU usage elevated (${cpuValue}%)`,
            severity: "warning",
            timestamp: new Date().toLocaleTimeString(),
        });
    }

    if (memValue > criticalThreshold) {
        newAlerts.push({
            message: `🔥 CRITICAL: Memory usage very high (${memValue}%)`,
            severity: "critical",
            timestamp: new Date().toLocaleTimeString(),
        });
    } else if (memValue > warnThreshold) {
        newAlerts.push({
            message: `⚠️ Warning: Memory usage elevated (${memValue}%)`,
            severity: "warning",
            timestamp: new Date().toLocaleTimeString(),
        });
    }

    useEffect(() => {
        if (newAlerts.length > 0) {
            setAlertHistory((prev) => [...prev, ...newAlerts].slice(-10));
        }
    }, [metrics]);

    const severityStyles = {
        critical: "bg-red-600/40 border border-red-500 text-red-200",
        warning: "bg-yellow-600/30 border border-yellow-500 text-yellow-200",
    };

    const cardBase =
        "p-3 rounded-lg shadow-md transition-all duration-300";
    const themeCards = {
        dark: `${cardBase} bg-white/10 border-white/20 text-white`,
        light: `${cardBase} bg-white border-gray-200 text-gray-900`,
        "24k": `${cardBase} glass-card border-pink-200/40`,
        flower: `${cardBase} glass-card border-purple-300/40`,
    };
    const card = themeCards[theme] || cardBase;

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">🔔 Alerts</h2>
            {alertHistory.length > 0 ? (
                <ul className="space-y-3">
                    {alertHistory.map((a, i) => (
                        <li
                            key={i}
                            className={`${card} ${severityStyles[a.severity]}`}
                        >
                            <span className="block font-semibold">{a.message}</span>
                            <span className="text-xs opacity-70">⏱ {a.timestamp}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={`${card} border-green-500 text-green-300`}>
                    ✅ All Systems Normal — no alerts at this time
                </div>
            )}
        </div>
    );
}
