import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function CenteredSpinner() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-center py-10">
      <svg
        className="animate-spin"
        width="48"
        height="48"
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
