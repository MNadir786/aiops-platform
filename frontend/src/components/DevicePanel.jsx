// frontend/src/components/DevicePanel.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
    Cpu, HardDrive, Database, Globe, Activity, Package,
    Zap, Thermometer, Server, Trash2, RefreshCw
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function DevicePanel({ category, device, onDelete }) {
    const [metrics, setMetrics] = useState({});
    const [logs, setLogs] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const logEndRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const metricsRes = await fetch(`/api/assets/${category}/${device.id}/metrics`);
            const metricsData = await metricsRes.json();
            const logsRes = await fetch(`/api/assets/${category}/${device.id}/logs`);
            const logsData = await logsRes.json();
            setMetrics(metricsData.metrics || {});
            setLogs(logsData.logs || []);
            setLastUpdate(new Date().toISOString());
        } catch (err) {
            console.error("Error fetching device data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [category, device.id]);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    const formatTimestamp = (ts) =>
        ts ? `${dayjs(ts).fromNow()} (${dayjs(ts).format("HH:mm:ss MMM D")})` : "n/a";

    const getRelevantMetrics = () => {
        const lower = category.toLowerCase();
        if (lower.includes("compute") || lower.includes("server"))
            return { CPU: metrics.cpu_usage, Memory: metrics.memory_usage, Uptime: metrics.uptime };
        if (lower.includes("database"))
            return { Latency: metrics.query_latency, Connections: metrics.connections, "Disk I/O": metrics.disk_io };
        if (lower.includes("network"))
            return { Bandwidth: metrics.bandwidth, Latency: metrics.latency, "Packet Loss": metrics.packet_loss };
        if (lower.includes("application"))
            return { "Requests/s": metrics.rps, "Errors/s": metrics.errors, "P95 Latency": metrics.p95_latency };
        if (lower.includes("iot"))
            return { Temperature: metrics.temperature, Fuel: metrics.fuel_level, Battery: metrics.battery };
        if (lower.includes("business"))
            return { Transactions: metrics.transactions, Sales: metrics.sales, Conversions: metrics.conversions };
        return metrics; // fallback
    };

    const renderMetricChart = (key, value) => (
        <div className="p-3 bg-black/40 rounded-lg border border-gray-700 shadow">
            <h4 className="text-sm font-semibold mb-2">{key}</h4>
            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={value || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="time" stroke="#aaa" hide />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", color: "#fff" }} />
                    <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 p-6 bg-black/30 rounded-lg border border-gray-700"
        >
            {loading ? (
                <div className="text-gray-400 text-sm">Loading device data...</div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-lg font-bold">{device.name}</h4>
                            <p className="text-sm opacity-80">Status: {device.status}</p>
                            <p className="text-xs text-gray-400">Last update: {formatTimestamp(lastUpdate)}</p>
                        </div>
                        <button
                            onClick={() => confirmDelete ? onDelete?.(category, device.id) : setConfirmDelete(true)}
                            className="px-3 py-1 border border-red-500 text-red-500 rounded text-xs hover:bg-red-600 hover:text-white flex items-center space-x-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>{confirmDelete ? "Confirm?" : "Delete"}</span>
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {Object.entries(getRelevantMetrics()).map(([k, v]) => renderMetricChart(k, v))}
                    </div>

                    {/* Logs */}
                    <div>
                        <h4 className="flex items-center text-md font-semibold text-green-400 mb-2">
                            <Activity className="w-5 h-5 mr-2" /> Logs
                        </h4>
                        <div className="max-h-40 overflow-y-auto text-sm bg-black/40 p-2 rounded space-y-1 border border-gray-600">
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <div key={i}>
                                        <span className="text-gray-500">[{dayjs(log.timestamp).format("HH:mm:ss")}]</span>{" "}
                                        <span>{log.message}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No logs available</p>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </div>

                    {/* Refresh */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={fetchData}
                            className="inline-flex items-center px-3 py-1 text-xs bg-indigo-600 rounded hover:bg-indigo-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
