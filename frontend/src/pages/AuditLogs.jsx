// src/pages/AuditLogs.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Search, Filter } from "lucide-react";
import dayjs from "dayjs";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [severity, setSeverity] = useState("all");

    useEffect(() => {
        // ✅ Dummy logs for demo
        const dummyLogs = [
            {
                id: 1,
                service: "Discovery",
                action: "Asset Scan",
                severity: "info",
                timestamp: new Date().toISOString(),
                user: "system",
            },
            {
                id: 2,
                service: "Analytics",
                action: "Query Failure",
                severity: "error",
                timestamp: new Date().toISOString(),
                user: "demo-user",
            },
            {
                id: 3,
                service: "Remediation",
                action: "Auto-Heal Triggered",
                severity: "warn",
                timestamp: new Date().toISOString(),
                user: "ai-automation",
            },
        ];
        setLogs(dummyLogs);
    }, []);

    const filteredLogs = logs.filter(
        (log) =>
            (severity === "all" || log.severity === severity) &&
            (log.service.toLowerCase().includes(search.toLowerCase()) ||
                log.action.toLowerCase().includes(search.toLowerCase()) ||
                log.user.toLowerCase().includes(search.toLowerCase()))
    );

    const severityBadge = (sev) => {
        const colors = {
            info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
            warn: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
            error: "bg-red-500/20 text-red-300 border-red-500/30",
        };
        return `px-2 py-1 text-xs rounded-md border ${colors[sev] || "bg-gray-600/20 text-gray-400 border-gray-700"}`;
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold flex items-center space-x-3 mb-6">
                <ShieldAlert className="text-indigo-400" />
                <span>Audit Logs</span>
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-2 mb-6">
                <div className="flex items-center bg-black/40 rounded-md px-2 border border-gray-700">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent px-2 py-1 focus:outline-none text-sm"
                    />
                </div>
                <div className="flex items-center bg-black/40 rounded-md px-2 border border-gray-700">
                    <Filter className="w-4 h-4 text-gray-400 mr-1" />
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="bg-transparent text-sm focus:outline-none"
                    >
                        <option value="all">All</option>
                        <option value="info">Info</option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                <table className="w-full text-sm">
                    <thead className="bg-white/10 text-gray-300">
                        <tr>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Service</th>
                            <th className="px-4 py-2 text-left">Action</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => (
                            <motion.tr
                                key={log.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-t border-white/10 hover:bg-white/5"
                            >
                                <td className="px-4 py-2">{dayjs(log.timestamp).format("HH:mm:ss (MMM D)")}</td>
                                <td className="px-4 py-2">{log.service}</td>
                                <td className="px-4 py-2">{log.action}</td>
                                <td className="px-4 py-2 text-gray-400">{log.user}</td>
                                <td className="px-4 py-2">
                                    <span className={severityBadge(log.severity)}>{log.severity}</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
