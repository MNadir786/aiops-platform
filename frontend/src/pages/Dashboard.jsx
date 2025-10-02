import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive } from "lucide-react";
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
    const [mode, setMode] = useState("local");
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
                const m = data.metrics || data;
                setMetrics(m);
                setMode(data.mode || "local");

                // Keep history (last 20 samples)
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
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-wide flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                    <span>AIOps Cockpit</span>
                </h1>
                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${mode === "prometheus"
                            ? "bg-blue-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                >
                    {mode === "prometheus" ? "📡 Prometheus Mode" : "🖥 Local Mode"}
                </span>
            </div>

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
                className={`rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden ${health === "ok" ? "bg-green-900/40" : "bg-red-900/40"
                    }`}
            >
                {/* pulse ring */}
                <div className="absolute inset-0 animate-ping bg-green-500/5 rounded-2xl"></div>
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

            {/* Container Stats Grid */}
            {metrics.containers && metrics.containers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20"
                >
                    <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-yellow-400">
                        <Cpu /> <span>Container Metrics</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {metrics.containers.map((c, i) => (
                            <div
                                key={i}
                                className="bg-black/30 p-4 rounded-lg flex flex-col space-y-2 hover:bg-black/50 transition"
                            >
                                <span className="font-semibold">{c.name}</span>
                                <div className="flex items-center space-x-3">
                                    <Cpu className="w-5 h-5 text-indigo-400" />
                                    <span>CPU: {c.cpu_usage}%</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <HardDrive className="w-5 h-5 text-green-400" />
                                    <span>Memory: {c.memory_usage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

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
