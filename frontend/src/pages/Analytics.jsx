// frontend/src/pages/Analytics.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dummyHistory, setDummyHistory] = useState([]);

    // Fetch categories
    const fetchAssets = () => {
        fetch("/api/assets")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.categories || []);
                if (!selectedCategory && data.categories?.length > 0) {
                    setSelectedCategory(data.categories[0].name);
                }
            })
            .catch(() => setCategories([]));
    };

    // Dummy generator for metrics over time
    const generateDummy = () => {
        const now = new Date();
        const points = [];
        for (let i = 0; i < 20; i++) {
            const t = new Date(now.getTime() - (20 - i) * 5000).toLocaleTimeString();
            points.push({
                time: t,
                cpu: Math.random() * 100,
                memory: Math.random() * 100,
                fuel: Math.random() * 100,
                temperature: 50 + Math.random() * 30,
            });
        }
        setDummyHistory(points);
    };

    useEffect(() => {
        fetchAssets();
        generateDummy();
        const interval = setInterval(generateDummy, 5000);
        return () => clearInterval(interval);
    }, []);

    const selectedDevices =
        categories.find((c) => c.name === selectedCategory)?.items || [];

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h2>

            {/* Category Selector */}
            <div className="mb-6">
                <label className="mr-3 font-semibold">Select Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 rounded bg-black/40 border border-gray-600"
                >
                    {categories.map((cat, i) => (
                        <option key={i} value={cat.name}>
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {selectedDevices.length === 0 ? (
                <p>No devices in this category.</p>
            ) : (
                <div className="grid gap-8">
                    {selectedDevices.map((device, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white/10 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4">
                                {device.name}
                            </h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dummyHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                                        <XAxis dataKey="time" stroke="#aaa" />
                                        <YAxis stroke="#aaa" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#111",
                                                border: "1px solid #333",
                                                color: "#fff",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="cpu"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="memory"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="fuel"
                                            stroke="#eab308"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="temperature"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
