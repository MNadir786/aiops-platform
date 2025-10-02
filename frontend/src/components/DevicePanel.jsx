// frontend/src/components/DevicePanel.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Activity, Terminal } from "lucide-react";

export default function DevicePanel({ category, device }) {
    const [metrics, setMetrics] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch metrics
            const metricsRes = await fetch(`/api/assets/${category}/${device.id}/metrics`);
            const metricsData = await metricsRes.json();

            // Fetch logs
            const logsRes = await fetch(`/api/assets/${category}/${device.id}/logs`);
            const logsData = await logsRes.json();

            setMetrics(metricsData.metrics || {});
            setLogs(logsData.logs || []);
        } catch (err) {
            console.error("Error fetching device panel data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, [category, device.id]);

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
                    {/* Metrics Section */}
                    <div className="mb-4">
                        <h4 className="flex items-center text-lg font-semibold text-indigo-400 mb-2">
                            <Activity className="w-5 h-5 mr-2" /> Metrics
                        </h4>
                        {metrics ? (
                            <ul className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(metrics).map(([key, value], idx) => (
                                    <li key={idx} className="bg-white/5 p-2 rounded">
                                        <span className="font-bold capitalize">{key}:</span> {value}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No metrics available</p>
                        )}
                    </div>

                    {/* Logs Section */}
                    <div>
                        <h4 className="flex items-center text-lg font-semibold text-green-400 mb-2">
                            <Terminal className="w-5 h-5 mr-2" /> Logs
                        </h4>
                        <div className="max-h-40 overflow-y-auto text-sm bg-black/40 p-2 rounded space-y-1 border border-gray-600">
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <div key={i} className="text-gray-300">
                                        <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No logs available</p>
                            )}
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <div className="mt-3 text-right">
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
