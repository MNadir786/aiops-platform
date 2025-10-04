// frontend/src/pages/Discovery.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// -------------------------------
// Logo mapping (use real logos/icons)
// -------------------------------
const logos = {
    AWS: "https://cdn.worldvectorlogo.com/logos/aws-2.svg",
    Azure: "https://cdn.worldvectorlogo.com/logos/microsoft-azure-3.svg",
    GCP: "https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg",
    OnPrem: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
    Medical: "https://cdn-icons-png.flaticon.com/512/2966/2966485.png",
    Grafana: "https://grafana.com/static/assets/img/fav32.png",
    Prometheus: "https://upload.wikimedia.org/wikipedia/commons/3/38/Prometheus_software_logo.svg",
};

// -------------------------------
// Discovery Page
// -------------------------------
export default function Discovery() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDiscovery = () => {
        setLoading(true);
        fetch("/api/discovery")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.categories || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchDiscovery();
    }, []);

    const formatDate = (ts) => (ts ? dayjs(ts).format("MMM D, HH:mm:ss") : "n/a");

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold">🔍 Resource Discovery</h2>
                <button
                    onClick={fetchDiscovery}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded shadow"
                >
                    Trigger Discovery
                </button>
            </div>

            {loading ? (
                <p className="text-gray-400">Running discovery...</p>
            ) : categories.length === 0 ? (
                <p>No resources discovered yet.</p>
            ) : (
                categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="mb-8 p-6 bg-white/10 rounded-lg shadow-lg"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-3">
                            <span className="capitalize">{cat.name}</span>
                        </h3>

                        {/* Grid of resources */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cat.resources.map((res, j) => (
                                <motion.div
                                    key={j}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-black/40 p-4 rounded-lg border border-gray-700 shadow"
                                >
                                    {/* Provider logo */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            {logos[res.provider] && (
                                                <img
                                                    src={logos[res.provider]}
                                                    alt={res.provider}
                                                    className="w-6 h-6"
                                                />
                                            )}
                                            <h4 className="font-semibold">{res.name}</h4>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${res.status === "running" ||
                                                    res.status === "available" ||
                                                    res.status === "connected" ||
                                                    res.status === "operational"
                                                    ? "bg-green-600"
                                                    : res.status === "stopped" ||
                                                        res.status === "degraded"
                                                        ? "bg-yellow-600"
                                                        : "bg-red-600"
                                                }`}
                                        >
                                            {res.status}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <ul className="text-sm space-y-1 text-gray-300">
                                        <li>
                                            <span className="font-semibold">Type:</span> {res.type}
                                        </li>
                                        <li>
                                            <span className="font-semibold">Provider:</span>{" "}
                                            {res.provider}
                                        </li>
                                        <li>
                                            <span className="font-semibold">Region:</span>{" "}
                                            {res.region}
                                        </li>
                                        <li>
                                            <span className="font-semibold">Discovered:</span>{" "}
                                            {formatDate(res.discovered_at)}
                                        </li>

                                        {/* Special attributes (if exist) */}
                                        {res.tags &&
                                            Object.entries(res.tags).map(([k, v]) => (
                                                <li key={k}>
                                                    <span className="font-semibold capitalize">
                                                        {k}:
                                                    </span>{" "}
                                                    {v}
                                                </li>
                                            ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
}
