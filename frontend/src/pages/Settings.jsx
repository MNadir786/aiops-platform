// src/pages/Settings.jsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        theme: theme,
        alert_threshold: 80,
        refresh_interval: 5
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setTheme(settings.theme);
        alert("✅ Settings saved!");
    };

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block mb-1">Theme</label>
                    <select
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-white/10 text-white"
                    >
                        <option value="dark">Dark Neon</option>
                        <option value="light">Light Glass</option>
                    </select>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}
