import { ImageResponse } from "next/og";
import { PROFILE } from "./data";

export const alt = `${PROFILE.name} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #060612 0%, #0a0f1e 50%, #060e18 100%)",
          color: "#f0f6fc",
        }}
      >
        <div style={{ fontSize: 28, color: "#58a6ff", letterSpacing: 6, textTransform: "uppercase" }}>Portfolio</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 20 }}>{PROFILE.name}</div>
        <div style={{ fontSize: 36, color: "#8b949e", marginTop: 16 }}>{PROFILE.title}</div>
      </div>
    ),
    size,
  );
}
