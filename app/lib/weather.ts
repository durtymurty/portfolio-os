export const WEATHER_LOCATION = { label: "San Luis Obispo, CA", latitude: 35.2828, longitude: -120.6596, timezone: "America/Los_Angeles" };

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  high: number;
  low: number;
  code: number;
  isDay: boolean;
  /** ISO timestamp of the observation. */
  observedAt: string;
}

/** WMO weather interpretation codes → label + emoji. https://open-meteo.com/en/docs */
export function describeWeather(code: number, isDay = true): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear sky", emoji: isDay ? "☀️" : "🌙" };
  if (code === 1) return { label: "Mainly clear", emoji: isDay ? "🌤️" : "🌙" };
  if (code === 2) return { label: "Partly cloudy", emoji: "⛅" };
  if (code === 3) return { label: "Overcast", emoji: "☁️" };
  if (code === 45 || code === 48) return { label: "Fog", emoji: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code >= 61 && code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", emoji: "🌦️" };
  if (code === 85 || code === 86) return { label: "Snow showers", emoji: "🌨️" };
  if (code >= 95) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Unknown", emoji: "🌡️" };
}

export function isWeatherData(x: unknown): x is WeatherData {
  if (!x || typeof x !== "object") return false;
  const d = x as Record<string, unknown>;
  return ["temp", "feelsLike", "humidity", "wind", "high", "low", "code"].every((k) => typeof d[k] === "number");
}
