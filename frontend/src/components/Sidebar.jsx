// frontend/src/components/Sidebar.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    Bell,
    FileText,
    Wrench,
    Package,
    Activity,
    Settings,
    Plug,
    Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const [navOpen, setNavOpen] = useState(true);

    const links = [
        { icon: BarChart3, label: "Dashboard", path: "/" },
        { icon: Bell, label: "Alerts", path: "/alerts" },
        { icon: FileText, label: "Logs", path: "/logs" },
        { icon: Wrench, label: "Remediation", path: "/remediation" },
        { icon: Package, label: "Discovery", path: "/discovery" }, // ✅ Replaced Assets → Discovery
        { icon: Activity, label: "Analytics", path: "/analytics" },
    ];

    const enterpriseLinks = [
        { icon: Plug, label: "Integrations", path: "/integrations" },
        { icon: Shield, label: "Audit Logs", path: "/audit-logs" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: navOpen ? 240 : 80 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="bg-black/50 backdrop-blur-2xl border-r border-white/10 h-screen p-4 flex flex-col space-y-8"
        >
            {/* Toggle */}
            <button
                onClick={() => setNavOpen(!navOpen)}
                className="text-gray-400 hover:text-white transition"
            >
                <BarChart3 className="w-8 h-8 mx-auto" />
            </button>

            {/* Core Nav */}
            <nav className="flex flex-col space-y-6 text-gray-300">
                {links.map(({ icon: Icon, label, path }, i) => (
                    <NavLink
                        key={i}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 hover:text-white transition ${isActive ? "text-indigo-400 font-semibold" : ""
                            }`
                        }
                    >
                        <Icon className="w-6 h-6" />
                        {navOpen && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-700 my-4"></div>

            {/* Enterprise Nav */}
            <nav className="flex flex-col space-y-6 text-gray-300">
                {enterpriseLinks.map(({ icon: Icon, label, path }, i) => (
                    <NavLink
                        key={i}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 hover:text-white transition ${isActive ? "text-indigo-400 font-semibold" : ""
                            }`
                        }
                    >
                        <Icon className="w-6 h-6" />
                        {navOpen && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>
        </motion.aside>
    );
}
