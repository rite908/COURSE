import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TWH Academy — Technical White Hat";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0F1E 0%, #1D2B53 45%, #2563EB 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            }}
          >
            <svg width="40" height="44" viewBox="0 0 18 20" fill="none">
              <path
                d="M9 0.5L17 4V10C17 14.8 13.4 18.8 9 19.5C4.6 18.8 1 14.8 1 10V4L9 0.5Z"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M6 10L8 12L12 8"
                stroke="white"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1 }}>
              TWH Academy
            </span>
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#BFDBFE", fontWeight: 600, textAlign: "center", maxWidth: 900 }}>
          Master Computers. Hack The World.
        </div>
        <div style={{ fontSize: 22, color: "#93C5FD", marginTop: 18, fontWeight: 500 }}>
          India&apos;s Premier Ethical Hacking Academy
        </div>
      </div>
    ),
    { ...size }
  );
}
