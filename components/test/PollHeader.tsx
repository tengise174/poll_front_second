import React from "react";
import CustomButton from "@/components/CustomButton";
import BoxIcon from "@/public/icons/box_icon";
import { Switch } from "antd";

interface PollHeaderProps {
  title: string;
  greetingMessage: string;
  duration: number;
  displayMode: "single" | "all";
  hasNextQuestionOrder: boolean;
  setDisplayMode: (mode: "single" | "all") => void;
  custStyle: { backgroundColor: string; primaryColor: string };
  btnLabel: string;
  onStart: () => void;
}

export default function PollHeader({
  title,
  greetingMessage,
  duration,
  displayMode,
  hasNextQuestionOrder,
  setDisplayMode,
  custStyle,
  btnLabel,
  onStart,
}: PollHeaderProps) {
  return (
    <div className="flex flex-col gap-20 items-center max-w-[630px]">
      <div className="flex flex-col gap-5">
        <h1
          style={{ color: custStyle.primaryColor }}
          className="text-center text-5xl font-semibold"
        >
          {title}
        </h1>
        <p
          style={{ color: custStyle.primaryColor }}
          className="text-center text-base font-medium"
        >
          {greetingMessage}
        </p>
        <div className="flex flex-col items-center gap-[10px]">
          <p
            style={{ color: custStyle.primaryColor }}
            className="text-[13px] font-medium"
          >
            Судалгааны хугацаа
          </p>
          <div className="rounded-[99px] px-5 py-[5px] bg-[#434343] text-white text-sm font-medium">
            {duration} мин
          </div>
        </div>
        {!hasNextQuestionOrder && (
          <div className="flex items-center gap-4">
            <p
              style={{ color: custStyle.primaryColor }}
              className="text-[13px] font-medium"
            >
              {displayMode === "single" ? "Нэг асуулт" : "Бүх асуултууд"}
            </p>
            <Switch
              checked={displayMode === "all"}
              onChange={(checked) => setDisplayMode(checked ? "all" : "single")}
              checkedChildren="Бүгд"
              unCheckedChildren="Нэг"
            />
          </div>
        )}
      </div>
      <CustomButton
        titleClassname="text-base font-medium"
        className="h-[42px] w-[200px] rounded-[999px] hover:cursor-pointer"
        style={{
          backgroundColor: custStyle.primaryColor,
          color: custStyle.backgroundColor,
        }}
        title={btnLabel || "Эхлэх"}
        onClick={onStart}
      />
    </div>
  );
}