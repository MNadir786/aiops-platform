import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function MetricsChart({ title, endpoint }) {
    const [data, setData] = useState([]);
    const [scope, setScope] = useState({ node: "" });

    useEffect(() => {
        const fetchData = async () => {
            let url = `/api${endpoint}`;
            if (scope.node) url += `?node=${scope.node}`;
            const res = await fetch(url);
            const json = await res.json();

            if (json.data && json.data.result.length > 0) {
                const values = json.data.result[0].values;
                setData(
                    values.map(([ts, v]) => ({
                        time: new Date(ts * 1000).toLocaleTimeString(),
                        value: parseFloat(v),
                    }))
                );
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, [endpoint, scope]);

    return (
        <div className="bg-gray-900 p-4 rounded-xl shadow border border-gray-800">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">{title}</h4>
                {/* Node filter */}
                <select
                    value={scope.node}
                    onChange={(e) => setScope({ ...scope, node: e.target.value })}
                    className="bg-gray-800 text-white rounded px-2 py-1 border border-gray-700 text-sm"
                >
                    <option value="">All Nodes</option>
                    <option value="node-1">node-1</option>
                    <option value="node-2">node-2</option>
                    <option value="node-3">node-3</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #333",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
