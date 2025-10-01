// src/components/Gauge.jsx
import React from "react";

export default function Gauge({ value, label }) {
    // clamp between 0–100
    const percentage = Math.max(0, Math.min(value, 100));

    // map percentage to degrees: 0% = 180° (left), 100% = 0° (right)
    const angle = 180 - (percentage / 100) * 180;

    // color logic
    let needleColor = "#22c55e"; // green
    if (percentage > 80) needleColor = "#ef4444"; // red
    else if (percentage > 60) needleColor = "#facc15"; // yellow

    // gradient id (unique per label)
    const gradientId = `gauge-gradient-${label.replace(/\s+/g, "")}`;

    return (
        <div className="flex flex-col items-center">
            <svg width="200" height="120" viewBox="0 0 200 120">
                {/* gradient */}
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />   {/* green */}
                        <stop offset="60%" stopColor="#facc15" />  {/* yellow */}
                        <stop offset="100%" stopColor="#ef4444" /> {/* red */}
                    </linearGradient>
                </defs>

                {/* background arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="15"
                    strokeLinecap="round"
                />

                {/* colored arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="15"
                    strokeLinecap="round"
                />

                {/* needle */}
                <line
                    x1="100"
                    y1="100"
                    x2={100 + 70 * Math.cos((Math.PI / 180) * angle)}
                    y2={100 - 70 * Math.sin((Math.PI / 180) * angle)} // subtract Y to flip orientation
                    stroke={needleColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* needle center circle */}
                <circle cx="100" cy="100" r="10" fill={needleColor} />
            </svg>

            {/* value & label */}
            <p
                className={`text-2xl font-bold mt-2 ${percentage > 80
                        ? "text-red-400"
                        : percentage > 60
                            ? "text-yellow-400"
                            : "text-green-400"
                    }`}
            >
                {percentage}%
            </p>
            <p className="text-sm text-gray-300">{label}</p>
        </div>
    );
}
