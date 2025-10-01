// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Server } from "lucide-react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Logs from "./pages/Logs";
import SettingsPage from "./pages/Settings";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative min-h-screen flex overflow-hidden ${theme === "dark"
          ? "bg-gradient-to-br from-black via-purple-900 to-blue-900 text-white"
          : "bg-gray-100 text-black"
        }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white/5 backdrop-blur-lg py-6 shadow-lg border-b border-white/10">
          <h1 className="text-4xl font-extrabold text-center flex items-center justify-center space-x-3">
            <Server className="w-10 h-10 text-blue-300" />
            <span className="tracking-wide">🚀 AIOps Dashboard</span>
          </h1>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
