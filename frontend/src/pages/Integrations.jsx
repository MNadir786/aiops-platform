import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Server, Activity, Database, Plus, Trash2 } from "lucide-react";

const API_BASE = "/api/integrations";

export default function Integrations() {
    const [integrations, setIntegrations] = useState([]);
    const [newIntegration, setNewIntegration] = useState({
        provider: "",
        credentials: "",
        region: "",
    });

    const fetcher = async (endpoint, method = "GET", body) => {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });
        return res.json();
    };

    const loadIntegrations = async () => {
        const data = await fetcher("", "GET");
        setIntegrations(data || []);
    };

    const addIntegration = async () => {
        if (!newIntegration.provider || !newIntegration.credentials) return;
        await fetcher("", "POST", newIntegration);
        setNewIntegration({ provider: "", credentials: "", region: "" });
        loadIntegrations();
    };

    const removeIntegration = async (id) => {
        await fetcher(`/${id}`, "DELETE");
        loadIntegrations();
    };

    useEffect(() => {
        loadIntegrations();
    }, []);

    const providerIcon = (provider) => {
        if (/aws/i.test(provider)) return <Cloud className="text-yellow-400" />;
        if (/azure/i.test(provider)) return <Cloud className="text-blue-400" />;
        if (/gcp/i.test(provider)) return <Cloud className="text-red-400" />;
        if (/k8s|kubernetes/i.test(provider)) return <Server className="text-green-400" />;
        if (/onprem|server/i.test(provider)) return <Activity className="text-gray-300" />;
        if (/db|database/i.test(provider)) return <Database className="text-purple-400" />;
        return <Cloud className="text-gray-400" />;
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">🔌 Integrations</h2>

            {/* Existing Integrations */}
            <div className="space-y-4">
                {integrations.length === 0 && <p>No integrations configured.</p>}
                {integrations.map((i) => (
                    <motion.div
                        key={i.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-black/40 p-4 rounded-lg shadow"
                    >
                        <div className="flex items-center space-x-3">
                            {providerIcon(i.provider)}
                            <div>
                                <p className="font-semibold">{i.provider}</p>
                                <p className="text-xs text-gray-400">
                                    Region: {i.region || "default"} — Status:{" "}
                                    <span
                                        className={
                                            i.status === "connected" ? "text-green-400" : "text-red-400"
                                        }
                                    >
                                        {i.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeIntegration(i.id)}
                            className="px-2 py-1 border border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white flex items-center space-x-1 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> <span>Remove</span>
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Add New Integration */}
            <div className="mt-8 bg-black/30 p-6 rounded-lg shadow space-y-4">
                <h3 className="text-lg font-semibold mb-2">➕ Add New Integration</h3>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                    <input
                        placeholder="Provider (AWS, Azure, GCP, Kubernetes, OnPrem...)"
                        value={newIntegration.provider}
                        onChange={(e) =>
                            setNewIntegration({ ...newIntegration, provider: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-600"
                    />
                    <input
                        placeholder="Region (optional)"
                        value={newIntegration.region}
                        onChange={(e) =>
                            setNewIntegration({ ...newIntegration, region: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-600"
                    />
                </div>
                <textarea
                    placeholder="Credentials (API Key, kubeconfig, etc.)"
                    value={newIntegration.credentials}
                    onChange={(e) =>
                        setNewIntegration({ ...newIntegration, credentials: e.target.value })
                    }
                    className="w-full h-24 px-3 py-2 rounded bg-gray-800 border border-gray-600"
                />
                <button
                    onClick={addIntegration}
                    className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" /> <span>Add Integration</span>
                </button>
            </div>
        </div>
    );
}
