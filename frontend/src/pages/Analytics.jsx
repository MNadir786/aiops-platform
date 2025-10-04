// frontend/src/pages/Analytics.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Cpu,
    Database,
    Network,
    DollarSign,
    HeartPulse,
    Activity,
    Filter,
} from "lucide-react";

export default function Analytics() {
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("summary"); // "summary" | "drilldown"
    const [filter, setFilter] = useState({ provider: "All", region: "All" });

    const fetchDiscovery = () => {
        fetch("/api/discovery")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories || []))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchDiscovery();
        const interval = setInterval(fetchDiscovery, 15000);
        return () => clearInterval(interval);
    }, []);

    // FAANG-style summary cards
    const SummaryCard = ({ icon: Icon, title, value, color }) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg"
        >
            <div className="flex items-center space-x-3">
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-3xl font-bold mt-3">{value}</p>
        </motion.div>
    );

    // Aggregate values
    const totalServers =
        categories.find((c) => c.name === "Compute")?.resources.length || 0;
    const totalDBs =
        categories.find((c) => c.name === "Database")?.resources.length || 0;
    const totalNetworks =
        categories.find((c) => c.name === "Networking")?.resources.length || 0;
    const totalMedical =
        categories.find((c) => c.name === "Medical")?.resources.length || 0;

    // Drilldown data (flat list)
    const allResources = categories.flatMap((c) =>
        c.resources.map((r) => ({ ...r, category: c.name }))
    );

    const filteredResources = allResources.filter(
        (r) =>
            (filter.provider === "All" || r.provider === filter.provider) &&
            (filter.region === "All" || r.region === filter.region)
    );

    // Unique filters
    const providers = ["All", ...new Set(allResources.map((r) => r.provider))];
    const regions = ["All", ...new Set(allResources.map((r) => r.region))];

    return (
        <div className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold tracking-wide flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                    <span>Analytics Dashboard</span>
                </h2>

                {/* Toggle View Mode */}
                <button
                    onClick={() =>
                        setViewMode(viewMode === "summary" ? "drilldown" : "summary")
                    }
                    className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm font-semibold flex items-center space-x-2"
                >
                    <Filter className="w-4 h-4" />
                    <span>
                        {viewMode === "summary" ? "Switch to Drilldown" : "Back to Summary"}
                    </span>
                </button>
            </div>

            {viewMode === "summary" ? (
                // ===== Summary Mode =====
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <SummaryCard
                        icon={Cpu}
                        title="Total Servers"
                        value={totalServers}
                        color="text-indigo-400"
                    />
                    <SummaryCard
                        icon={Database}
                        title="Databases"
                        value={totalDBs}
                        color="text-blue-400"
                    />
                    <SummaryCard
                        icon={Network}
                        title="Networks"
                        value={totalNetworks}
                        color="text-yellow-400"
                    />
                    <SummaryCard
                        icon={HeartPulse}
                        title="Medical Devices"
                        value={totalMedical}
                        color="text-red-400"
                    />
                </div>
            ) : (
                // ===== Drilldown Mode =====
                <div className="bg-black/40 p-6 rounded-xl shadow-lg border border-white/10">
                    {/* Filters */}
                    <div className="flex space-x-4 mb-4">
                        <select
                            value={filter.provider}
                            onChange={(e) =>
                                setFilter((f) => ({ ...f, provider: e.target.value }))
                            }
                            className="bg-black/40 border border-gray-600 rounded px-3 py-1"
                        >
                            {providers.map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>
                        <select
                            value={filter.region}
                            onChange={(e) =>
                                setFilter((f) => ({ ...f, region: e.target.value }))
                            }
                            className="bg-black/40 border border-gray-600 rounded px-3 py-1"
                        >
                            {regions.map((r) => (
                                <option key={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-white/10">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Provider</th>
                                    <th className="px-4 py-2">Region</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResources.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-white/10 hover:bg-white/5"
                                    >
                                        <td className="px-4 py-2">{r.name}</td>
                                        <td className="px-4 py-2">{r.category}</td>
                                        <td className="px-4 py-2">{r.provider}</td>
                                        <td className="px-4 py-2">{r.region}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === "running" ||
                                                        r.status === "available" ||
                                                        r.status === "connected"
                                                        ? "bg-green-600 text-white"
                                                        : "bg-red-600 text-white"
                                                    }`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
