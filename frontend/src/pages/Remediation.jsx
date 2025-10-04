// frontend/src/pages/Remediation.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, List, ShieldCheck, Activity } from "lucide-react";

export default function Remediation() {
    const [target, setTarget] = useState("cicd");
    const [action, setAction] = useState("");
    const [params, setParams] = useState("{}");
    const [result, setResult] = useState(null);
    const [audit, setAudit] = useState([]);

    // Available actions per target
    const ACTIONS = {
        cicd: ["restart_pipeline", "rollback"],
        infrastructure: ["scale", "restart_service"],
        medical: ["diagnose", "recommend_patch", "alert_team", "restart"],
    };

    // Fetch audit logs
    const fetchAudit = () => {
        fetch("/api/remediation/audit")
            .then((res) => res.json())
            .then((data) => setAudit(data.audit || []));
    };

    useEffect(() => {
        fetchAudit();
        const interval = setInterval(fetchAudit, 5000);
        return () => clearInterval(interval);
    }, []);

    // Submit remediation
    const runRemediation = async () => {
        try {
            const res = await fetch("/api/remediation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    target,
                    action,
                    params: JSON.parse(params || "{}"),
                }),
            });
            const data = await res.json();
            setResult(data);
            fetchAudit();
        } catch (err) {
            setResult({ error: "Invalid request or JSON params" });
        }
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
                <span>Automated Remediation</span>
            </h2>

            {/* Controls */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Target */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Target</label>
                    <select
                        value={target}
                        onChange={(e) => {
                            setTarget(e.target.value);
                            setAction("");
                        }}
                        className="w-full p-2 rounded bg-black/40 border border-gray-700"
                    >
                        <option value="cicd">CI/CD</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="medical">Medical</option>
                    </select>
                </div>

                {/* Action */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Action</label>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="w-full p-2 rounded bg-black/40 border border-gray-700"
                    >
                        <option value="">-- Select Action --</option>
                        {ACTIONS[target].map((a, i) => (
                            <option key={i} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Params */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Parameters (JSON)</label>
                    <textarea
                        rows="4"
                        value={params}
                        onChange={(e) => setParams(e.target.value)}
                        className="w-full p-2 rounded bg-black/40 border border-gray-700 font-mono text-sm"
                        placeholder='{"pipeline_id":"123"}'
                    />
                </div>
            </div>

            {/* Run Button */}
            <div className="flex justify-start mb-8">
                <button
                    onClick={runRemediation}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center space-x-2"
                >
                    <Play className="w-5 h-5" />
                    <span>Run Remediation</span>
                </button>
            </div>

            {/* Result */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-4 bg-black/40 rounded-lg border border-gray-700"
                >
                    <h3 className="font-bold mb-2">Result</h3>
                    <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </motion.div>
            )}

            {/* Audit Logs */}
            <div>
                <h3 className="font-bold mb-3 flex items-center space-x-2">
                    <List className="w-5 h-5 text-yellow-400" />
                    <span>Recent Audit Logs</span>
                </h3>
                {audit.length === 0 ? (
                    <p className="text-gray-400">No audit logs yet.</p>
                ) : (
                    <div className="space-y-3">
                        {audit.map((log, i) => (
                            <div
                                key={i}
                                className="p-3 rounded bg-gray-800/50 border border-gray-700"
                            >
                                <p className="text-sm text-gray-400">
                                    <Activity className="inline w-4 h-4 mr-2 text-indigo-400" />
                                    {log.timestamp} — <span className="font-semibold">{log.target}:{log.action}</span>
                                </p>
                                <pre className="text-xs text-green-400 mt-1 whitespace-pre-wrap">
                                    {JSON.stringify(log.result, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
