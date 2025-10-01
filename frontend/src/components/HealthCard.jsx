// src/components/HealthCard.jsx
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function HealthCard({ health, timestamp }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20"
        >
            <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-green-400">
                <Activity />
                <span>System Health</span>
            </h2>
            {health === "ok" ? (
                <p className="text-green-400 font-semibold text-lg">
                    ✅ Healthy @ {timestamp}
                </p>
            ) : (
                <p className="text-red-400 font-semibold text-lg">❌ {health}</p>
            )}
        </motion.div>
    );
}
