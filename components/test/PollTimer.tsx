import React from "react";

interface PollTimerProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export default function PollTimer({ timeLeft, formatTime }: PollTimerProps) {
  return <div>{formatTime(timeLeft)}</div>;
}