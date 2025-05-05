import React from "react";

interface PollTimerProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export default function PollTimer({ timeLeft, formatTime }: PollTimerProps) {
  return (
    <div className="text-lg font-semibold" style={{ color: "#2C2C2C" }}>
      {formatTime(timeLeft)}
    </div>
  );
}