"use client";

import { useEffect, useState } from "react";
import { describeWeather, isWeatherData, WEATHER_LOCATION, type WeatherData } from "../../lib/weather";
import { Icon } from "../ui";

type Load = { status: "loading" } | { status: "error" } | { status: "ok"; data: WeatherData };

export default function WeatherApp() {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/weather", { signal: controller.signal })
      .then(async (res) => {
        const body: unknown = await res.json();
        if (!res.ok || !isWeatherData(body)) throw new Error("Bad weather response");
        setLoad({ status: "ok", data: body });
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn("Weather failed to load", err);
          setLoad({ status: "error" });
        }
      });
    return () => controller.abort();
  }, [attempt]);

  if (load.status === "loading") {
    return <p role="status" className="p-10 text-center text-fg-muted">Loading weather…</p>;
  }

  if (load.status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-danger">Couldn&apos;t load the weather.</p>
        <button
          type="button"
          onClick={() => { setLoad({ status: "loading" }); setAttempt((a) => a + 1); }}
          className="rounded-md border border-line bg-raised px-3 py-1.5 text-sm text-fg-strong hover:bg-white/10"
        >
          Try again
        </button>
      </div>
    );
  }

  const w = load.data;
  const { label, emoji } = describeWeather(w.code, w.isDay);
  const stats = [
    { label: "Feels like", value: `${Math.round(w.feelsLike)}°F`, icon: "🌡️" },
    { label: "Humidity", value: `${Math.round(w.humidity)}%`, icon: "💧" },
    { label: "Wind", value: `${Math.round(w.wind)} mph`, icon: "💨" },
    { label: "High / Low", value: `${Math.round(w.high)}° / ${Math.round(w.low)}°`, icon: "📊" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="py-4 text-center">
        <p className="mb-2 text-[13px] text-fg-muted"><Icon>📍</Icon> {WEATHER_LOCATION.label}</p>
        <Icon className="mb-2 block text-7xl">{emoji}</Icon>
        <p className="text-6xl font-extralight text-fg-strong">
          {Math.round(w.temp)}°<span className="sr-only">F</span>
        </p>
        <p className="mt-1 text-base text-fg-muted">{label}</p>
      </div>
      <dl className="grid grid-cols-2 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse rounded-xl border border-line bg-raised p-3.5 text-center">
            <dt className="mt-0.5 text-[11px] text-fg-muted">{s.label}</dt>
            <dd className="text-lg font-semibold text-fg-strong">
              <Icon className="mb-1 block text-xl">{s.icon}</Icon>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
