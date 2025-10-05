// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Logs from "./pages/Logs";
import Remediation from "./pages/Remediation";
import Discovery from "./pages/Discovery";
import Analytics from "./pages/Analytics";
import AgentDetails from "./pages/AgentDetails";
import Settings from "./pages/Settings"; // ✅ ADD THIS

function AppContent() {
  return (
    <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-lg py-4 px-6 shadow-lg border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center space-x-2">
              <span className="text-indigo-400">X-Reach</span>
              <span>AIOps Control Plane</span>
              <span className="text-gray-400 text-sm">(ACP)</span>
            </h1>
            <p className="text-xs text-gray-400">
              Unified Observability & Automated Remediation
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-xs bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
              Restart
            </button>
            <button className="px-3 py-1 text-xs bg-purple-600 rounded-md hover:bg-purple-700 transition">
              Scale
            </button>
            <button className="px-3 py-1 text-xs bg-pink-600 rounded-md hover:bg-pink-700 transition">
              Deploy
            </button>
            <button className="px-3 py-1 text-xs bg-green-600 rounded-md hover:bg-green-700 transition">
              Anomaly Detection
            </button>
            <div className="ml-6">
              <img
                src="https://ui-avatars.com/api/?name=XR&background=4f46e5&color=fff"
                alt="user"
                className="w-8 h-8 rounded-full border border-white/20"
              />
            </div>
          </div>
        </header>

        {/* Routes */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/remediation" element={<Remediation />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/agent/:agentId" element={<AgentDetails />} />
            <Route path="/settings" element={<Settings />} /> {/* ✅ NOW ADDED */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
