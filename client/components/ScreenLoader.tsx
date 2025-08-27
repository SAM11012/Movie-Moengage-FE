import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ScreenLoader() {
  const { theme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          theme === "light"
            ? "rgba(255,255,255,0.7)"
            : "rgba(17,17,17,0.7)",
        backdropFilter: "blur(2px)",
      }}
      aria-label="Loading"
    >
      <svg
        className="animate-spin"
        width="64"
        height="64"
        viewBox="0 0 50 50"
        style={{ color: theme === "light" ? "#ef4444" : "#fff" }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={theme === "light" ? "#ef4444" : "#fff"}
          strokeWidth="5"
          strokeDasharray="90,150"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
