import { ImageResponse } from "next/og";

export const alt = "AlgoQuest — алгоритмы для собеседований короткими игровыми уроками";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Бит из иконки приложения, крупно.
const MASCOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <line x1="32" y1="14" x2="32" y2="5" stroke="#5A3EE0" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="5" r="4" fill="#FBBF24"/>
  <circle cx="32" cy="38" r="25" fill="#7C5CFF"/>
  <rect x="13" y="25" width="38" height="26" rx="10" fill="#1F1B3A"/>
  <rect x="21" y="31" width="6" height="9" rx="3" fill="#8EF6FF"/>
  <rect x="37" y="31" width="6" height="9" rx="3" fill="#8EF6FF"/>
  <path d="M28 44 Q32 47 36 44" stroke="#8EF6FF" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "linear-gradient(135deg, #F7F7FB 0%, #ECE7FF 100%)",
          color: "#1F1B3A",
        }}
      >
        <img
          src={`data:image/svg+xml,${encodeURIComponent(MASCOT_SVG)}`}
          width={300}
          height={300}
          alt=""
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#7C5CFF" }}>AlgoQuest</div>
          <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.3 }}>
            Алгоритмы для собеседований — короткими игровыми уроками
          </div>
          <div style={{ fontSize: 30, color: "#6E6A8E" }}>LeetCode Top Interview 150 · паттерны · стрики · XP</div>
        </div>
      </div>
    ),
    size,
  );
}
