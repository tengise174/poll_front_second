import React from "react";
import CustomButton from "@/components/CustomButton";
import BoxIcon from "@/public/icons/box_icon";
import ArrowRightIcon from "@/public/icons/arrow_right";

interface PollEndScreenProps {
  custStyle: { backgroundColor: string; primaryColor: string };
  onMyPolls: () => void;
}

export default function PollEndScreen({ custStyle, onMyPolls }: PollEndScreenProps) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-4">
        <p
          className="text-base font-medium"
          style={{ color: custStyle.primaryColor }}
        >
          Таны асуулга амжилттай илгээгдлээ
        </p>
        <BoxIcon />
      </div>
      <CustomButton
        style={{
          color: custStyle.backgroundColor,
          backgroundColor: custStyle.primaryColor,
        }}
        title={
          <div className="flex flex-row items-center justify-center gap-[10px] text-xs">
            <span>Миний асуулга</span>
            <ArrowRightIcon />
          </div>
        }
        onClick={onMyPolls}
        className="text-[13px] font-semibold h-9 w-[220px] rounded-[99px] hover:cursor-pointer"
      />
    </div>
  );
}