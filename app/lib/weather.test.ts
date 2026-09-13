import { describe, expect, it } from "vitest";
import { describeWeather, isWeatherData } from "./weather";

describe("describeWeather", () => {
  it.each([
    [0, "Clear sky"],
    [3, "Overcast"],
    [45, "Fog"],
    [53, "Drizzle"],
    [63, "Rain"],
    [81, "Rain showers"],
    [85, "Snow showers"],
    [95, "Thunderstorm"],
  ])("code %i → %s", (code, label) => {
    expect(describeWeather(code).label).toBe(label);
  });

  it("uses a moon at night for clear skies", () => {
    expect(describeWeather(0, false).emoji).toBe("🌙");
  });
});

describe("isWeatherData", () => {
  it("rejects error payloads", () => {
    expect(isWeatherData({ error: "nope" })).toBe(false);
    expect(isWeatherData(null)).toBe(false);
  });
});
