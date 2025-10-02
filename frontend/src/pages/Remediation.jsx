// src/pages/Remediation.jsx
import { useState, useEffect } from "react";

export default function Remediation() {
    const [actions, setActions] = useState({});
    const [history, setHistory] = useState([]);

    // Fetch available remediation actions
    const fetchActions = () => {
        fetch("/api/remediation/actions")
            .then((res) => res.json())
            .then((data) => setActions(data.actions || {}))
            .catch(() => setActions({}));
    };

    // Fetch remediation history
    const fetchHistory = () => {
        fetch("/api/remediation/history")
            .then((res) => res.json())
            .then((data) => setHistory(data.history || []))
            .catch(() => setHistory([]));
    };

    // Run selected action
    const runAction = (action) => {
        fetch(`/api/remediation/run/${action}`, { method: "POST" })
            .then((res) => res.json())
            .then(() => {
                fetchHistory();
            });
    };

    useEffect(() => {
        fetchActions();
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">🛠️ Remediation</h2>
            </div>

            {/* Render action buttons dynamically */}
            <div className="flex flex-wrap gap-3 mb-8">
                {Object.keys(actions).length > 0 ? (
                    Object.entries(actions).map(([key, val]) => (
                        <button
                            key={key}
                            onClick={() => runAction(key)}
                            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
                        >
                            {val.desc}
                        </button>
                    ))
                ) : (
                    <p>No remediation actions available.</p>
                )}
            </div>

            {/* History */}
            <h3 className="text-xl mb-4">📜 Remediation History</h3>
            <div className="space-y-2">
                {history.length > 0 ? (
                    history
                        .slice()
                        .reverse()
                        .map((h, i) => (
                            <div
                                key={i}
                                className="bg-white/10 p-3 rounded flex justify-between"
                            >
                                <span>
                                    <strong>{h.action}</strong> — {h.desc}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {h.timestamp}
                                </span>
                            </div>
                        ))
                ) : (
                    <p>No remediation actions run yet.</p>
                )}
            </div>
        </div>
    );
}
