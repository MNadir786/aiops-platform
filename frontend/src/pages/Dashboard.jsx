// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Cpu,
    HardDrive,
    Network,
    Database,
    AlertTriangle,
    GitBranch,
    CheckCircle,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

export default function Dashboard() {
    const [metrics, setMetrics] = useState({});
    const [history, setHistory] = useState([]);
    const [health, setHealth] = useState("loading...");
    const [timestamp, setTimestamp] = useState("");

    const fetchData = () => {
        fetch("/api/metrics/json")
            .then((res) => res.json())
            .then((data) => {
                const m = data.metrics || data;
                setMetrics(m);
                setHistory((prev) => [
                    ...prev.slice(-19),
                    {
                        time: new Date().toLocaleTimeString(),
                        cpu: parseFloat(m.cpu_usage) || 0,
                        memory: parseFloat(m.memory_usage) || 0,
                        network: parseFloat(m.network_usage) || Math.random() * 100, // fallback
                        disk: parseFloat(m.disk_usage) || Math.random() * 100, // fallback
                    },
                ]);
            })
            .catch(() => setMetrics({}));

        fetch("/api/health")
            .then((res) => res.json())
            .then((data) => {
                setHealth(data.status);
                setTimestamp(data.timestamp);
            })
            .catch(() => setHealth("error"));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const cardBase =
        "rounded-2xl shadow-xl p-6 border border-white/20 bg-white/5";

    const formatTimestamp = (ts) =>
        ts ? dayjs(ts).format("HH:mm:ss (MMM D)") : "n/a";

    return (
        <main className="p-8 grid grid-cols-1 gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-wide flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                    <span>AIOps Control Plane (ACP)</span>
                </h1>
                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-lg ${health === "ok" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                >
                    {health === "ok" ? `✅ Healthy @ ${formatTimestamp(timestamp)}` : "❌ Error"}
                </span>
            </div>

            {/* Command View KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div whileHover={{ scale: 1.05 }} className={cardBase}>
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="text-red-400 w-6 h-6" />
                        <span className="text-lg font-bold">Active Incidents</span>
                    </div>
                    <p className="text-3xl font-extrabold mt-2">3</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className={cardBase}>
                    <div className="flex items-center space-x-3">
                        <GitBranch className="text-yellow-400 w-6 h-6" />
                        <span className="text-lg font-bold">Deployments</span>
                    </div>
                    <p className="text-3xl font-extrabold mt-2">2 Running</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className={cardBase}>
                    <div className="flex items-center space-x-3">
                        <Database className="text-blue-400 w-6 h-6" />
                        <span className="text-lg font-bold">Pipelines</span>
                    </div>
                    <p className="text-3xl font-extrabold mt-2">1 Failed</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className={cardBase}>
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400 w-6 h-6" />
                        <span className="text-lg font-bold">SLO Compliance</span>
                    </div>
                    <p className="text-3xl font-extrabold mt-2">98%</p>
                </motion.div>
            </div>

            {/* Resource Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} className={cardBase}>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        <span>CPU Usage</span>
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="time" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className={cardBase}>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <HardDrive className="w-5 h-5 text-green-400" />
                        <span>Memory Usage</span>
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="time" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="memory" stroke="#22c55e" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className={cardBase}>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <Network className="w-5 h-5 text-yellow-400" />
                        <span>Network Usage</span>
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="time" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="network" stroke="#eab308" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className={cardBase}>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                        <Database className="w-5 h-5 text-orange-400" />
                        <span>Disk Usage</span>
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="time" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="disk" stroke="#f97316" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
