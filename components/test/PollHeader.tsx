import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import BoxIcon from "@/public/icons/box_icon";
import { Switch, Checkbox } from "antd";

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
  isShowUser: boolean;
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
  isShowUser,
}: PollHeaderProps) {
  const [isNameShown, setIsNameShown] = useState(false);

  return (
    <div className="flex flex-col gap-20 items-center max-w-[630px]">
      <div className="flex flex-col gap-5 items-center">
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
        {isShowUser && (
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isNameShown}
              onChange={(e) => setIsNameShown(e.target.checked)}
              style={{ color: custStyle.primaryColor }}
            >
              <span style={{ color: custStyle.primaryColor }}>
                Санал асуулга үүсгэгч таны хариултыг харж чадна.
              </span>
            </Checkbox>
          </div>
        )}
      </div>
      <CustomButton
        titleClassname="text-base font-medium"
        className="h-[42px] w-[200px] rounded-[999px] hover:cursor-pointer"
        style={{
          backgroundColor: custStyle.primaryColor,
          color: custStyle.backgroundColor,
          opacity: isShowUser && !isNameShown ? 0.5 : 1,
          cursor: isShowUser && !isNameShown ? "not-allowed" : "pointer",
        }}
        title={btnLabel || "Эхлэх"}
        onClick={onStart}
        disabled={isShowUser && !isNameShown}
      />
    </div>
  );
}
