// frontend/src/pages/AgentDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Server, Activity, Wifi } from "lucide-react";
import MetricsChart from "../components/MetricsChart";

export default function AgentDetails() {
    const { agentId } = useParams();
    const [agent, setAgent] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [audit, setAudit] = useState([]);

    // -------------------------------
    // Load agent status
    // -------------------------------
    const loadAgent = async () => {
        try {
            const res = await fetch("/api/agent");
            const data = await res.json();
            setAgent(data.agents?.[agentId] || null);
        } catch (err) {
            console.error("Failed to fetch agent:", err);
        }
    };

    // -------------------------------
    // Load anomalies + audit logs
    // -------------------------------
    const loadAnomalies = async () => {
        try {
            const res = await fetch("/api/anomalies");
            const data = await res.json();
            setAnomalies(data.anomalies || []);
        } catch (err) {
            console.error("Failed to fetch anomalies:", err);
        }
    };

    const loadAudit = async () => {
        try {
            const res = await fetch("/api/remediation/audit");
            const data = await res.json();
            setAudit(data.audit || []);
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
        }
    };

    useEffect(() => {
        loadAgent();
        loadAnomalies();
        loadAudit();
        const interval = setInterval(() => {
            loadAgent();
            loadAnomalies();
            loadAudit();
        }, 5000);
        return () => clearInterval(interval);
    }, [agentId]);

    if (!agent) {
        return (
            <div className="p-8 text-white">
                <Link to="/dashboard" className="flex items-center space-x-2 text-indigo-400 mb-6">
                    <ArrowLeft className="w-4 h-4" /> <span>Back to Dashboard</span>
                </Link>
                <p>Loading agent {agentId}...</p>
            </div>
        );
    }

    return (
        <div className="p-8 text-white">
            <Link to="/dashboard" className="flex items-center space-x-2 text-indigo-400 mb-6">
                <ArrowLeft className="w-4 h-4" /> <span>Back to Dashboard</span>
            </Link>

            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Server className="w-6 h-6 text-indigo-400" />
                <span>Agent {agentId.slice(0, 8)} Details</span>
            </h2>

            {/* Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-green-400" />
                        <span>System Metrics</span>
                    </h3>
                    <MetricsChart />
                    <p className="text-sm text-gray-400 mt-2">
                        CPU: {agent.metrics?.cpu_usage ?? "—"}% | Memory: {agent.metrics?.memory_usage ?? "—"}%
                    </p>
                </motion.div>

                <motion.div
                    className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                        <Wifi className="w-5 h-5 text-blue-400" />
                        <span>Network</span>
                    </h3>
                    <p>
                        Status:{" "}
                        {agent.network?.connectivity_ok ? (
                            <span className="text-green-400">Connected</span>
                        ) : (
                            <span className="text-red-400">Disconnected</span>
                        )}
                    </p>
                    <p>Latency: {agent.network?.latency_ms ?? "—"} ms</p>
                    <p className="text-xs text-gray-400">Error: {agent.network?.last_error ?? "none"}</p>
                </motion.div>
            </div>

            {/* Anomalies */}
            <motion.div
                className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-md mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-yellow-400" />
                    <span>Anomalies</span>
                </h3>
                {anomalies.length === 0 ? (
                    <p className="text-gray-400 text-sm">No anomalies detected.</p>
                ) : (
                    <ul className="text-sm space-y-2">
                        {anomalies.map((a, idx) => (
                            <li key={idx} className="bg-black/30 rounded p-2">
                                {a.type.toUpperCase()} anomaly → Value: {a.value}, Mean: {a.mean}, Stdev: {a.stdev}
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>

            {/* Remediation Audit */}
            <motion.div
                className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-md mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span>Remediation History</span>
                </h3>
                {audit.length === 0 ? (
                    <p className="text-gray-400 text-sm">No remediation actions logged yet.</p>
                ) : (
                    <ul className="text-sm space-y-2">
                        {audit.map((entry, idx) => (
                            <li key={idx} className="bg-black/30 rounded p-2">
                                [{entry.timestamp}] {entry.target} → {entry.action} :{" "}
                                {JSON.stringify(entry.result)}
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </div>
    );
}
