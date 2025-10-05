// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    ShieldAlert,
    DollarSign,
    Wrench,
    AlertTriangle,
    Server,
} from "lucide-react";
import MetricsChart from "../components/MetricsChart";

export default function Dashboard() {
    // -------------------------------
    // Default Demo Data (always render)
    // -------------------------------
    const demoOverview = {
        systemHealth: { healthy: 12, degraded: 1, slo: 92.5 },
        security: { critical: 3, iam: 5, compliant: 92 },
        cost: { aws: 2450, azure: 980, gcp: 1340 },
        remediation: { lastAction: "Restarted API Server", count24h: 4 },
        alerts: { warnings: 12, critical: 3 },
    };

    const demoAgents = {
        demo01: { status: "online", last_seen: "just now (Demo Data)" },
        demo02: { status: "offline", last_seen: "5m ago (Demo Data)" },
    };

    const [overview, setOverview] = useState(demoOverview);
    const [agents, setAgents] = useState(demoAgents);

    // -------------------------------
    // Backend fetch (overrides demo)
    // -------------------------------
    useEffect(() => {
        fetch("/api/overview")
            .then((res) => res.json())
            .then((data) => setOverview(data))
            .catch(() => setOverview(demoOverview));

        fetch("/api/agent")
            .then((res) => res.json())
            .then((data) => setAgents(data.agents || demoAgents))
            .catch(() => setAgents(demoAgents));
    }, []);

    // -------------------------------
    // Cards
    // -------------------------------
    const cards = [
        {
            title: "System Health",
            icon: <Activity className="w-6 h-6 text-green-400" />,
            content: (
                <div>
                    <p className="text-green-400 font-semibold">
                        {overview.systemHealth.healthy} Healthy
                    </p>
                    <p className="text-red-400 font-semibold">
                        {overview.systemHealth.degraded} Degraded
                    </p>
                    <p className="text-sm text-gray-400">
                        SLO Compliance: {overview.systemHealth.slo}%
                    </p>
                </div>
            ),
        },
        {
            title: "Security",
            icon: <ShieldAlert className="w-6 h-6 text-purple-400" />,
            content: (
                <div>
                    <p className="text-red-500">
                        Critical Vulns: {overview.security.critical}
                    </p>
                    <p className="text-yellow-400">IAM Issues: {overview.security.iam}</p>
                    <p className="text-green-400">
                        Compliant: {overview.security.compliant}%
                    </p>
                </div>
            ),
        },
        {
            title: "Cost Snapshot",
            icon: <DollarSign className="w-6 h-6 text-indigo-400" />,
            content: (
                <ul className="text-sm">
                    <li>AWS: ${overview.cost.aws}</li>
                    <li>Azure: ${overview.cost.azure}</li>
                    <li>GCP: ${overview.cost.gcp}</li>
                </ul>
            ),
        },
        {
            title: "Remediation",
            icon: <Wrench className="w-6 h-6 text-blue-400" />,
            content: (
                <div>
                    <p className="text-sm">Last Action:</p>
                    <p className="font-semibold">{overview.remediation.lastAction}</p>
                    <p className="text-gray-400 text-sm">
                        {overview.remediation.count24h} in last 24h
                    </p>
                </div>
            ),
        },
        {
            title: "Alerts",
            icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
            content: (
                <div>
                    <p className="text-yellow-400">{overview.alerts.warnings} Warnings</p>
                    <p className="text-red-500">{overview.alerts.critical} Critical</p>
                </div>
            ),
        },
    ];

    return (
        <div className="p-8 text-white">
            {/* Header */}
            <h2 className="text-3xl font-bold mb-6">
                🌐 Global Control Plane Overview
            </h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {cards.map((c, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-lg p-6 border border-gray-800"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            {c.icon}
                            <h3 className="text-lg font-semibold">{c.title}</h3>
                        </div>
                        {c.content}
                    </motion.div>
                ))}
            </div>

            {/* Detailed Metrics Section */}
            <div className="bg-black/40 p-6 rounded-2xl shadow-lg border border-gray-800 mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">📊 Detailed Metrics</h3>
                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm">
                        Expand
                    </button>
                </div>

                {/* Example Cluster-Level Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetricsChart title="Cluster CPU Usage" />
                    <MetricsChart title="Cluster Memory Usage" />
                    <MetricsChart title="Pod Restarts" />
                    <MetricsChart title="Disk I/O (Aggregate)" />
                </div>
            </div>

            {/* Agent Fleet Section */}
            <div className="bg-black/40 p-6 rounded-2xl shadow-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">🖥 Agent Fleet Overview</h3>
                {agents && Object.keys(agents).length > 0 ? (
                    <div className="space-y-3">
                        {Object.entries(agents).map(([id, agent]) => (
                            <div
                                key={id}
                                className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800"
                            >
                                <div>
                                    <p className="font-semibold">{id}</p>
                                    <p className="text-sm text-gray-400">
                                        Status: {agent.status} | Last Seen: {agent.last_seen}
                                    </p>
                                </div>
                                <Server className="w-5 h-5 text-indigo-400" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No agents connected yet…</p>
                )}
            </div>
        </div>
    );
}
