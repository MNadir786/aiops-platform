import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Key, Shield, Network, Users, Cog } from "lucide-react";

const API_BASE = "/api/settings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("api-keys");

    // -------------------------------
    // Shared Fetcher
    // -------------------------------
    const fetcher = async (endpoint, method = "GET", body) => {
        const res = await fetch(`${API_BASE}/${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
            console.error(`❌ Fetch failed: ${res.status} ${res.statusText} (${endpoint})`);
            return [];
        }
        return res.json();
    };

    // -------------------------------
    // API Keys
    // -------------------------------
    const [apiKeys, setApiKeys] = useState([]);
    const [newKey, setNewKey] = useState({ name: "", provider: "", key: "" });

    const loadKeys = async () => {
        const data = await fetcher("api-keys/"); // ✅ trailing slash
        setApiKeys(data);
    };

    const addKey = async () => {
        await fetcher("api-keys/", "POST", newKey);
        setNewKey({ name: "", provider: "", key: "" });
        loadKeys();
    };

    const deleteKey = async (id) => {
        await fetcher(`api-keys/${id}/`, "DELETE");
        loadKeys();
    };

    // -------------------------------
    // RBAC
    // -------------------------------
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ user: "", role: "" });

    const loadRoles = async () => {
        const data = await fetcher("rbac/"); // ✅
        setRoles(data);
    };

    const addRole = async () => {
        await fetcher("rbac/", "POST", newRole);
        setNewRole({ user: "", role: "" });
        loadRoles();
    };

    const deleteRole = async (id) => {
        await fetcher(`rbac/${id}/`, "DELETE");
        loadRoles();
    };

    // -------------------------------
    // Compliance
    // -------------------------------
    const [compliance, setCompliance] = useState({ hipaa: false, gdpr: false, soc2: false });

    const loadCompliance = async () => {
        const data = await fetcher("compliance/"); // ✅
        setCompliance(data);
    };

    const updateCompliance = async () => {
        await fetcher("compliance/", "PUT", compliance);
        loadCompliance();
    };

    // -------------------------------
    // Network
    // -------------------------------
    const [network, setNetwork] = useState({ allow_private: true, allowed_cidrs: [] });

    const loadNetwork = async () => {
        const data = await fetcher("network/"); // ✅
        setNetwork(data);
    };

    const updateNetwork = async () => {
        await fetcher("network/", "PUT", network);
        loadNetwork();
    };

    // -------------------------------
    // General
    // -------------------------------
    const [general, setGeneral] = useState({ company_name: "", theme: "dark", notifications_enabled: true });

    const loadGeneral = async () => {
        const data = await fetcher("general/"); // ✅
        setGeneral(data);
    };

    const updateGeneral = async () => {
        await fetcher("general/", "PUT", general);
        loadGeneral();
    };

    // -------------------------------
    // Init Loader
    // -------------------------------
    useEffect(() => {
        loadKeys();
        loadRoles();
        loadCompliance();
        loadNetwork();
        loadGeneral();
    }, []);

    // -------------------------------
    // UI Renderer
    // -------------------------------
    const tabs = [
        { id: "api-keys", label: "API Keys", icon: Key },
        { id: "rbac", label: "RBAC", icon: Users },
        { id: "compliance", label: "Compliance", icon: Shield },
        { id: "network", label: "Network", icon: Network },
        { id: "general", label: "General", icon: Cog },
    ];

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

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

            {/* Content */}
            {activeTab === "api-keys" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🔑 API Keys</h3>
                    <div className="space-y-2">
                        {apiKeys.map((k) => (
                            <div key={k.id} className="flex justify-between bg-black/40 p-3 rounded">
                                <span>{k.name} ({k.provider}) — {k.key_hint}</span>
                                <button onClick={() => deleteKey(k.id)} className="text-red-500 hover:underline">Delete</button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <input
                            placeholder="Name"
                            value={newKey.name}
                            onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <input
                            placeholder="Provider"
                            value={newKey.provider}
                            onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <input
                            placeholder="Key"
                            value={newKey.key}
                            onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <button onClick={addKey} className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700">Add</button>
                    </div>
                </motion.div>
            )}

            {activeTab === "rbac" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">👥 Role-Based Access Control</h3>
                    <div className="space-y-2">
                        {roles.map((r) => (
                            <div key={r.id} className="flex justify-between bg-black/40 p-3 rounded">
                                <span>{r.user} → {r.role}</span>
                                <button onClick={() => deleteRole(r.id)} className="text-red-500 hover:underline">Remove</button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <input
                            placeholder="User"
                            value={newRole.user}
                            onChange={(e) => setNewRole({ ...newRole, user: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <input
                            placeholder="Role"
                            value={newRole.role}
                            onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <button onClick={addRole} className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700">Add</button>
                    </div>
                </motion.div>
            )}

            {activeTab === "compliance" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🛡 Compliance Settings</h3>
                    {["hipaa", "gdpr", "soc2"].map((c) => (
                        <label key={c} className="block">
                            <input
                                type="checkbox"
                                checked={compliance[c]}
                                onChange={(e) => setCompliance({ ...compliance, [c]: e.target.checked })}
                            />{" "}
                            {c.toUpperCase()}
                        </label>
                    ))}
                    <button onClick={updateCompliance} className="mt-3 px-3 py-1 bg-green-600 rounded hover:bg-green-700">Save</button>
                </motion.div>
            )}

            {activeTab === "network" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">🌐 Network Settings</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={network.allow_private}
                            onChange={(e) => setNetwork({ ...network, allow_private: e.target.checked })}
                        /> Allow Private Access
                    </label>
                    <div className="mt-3">
                        <textarea
                            value={network.allowed_cidrs.join("\n")}
                            onChange={(e) => setNetwork({ ...network, allowed_cidrs: e.target.value.split("\n") })}
                            className="w-full h-24 rounded bg-gray-800 border border-gray-600 p-2"
                        />
                    </div>
                    <button onClick={updateNetwork} className="mt-3 px-3 py-1 bg-green-600 rounded hover:bg-green-700">Save</button>
                </motion.div>
            )}

            {activeTab === "general" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl mb-4">⚙️ General</h3>
                    <div className="flex flex-col space-y-2">
                        <input
                            placeholder="Company Name"
                            value={general.company_name}
                            onChange={(e) => setGeneral({ ...general, company_name: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        />
                        <select
                            value={general.theme}
                            onChange={(e) => setGeneral({ ...general, theme: e.target.value })}
                            className="px-2 py-1 rounded bg-gray-800 border border-gray-600"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                        <label>
                            <input
                                type="checkbox"
                                checked={general.notifications_enabled}
                                onChange={(e) => setGeneral({ ...general, notifications_enabled: e.target.checked })}
                            /> Enable Notifications
                        </label>
                        <button onClick={updateGeneral} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Save</button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
