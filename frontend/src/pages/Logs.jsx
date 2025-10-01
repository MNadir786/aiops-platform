// src/pages/Logs.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, XCircle, AlertTriangle } from "lucide-react";

export default function Logs() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = () => {
        fetch("/api/logs")
            .then((res) => res.json())
            .then((data) => setLogs(data.logs || []))
            .catch(() => setLogs([]));
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const renderLog = (log, i) => {
        let color = "text-blue-400";
        let Icon = Info;
        if (log.level === "ERROR") {
            color = "text-red-400";
            Icon = XCircle;
        } else if (log.level === "WARNING") {
            color = "text-yellow-400";
            Icon = AlertTriangle;
        }
        return (
            <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center space-x-3 mb-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-md"
            >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-sm text-gray-200">
                    [{log.level}] {log.message} @ {log.timestamp}
                </span>
            </motion.div>
        );
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">📑 Logs</h2>
            <div className="space-y-2">
                {logs.length > 0 ? logs.map(renderLog) : <p>No logs available</p>}
            </div>
        </div>
    );
}
