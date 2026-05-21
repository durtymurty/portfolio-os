"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  wind: number;
  high: number;
  low: number;
}

export default function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/weather")
      .then(r => r.json())
      .then(data => { setWeather(data); setLoading(false); })
      .catch(() => { setError("Could not load weather"); setLoading(false); });
  }, []);

  const getEmoji = (desc: string) => {
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("thunder")) return "⛈️";
    if (desc.includes("fog") || desc.includes("mist")) return "🌫️";
    return "🌤️";
  };

  if (loading) return <div style={{ color: "#8b949e", textAlign: "center", padding: "40px" }}>Loading weather...</div>;
  if (error || !weather) return <div style={{ color: "#f85149", textAlign: "center", padding: "40px" }}>{error || "No data"}</div>;

  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: "13px", color: "#8b949e", marginBottom: "8px" }}>📍 San Luis Obispo, CA</p>
        <div style={{ fontSize: "72px", marginBottom: "8px" }}>{getEmoji(weather.description)}</div>
        <div style={{ fontSize: "64px", fontWeight: "200", color: "#f0f6fc" }}>{Math.round(weather.temp)}°</div>
        <p style={{ fontSize: "16px", color: "#8b949e", textTransform: "capitalize", marginTop: "4px" }}>{weather.description}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { label: "Feels Like", value: `${Math.round(weather.feels_like)}°F`, icon: "🌡️" },
          { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
          { label: "Wind", value: `${weather.wind} mph`, icon: "💨" },
          { label: "H/L", value: `${Math.round(weather.high)}° / ${Math.round(weather.low)}°`, icon: "📊" },
        ].map(item => (
          <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{item.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#f0f6fc" }}>{item.value}</div>
            <div style={{ fontSize: "11px", color: "#8b949e", marginTop: "2px" }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}