import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        theme: theme,
        alert_threshold: 80,
        refresh_interval: 5,
    });

    // keep local state in sync if theme changes elsewhere
    useEffect(() => {
        setSettings((prev) => ({ ...prev, theme }));
    }, [theme]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // only two supported themes: "dark" and "neon"
        const chosen = settings.theme === "neon" ? "neon" : "dark";
        setTheme(chosen);
        // Save UI feedback
        window.alert("✅ Settings saved!");
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
            <div className="space-y-4 max-w-md">
                {/* Theme Selection */}
                <div>
                    <label className="block mb-1">Theme</label>
                    <select
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-white/10 text-black dark:text-white"
                    >
                        <option value="dark">🌌 Dark (Default)</option>
                        <option value="neon">🌈 Neon Purple Glass</option>
                    </select>
                </div>

                {/* Alert Threshold */}
                <div>
                    <label className="block mb-1">Alert Threshold (%)</label>
                    <input
                        type="number"
                        name="alert_threshold"
                        value={settings.alert_threshold}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-white/10 text-black dark:text-white"
                        min="50"
                        max="100"
                    />
                </div>

                {/* Refresh Interval */}
                <div>
                    <label className="block mb-1">Refresh Interval (seconds)</label>
                    <input
                        type="number"
                        name="refresh_interval"
                        value={settings.refresh_interval}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-white/10 text-black dark:text-white"
                        min="1"
                        max="60"
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-white"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}
