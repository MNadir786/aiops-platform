// src/components/MetricsChart.jsx
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function MetricsChart({ history, onExpand }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/20"
            onClick={onExpand}
        >
            <h2 className="flex items-center space-x-2 text-xl font-semibold mb-4 text-indigo-400">
                📊 <span>Metrics History (click to expand)</span>
            </h2>
            <div className="h-48 opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#aaa" />
                        <YAxis stroke="#aaa" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111",
                                border: "1px solid #333",
                                color: "#fff"
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="cpu"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="memory"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
