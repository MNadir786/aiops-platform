// frontend/src/pages/Discovery.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Server,
    Database,
    Globe,
    Shield,
    Cloud,
    Cpu,
    BarChart2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import DevicePanel from "../components/DevicePanel";

export default function Discovery() {
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Fetch assets
    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/assets");
            const data = await res.json();
            if (data.categories?.length > 0) {
                setCategories(data.categories);
            } else {
                // Dummy fallback: multi-cloud catalog
                setCategories([
                    {
                        name: "AWS",
                        items: [
                            { id: 1, name: "EC2 Instance (us-east-1)", status: "running" },
                            { id: 2, name: "RDS Database", status: "available" },
                        ],
                    },
                    {
                        name: "Azure",
                        items: [
                            { id: 3, name: "VM Scale Set", status: "running" },
                            { id: 4, name: "Azure SQL DB", status: "online" },
                        ],
                    },
                    {
                        name: "GCP",
                        items: [
                            { id: 5, name: "GKE Cluster", status: "active" },
                            { id: 6, name: "Cloud Storage Bucket", status: "healthy" },
                        ],
                    },
                    {
                        name: "On-Prem",
                        items: [
                            { id: 7, name: "Kubernetes Node", status: "running" },
                            { id: 8, name: "Firewall Appliance", status: "online" },
                        ],
                    },
                ]);
            }
        } catch (err) {
            console.error("Error fetching assets:", err);
        }
    };

    useEffect(() => {
        fetchAssets();
        const interval = setInterval(fetchAssets, 15000);
        return () => clearInterval(interval);
    }, []);

    const toggleCategory = (name) => {
        setExpandedCategory(expandedCategory === name ? null : name);
    };

    const getCategoryIcon = (name) => {
        if (/aws/i.test(name)) return <Cloud className="text-orange-400" />;
        if (/azure/i.test(name)) return <Cloud className="text-blue-400" />;
        if (/gcp/i.test(name)) return <Cloud className="text-red-400" />;
        if (/database/i.test(name)) return <Database className="text-green-400" />;
        if (/network/i.test(name)) return <Globe className="text-yellow-400" />;
        if (/security/i.test(name)) return <Shield className="text-indigo-400" />;
        return <Server className="text-gray-400" />;
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">🌐 Discovery Catalog</h2>

            {categories.length === 0 ? (
                <p>No resources discovered yet.</p>
            ) : (
                categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mb-6 rounded-lg shadow-lg bg-white/10"
                    >
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(cat.name)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-lg"
                        >
                            <span className="flex items-center space-x-3">
                                {getCategoryIcon(cat.name)}
                                <span className="uppercase">{cat.name}</span>
                            </span>
                            {expandedCategory === cat.name ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>

                        {/* Category Body */}
                        {expandedCategory === cat.name && (
                            <div className="px-6 pb-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {cat.items.map((item, j) => (
                                        <div
                                            key={j}
                                            className="bg-black/40 p-4 rounded-lg shadow-lg hover:bg-black/60 transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold">{item.name}</span>
                                                <span className="text-sm text-green-400">
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Discovered via {cat.name}
                                            </p>
                                            <div className="mt-3">
                                                <DevicePanel category={cat.name} device={item} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))
            )}
        </div>
    );
}
