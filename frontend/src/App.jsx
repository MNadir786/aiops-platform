import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    fetch("/api/health") // 👈 relative path, will be proxied
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold">
      🚀 AIOps Platform – Frontend is Running!
      <p className="mt-4">Backend status: {status}</p>
    </div>
  );
}
