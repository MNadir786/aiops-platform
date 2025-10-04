import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Cpu, MemoryStick } from "lucide-react";

const API_BASE = "/api";

export default function Anomalies() {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);

    // -------------------------------
    // Load anomalies
    // -------------------------------
    const loadAnomalies = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/anomalies`);
            const data = await res.json();
            setAnomalies(data.anomalies || []);
        } catch (err) {
            console.error("Error fetching anomalies:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // Remediation trigger
    // -------------------------------
    const remediate = async (target, action, params = {}) => {
        try {
            const res = await fetch(`${API_BASE}/remediation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target, action, params }),
            });
            const data = await res.json();
            alert(`✅ Remediation triggered:\n${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            console.error("Remediation failed:", err);
            alert("❌ Remediation failed");
        }
    };

    useEffect(() => {
        loadAnomalies();
        const interval = setInterval(loadAnomalies, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
                Anomalies
            </h2>

            {loading && <p className="text-gray-400">Loading anomalies...</p>}

            {!loading && anomalies.length === 0 && (
                <p className="text-green-400">✅ No anomalies detected</p>
            )}

            <div className="space-y-4">
                {anomalies.map((a, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-black/40 border border-gray-700 shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {a.type === "cpu" ? (
                                    <Cpu className="w-5 h-5 text-red-400" />
                                ) : (
                                    <MemoryStick className="w-5 h-5 text-indigo-400" />
                                )}
                                <div>
                                    <h3 className="font-semibold capitalize">{a.type} anomaly</h3>
                                    <p className="text-sm text-gray-400">
                                        Value: <span className="text-white">{a.value}%</span> | Mean:{" "}
                                        <span className="text-white">{a.mean}%</span> | Stdev:{" "}
                                        <span className="text-white">{a.stdev}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Detected at {a.time} | Threshold: {a.threshold}σ
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    remediate("infrastructure", a.remediation, { service: a.type })
                                }
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
                            >
                                Remediate ({a.remediation})
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
