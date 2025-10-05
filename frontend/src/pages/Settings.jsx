// frontend/src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key, Shield, Network, Users, Cog } from "lucide-react";

const API_BASE = "/api/settings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    // -------------------------------
    // Shared Fetcher
    // -------------------------------
    const fetcher = async (endpoint, method = "GET", body) => {
        try {
            const res = await fetch(`${API_BASE}/${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : undefined,
            });
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        } catch {
            return null; // fallback → demo defaults
        }
    };

    // -------------------------------
    // Default Demo Values (always render)
    // -------------------------------
    const defaultGeneral = {
        company_name: "Acme Corp (Demo Data)",
        theme: "dark",
        notifications_enabled: true,
    };
    const defaultNetwork = {
        allow_private: true,
        allowed_cidrs: ["10.0.0.0/16", "192.168.0.0/24 (Demo Data)"],
    };
    const defaultCompliance = {
        hipaa: true,
        gdpr: false,
        soc2: true,
    };
    const defaultRoles = [
        { id: "1", user: "admin@corp.com", role: "admin (Demo Data)" },
        { id: "2", user: "viewer@corp.com", role: "viewer (Demo Data)" },
    ];
    const defaultKeys = [
        { id: "1", name: "Prometheus", provider: "infra", key_hint: "****1234 (Demo Data)" },
        { id: "2", name: "Grafana", provider: "monitoring", key_hint: "****5678 (Demo Data)" },
    ];

    // -------------------------------
    // State (defaults first, backend overrides)
    // -------------------------------
    const [general, setGeneral] = useState(defaultGeneral);
    const [network, setNetwork] = useState(defaultNetwork);
    const [compliance, setCompliance] = useState(defaultCompliance);
    const [roles, setRoles] = useState(defaultRoles);
    const [apiKeys, setApiKeys] = useState(defaultKeys);

    useEffect(() => {
        (async () => {
            const g = await fetcher("general"); if (g) setGeneral(g);
            const n = await fetcher("network"); if (n) setNetwork(n);
            const c = await fetcher("compliance"); if (c) setCompliance(c);
            const r = await fetcher("rbac"); if (r) setRoles(r);
            const k = await fetcher("api-keys"); if (k) setApiKeys(k);
        })();
    }, []);

    // -------------------------------
    // UI Tabs
    // -------------------------------
    const tabs = [
        { id: "general", label: "General", icon: Cog },
        { id: "network", label: "Network", icon: Network },
        { id: "compliance", label: "Compliance", icon: Shield },
        { id: "rbac", label: "RBAC", icon: Users },
        { id: "api-keys", label: "API Keys", icon: Key },
    ];

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">⚙️ Settings (Demo Mode Enabled)</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-700 mb-6">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center space-x-2 pb-2 px-4 ${activeTab === id
                                ? "border-b-2 border-indigo-500 text-indigo-400"
                                : "text-gray-400"
                            }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {/* ----------------- General ----------------- */}
            {activeTab === "general" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">⚙️ General Settings</h3>
                    <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-gray-700">
                        <p><strong>Company Name:</strong> {general.company_name}</p>
                        <p><strong>Theme:</strong> {general.theme}</p>
                        <p><strong>Notifications:</strong> {general.notifications_enabled ? "Enabled" : "Disabled"}</p>
                    </div>
                </motion.div>
            )}

            {/* ----------------- Network ----------------- */}
            {activeTab === "network" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🌐 Network Settings</h3>
                    <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-gray-700">
                        <p><strong>Private Access:</strong> {network.allow_private ? "Allowed" : "Blocked"}</p>
                        <p><strong>Allowed CIDRs:</strong></p>
                        <ul className="list-disc ml-6">
                            {network.allowed_cidrs.map((cidr, i) => (
                                <li key={i}>{cidr}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}

            {/* ----------------- Compliance ----------------- */}
            {activeTab === "compliance" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🛡 Compliance</h3>
                    <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-gray-700">
                        {Object.entries(compliance).map(([key, val]) => (
                            <p key={key}>
                                <strong>{key.toUpperCase()}:</strong> {val ? "✅ Enabled" : "❌ Disabled"}
                            </p>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ----------------- RBAC ----------------- */}
            {activeTab === "rbac" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">👥 Role-Based Access Control</h3>
                    <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-gray-700">
                        {roles.map((r) => (
                            <p key={r.id}>{r.user} → {r.role}</p>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ----------------- API Keys ----------------- */}
            {activeTab === "api-keys" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🔑 API Keys</h3>
                    <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-gray-700">
                        {apiKeys.map((k) => (
                            <p key={k.id}>{k.name} ({k.provider}) — {k.key_hint}</p>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
