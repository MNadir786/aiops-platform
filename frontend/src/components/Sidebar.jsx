// src/components/Sidebar.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Server, BarChart3, FileText, Bell, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [navOpen, setNavOpen] = useState(true);

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: navOpen ? 240 : 80 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="bg-black/40 backdrop-blur-2xl border-r border-white/20 h-screen p-4 flex flex-col space-y-8"
        >
            <button
                onClick={() => setNavOpen(!navOpen)}
                className="text-gray-300 hover:text-white transition"
            >
                <Server className="w-8 h-8 mx-auto" />
            </button>

            <nav className="flex flex-col space-y-6 text-gray-300">
                {[
                    { icon: BarChart3, label: "Dashboard", path: "/" },
                    { icon: Bell, label: "Alerts", path: "/alerts" },
                    { icon: FileText, label: "Logs", path: "/logs" },
                    { icon: Wrench, label: "Remediation", path: "/remediation" },
                    { icon: Package, label: "Assets", path: "/assets" }, // ✅ Assets kept
                ].map(({ icon: Icon, label, path }, i) => (
                    <Link key={i} to={path}>
                        <motion.div
                            whileHover={{ scale: 1.1, x: 5 }}
                            className="flex items-center space-x-4 cursor-pointer hover:text-white"
                        >
                            <Icon className="w-6 h-6" />
                            {navOpen && <span className="font-medium">{label}</span>}
                        </motion.div>
                    </Link>
                ))}
            </nav>
        </motion.aside>
    );
}
