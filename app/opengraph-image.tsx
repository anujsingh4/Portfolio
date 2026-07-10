import { ImageResponse } from "next/og";

export const alt = "Anuj Singh — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0F0E0D",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#1A1816",
              border: "1px solid #2A2622",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D4A24C",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <span style={{ color: "#6B6560", fontSize: 14, letterSpacing: "0.15em" }}>
            PORTFOLIO
          </span>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              color: "#EDEAE4",
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            Anuj
          </div>
          <div
            style={{
              color: "#D4A24C",
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            Singh.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ color: "#6B6560", fontSize: 20, letterSpacing: "0.08em" }}>
            SOFTWARE ENGINEER · FULL-STACK + AI
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#6B6560",
              fontSize: 16,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#D4A24C",
              }}
            />
            Available for work
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
