// frontend/src/components/DevicePanel.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
    RefreshCw,
    Activity,
    Cpu,
    HardDrive,
    CreditCard,
    DollarSign,
    ShoppingCart,
    Monitor,
    BatteryCharging,
    Zap,
    Thermometer,
    Terminal,
} from "lucide-react";

dayjs.extend(relativeTime);

export default function DevicePanel({ category, device }) {
    const [metrics, setMetrics] = useState(null);
    const [logs, setLogs] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
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
            console.error("Error fetching device panel data:", err);
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

    const formatLogTime = (ts) =>
        ts ? dayjs(ts).format("HH:mm:ss") : "";

    const colorForMetric = (key, value) => {
        if (key.toLowerCase().includes("fuel")) {
            return value > 50
                ? "bg-green-600/20 text-green-400"
                : value > 20
                    ? "bg-yellow-600/20 text-yellow-400"
                    : "bg-red-600/20 text-red-400";
        }
        if (key.toLowerCase().includes("temp")) {
            return value > 70
                ? "bg-red-600/20 text-red-400"
                : "bg-orange-600/20 text-orange-400";
        }
        return "bg-gray-700/40 text-gray-200";
    };

    const renderBigIcon = () => {
        if (category.toLowerCase().includes("server"))
            return (
                <div className="p-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-700 shadow-xl">
                    <Cpu className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
            );
        if (category.toLowerCase().includes("atm"))
            return (
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-xl">
                    <CreditCard className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
            );
        if (category.toLowerCase().includes("pos"))
            return (
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-xl">
                    <ShoppingCart className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
            );
        if (category.toLowerCase().includes("generator"))
            return (
                <div className="p-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-xl">
                    <BatteryCharging className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
            );
        return (
            <div className="p-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-xl">
                <Monitor className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
        );
    };

    const getLogColor = (msg) => {
        if (/error|failed|declined|offline/i.test(msg))
            return "text-red-400 font-semibold";
        if (/warn|low|timeout/i.test(msg)) return "text-yellow-400";
        if (/approved|started|online|ok/i.test(msg)) return "text-green-400";
        return "text-gray-300";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 p-4 bg-black/30 rounded-lg border border-gray-700"
        >
            {loading ? (
                <div className="text-gray-400 text-sm">Loading device data...</div>
            ) : (
                <>
                    {/* Header with Icon */}
                    <div className="flex items-center space-x-4 mb-4">
                        {renderBigIcon()}
                        <div>
                            <h4 className="text-lg font-bold">{device.name}</h4>
                            <p className="text-sm opacity-80">Status: {device.status}</p>
                            <p className="text-xs text-gray-400">
                                Last update: {formatTimestamp(lastUpdate)}
                            </p>
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="mb-4">
                        <h4 className="flex items-center text-md font-semibold text-indigo-400 mb-2">
                            <Activity className="w-5 h-5 mr-2" /> Metrics
                        </h4>
                        {metrics ? (
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(metrics).map(([key, value], idx) => (
                                    <li
                                        key={idx}
                                        className={`flex items-center space-x-2 p-2 rounded shadow-sm ${colorForMetric(
                                            key,
                                            parseFloat(value) || value
                                        )}`}
                                    >
                                        {key.toLowerCase().includes("cpu") && (
                                            <Cpu className="w-4 h-4" />
                                        )}
                                        {key.toLowerCase().includes("memory") && (
                                            <HardDrive className="w-4 h-4" />
                                        )}
                                        {key.toLowerCase().includes("cash") && (
                                            <DollarSign className="w-4 h-4" />
                                        )}
                                        {key.toLowerCase().includes("fuel") && (
                                            <Zap className="w-4 h-4" />
                                        )}
                                        {key.toLowerCase().includes("temp") && (
                                            <Thermometer className="w-4 h-4" />
                                        )}
                                        <span className="capitalize font-bold">{key}:</span>
                                        {key.toLowerCase().includes("timestamp")
                                            ? dayjs(value).format("HH:mm:ss (MMM D)")
                                            : value}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No metrics available</p>
                        )}
                    </div>

                    {/* Logs Section */}
                    <div>
                        <h4 className="flex items-center text-md font-semibold text-green-400 mb-2">
                            <Terminal className="w-5 h-5 mr-2" /> Logs
                        </h4>
                        <div className="max-h-40 overflow-y-auto text-sm bg-black/40 p-2 rounded space-y-1 border border-gray-600">
                            {logs.length > 0 ? (
                                <>
                                    {logs.map((log, i) => (
                                        <div key={i} className={getLogColor(log.message)}>
                                            <span className="text-gray-500">
                                                [{formatLogTime(log.timestamp)}]
                                            </span>{" "}
                                            {log.message}
                                        </div>
                                    ))}
                                    <div ref={logEndRef} />
                                </>
                            ) : (
                                <p className="text-gray-400">No logs available</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex justify-start">
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
