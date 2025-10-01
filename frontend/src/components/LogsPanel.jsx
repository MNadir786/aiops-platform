// src/components/LogsPanel.jsx
import { motion } from "framer-motion";
import { Info, XCircle, AlertTriangle, FileText } from "lucide-react";

export default function LogsPanel({ logs }) {
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
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 backdrop-blur-md"
            >
                <Icon className={`w-6 h-6 ${color}`} />
                <span className="text-sm text-gray-200">
                    [{log.level}] {log.message} @ {log.timestamp}
                </span>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20"
        >
            <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-purple-400">
                <FileText />
                <span>Recent Logs</span>
            </h2>
            <div className="max-h-64 overflow-y-auto pr-2">
                {logs.length > 0 ? logs.map(renderLog) : <p>No logs available</p>}
            </div>
        </motion.div>
    );
}
