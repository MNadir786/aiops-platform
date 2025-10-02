// frontend/src/pages/Assets.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, CreditCard, Monitor, Zap, Database, ChevronDown, ChevronUp } from "lucide-react";
import DevicePanel from "../components/DevicePanel";

export default function Assets() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newDevice, setNewDevice] = useState({ category: "", name: "", status: "" });
    const [expandedDevice, setExpandedDevice] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchAssets = () => {
        fetch("/api/assets")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories || []))
            .catch(() => setCategories([]));
    };

    useEffect(() => {
        fetchAssets();
        const interval = setInterval(fetchAssets, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAddCategory = () => {
        if (!newCategory) return;
        fetch(`/api/assets/category/${newCategory}`, { method: "POST" })
            .then(() => {
                setNewCategory("");
                fetchAssets();
            });
    };

    const handleAddDevice = () => {
        if (!newDevice.category || !newDevice.name || !newDevice.status) return;
        fetch(`/api/assets/item/${newDevice.category}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: Date.now(),
                name: newDevice.name,
                status: newDevice.status
            }),
        }).then(() => {
            setNewDevice({ category: "", name: "", status: "" });
            fetchAssets();
        });
    };

    const confirmDeleteDevice = () => {
        if (!deleteTarget) return;
        const { category, id } = deleteTarget;
        fetch(`/api/assets/item/${category}/${id}`, { method: "DELETE" })
            .then(() => {
                setDeleteTarget(null);
                fetchAssets();
            });
    };

    const toggleExpand = (catName, deviceId) => {
        const key = `${catName}-${deviceId}`;
        setExpandedDevice(expandedDevice === key ? null : key);
    };

    const getCategoryIcon = (catName) => {
        if (catName.toLowerCase().includes("server")) return <Server className="text-indigo-400" />;
        if (catName.toLowerCase().includes("atm")) return <CreditCard className="text-green-400" />;
        if (catName.toLowerCase().includes("pos")) return <Monitor className="text-yellow-400" />;
        if (catName.toLowerCase().includes("generator")) return <Zap className="text-red-400" />;
        if (catName.toLowerCase().includes("db")) return <Database className="text-purple-400" />;
        return <Monitor className="text-gray-400" />;
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">💡 Monitored Assets</h2>

            {/* Add Category */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">➕ Add Category</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Category name (e.g., Generators)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 p-2 rounded bg-black/40 border border-gray-600"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Add Device */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">➕ Add Device</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select
                        value={newDevice.category}
                        onChange={(e) => setNewDevice({ ...newDevice, category: e.target.value })}
                        className="p-2 rounded bg-black/40 border border-gray-600"
                    >
                        <option value="">Select category</option>
                        {categories.map((cat, i) => (
                            <option key={i} value={cat.name}>
                                {cat.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Device name"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        className="p-2 rounded bg-black/40 border border-gray-600"
                    />
                    <input
                        type="text"
                        placeholder="Status (e.g., running, error)"
                        value={newDevice.status}
                        onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                        className="p-2 rounded bg-black/40 border border-gray-600"
                    />
                </div>
                <button
                    onClick={handleAddDevice}
                    className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Add Device
                </button>
            </div>

            {/* Display Categories */}
            {categories.length === 0 ? (
                <p>No assets available.</p>
            ) : (
                categories
                    .filter(cat => cat.items && cat.items.length > 0)
                    .map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="mb-6 p-4 bg-white/10 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-3">
                                {getCategoryIcon(cat.name)}
                                <span>{cat.name.toUpperCase()}</span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {cat.items.map((item, j) => {
                                    const key = `${cat.name}-${item.id}`;
                                    const isExpanded = expandedDevice === key;

                                    return (
                                        <div
                                            key={j}
                                            className="bg-black/40 p-4 rounded-lg flex flex-col space-y-2 hover:bg-black/60 transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold">{item.name}</span>
                                                <button
                                                    onClick={() => toggleExpand(cat.name, item.id)}
                                                    className="px-2 py-1 bg-indigo-600 rounded text-xs hover:bg-indigo-700 flex items-center"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4 mr-1" /> Hide
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4 mr-1" /> Expand
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-sm opacity-80">Status: {item.status}</p>

                                            {isExpanded && (
                                                <>
                                                    <DevicePanel category={cat.name} device={item} />
                                                    <div className="mt-3 text-right">
                                                        <button
                                                            onClick={() => setDeleteTarget({ category: cat.name, id: item.id })}
                                                            className="px-3 py-1 border border-red-600 text-red-600 rounded text-xs hover:bg-red-600 hover:text-white"
                                                        >
                                                            Delete Device
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-96 border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-red-400">⚠️ Confirm Deletion</h3>
                        <p className="text-sm mb-4">
                            Are you sure you want to delete this device? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteDevice}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
