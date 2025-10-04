import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, DollarSign, Server, Wrench, AlertTriangle } from "lucide-react";
import MetricsChart from "../components/MetricsChart";

export default function Dashboard() {
    const [overview, setOverview] = useState({
        systemHealth: { healthy: 12, degraded: 1, slo: 92.5 },
        security: { critical: 3, iam: 5, compliant: 92 },
        cost: { aws: 2450, azure: 980, gcp: 1340 },
        remediation: { lastAction: "Restarted API Server", count24h: 4 },
        alerts: { warnings: 12, critical: 3 },
    });

    // Simulate API fetch – replace with real backend later
    useEffect(() => {
        // fetch("/api/overview").then(res => res.json()).then(setOverview);
    }, []);

    const cards = [
        {
            title: "System Health",
            icon: <Activity className="w-6 h-6 text-green-400" />,
            content: (
                <div>
                    <p className="text-green-400 font-semibold">{overview.systemHealth.healthy} Healthy</p>
                    <p className="text-red-400 font-semibold">{overview.systemHealth.degraded} Degraded</p>
                    <p className="text-sm text-gray-400">SLO Compliance: {overview.systemHealth.slo}%</p>
                </div>
            ),
        },
        {
            title: "Security",
            icon: <ShieldAlert className="w-6 h-6 text-purple-400" />,
            content: (
                <div>
                    <p className="text-red-500">Critical Vulns: {overview.security.critical}</p>
                    <p className="text-yellow-400">IAM Issues: {overview.security.iam}</p>
                    <p className="text-green-400">Compliant: {overview.security.compliant}%</p>
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
                    <p className="text-gray-400 text-sm">{overview.remediation.count24h} in last 24h</p>
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
            <h2 className="text-3xl font-bold mb-6">🌐 Global Control Plane Overview</h2>

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
            <div className="bg-black/40 p-6 rounded-2xl shadow-lg border border-gray-800">
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
        </div>
    );
}
