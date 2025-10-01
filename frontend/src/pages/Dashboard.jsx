// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Gauge from "../components/Gauge";

export default function Dashboard() {
    const [health, setHealth] = useState("loading...");
    const [timestamp, setTimestamp] = useState("");
    const [metrics, setMetrics] = useState({});
    const [history, setHistory] = useState([]);
    const [showMetricsModal, setShowMetricsModal] = useState(false);
    const [showGrafana, setShowGrafana] = useState(false);

    const fetchData = () => {
        // --- health ---
        fetch("/api/health")
            .then((res) => res.json())
            .then((data) => {
                setHealth(data.status);
                setTimestamp(data.timestamp);
            })
            .catch((err) => {
                console.error("Failed to fetch /api/health:", err);
                setHealth("error");
            });

        // --- metrics ---
        fetch("/api/metrics")
            .then((res) => res.json())
            .then((data) => {
                console.log("API /api/metrics response:", data);

                // handle both shapes: { metrics: {...} } OR flat { cpu_usage, memory_usage }
                const m = data.metrics || data;

                setMetrics(m);

                // Keep history of last 20 samples
                setHistory((prev) => [
                    ...prev.slice(-19),
                    {
                        time: new Date().toLocaleTimeString(),
                        cpu: parseFloat(m.cpu_usage) || 0,
                        memory: parseFloat(m.memory_usage) || 0,
                    },
                ]);
            })
            .catch((err) => {
                console.error("Failed to fetch /api/metrics:", err);
                setMetrics({});
            });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // CPU & Memory values
    const cpuValue = Math.min(parseFloat(metrics.cpu_usage) || 0, 100);
    const memValue = Math.min(parseFloat(metrics.memory_usage) || 0, 100);

    return (
        <main className="p-8 grid grid-cols-1 gap-8">
            {/* Gauges Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
                <Gauge value={cpuValue} label="CPU Usage" />
                <Gauge value={memValue} label="Memory Usage" />
            </div>

            {/* Toggle Grafana */}
            <div className="flex justify-center">
                <button
                    onClick={() => setShowGrafana(!showGrafana)}
                    className="px-6 py-2 bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    {showGrafana ? "Hide Grafana Panel" : "View in Grafana"}
                </button>
            </div>

            {/* Grafana Embed */}
            {showGrafana && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/10"
                >
                    <iframe
                        src="http://localhost:3000/d/your_dashboard_id/your_panel?orgId=1&refresh=5s"
                        width="100%"
                        height="500"
                        frameBorder="0"
                        title="Grafana Panel"
                    ></iframe>
                </motion.div>
            )}

            {/* System Health */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20"
            >
                <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-green-400">
                    <Activity />
                    <span>System Health</span>
                </h2>
                {health === "ok" ? (
                    <p className="text-green-400 font-semibold text-lg">
                        ✅ Healthy @ {timestamp}
                    </p>
                ) : (
                    <p className="text-red-400 font-semibold text-lg">❌ {health}</p>
                )}
            </motion.div>

            {/* Metrics History Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/20"
                onClick={() => setShowMetricsModal(true)}
            >
                <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-indigo-400">
                    📊 <span>Metrics History (click to expand)</span>
                </h2>
                <div className="h-48 opacity-70">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="time" stroke="#aaa" />
                            <YAxis stroke="#aaa" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#111",
                                    border: "1px solid #333",
                                    color: "#fff",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="cpu"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="memory"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Metrics Modal */}
            {showMetricsModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-3/4 h-3/4 relative">
                        <button
                            onClick={() => setShowMetricsModal(false)}
                            className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-lg text-white"
                        >
                            ✖ Close
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">
                            📊 Metrics History
                        </h2>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="time" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#111",
                                        border: "1px solid #333",
                                        color: "#fff",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="cpu"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="memory"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </main>
    );
}
