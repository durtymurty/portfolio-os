import { NextResponse } from "next/server";
import { WEATHER_LOCATION, type WeatherData } from "../../lib/weather";

// Always run on request; freshness is controlled by the CDN cache headers below,
// so failed upstream calls are never cached.
export const dynamic = "force-dynamic";

const { latitude, longitude, timezone } = WEATHER_LOCATION;
const UPSTREAM =
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
  "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day" +
  "&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph" +
  `&timezone=${encodeURIComponent(timezone)}&forecast_days=1`;

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const { current, daily } = await res.json();

    const data: WeatherData = {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      wind: current.wind_speed_10m,
      high: daily.temperature_2m_max[0],
      low: daily.temperature_2m_min[0],
      code: current.weather_code,
      isDay: current.is_day === 1,
      observedAt: current.time,
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" },
    });
  } catch (err) {
    console.error("[api/weather]", err);
    return NextResponse.json(
      { error: "Weather is unavailable right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
