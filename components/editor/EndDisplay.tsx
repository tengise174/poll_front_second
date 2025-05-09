import React from "react";
import { EndDisplayProps } from "@/utils/componentTypes";

const EndDisplay = ({ endPage, dualColors, themeId }: EndDisplayProps) => {
  return (
    <div
      style={{
        color: dualColors[themeId][1],
        backgroundColor: dualColors[themeId][0],
      }}
      className={`border border-[#303030] rounded-[10px] w-full h-full flex flex-col justify-between pt-10 px-5 pb-5`}
    >
      <div className="w-full flex flex-col items-center">
        <p
          style={{ color: dualColors[themeId][1] }}
          className="text-[18px] leading-[17px] font-semibold mt-[100px]"
        >
          {endPage?.endTitle || "Талархлын үг"}
        </p>
        <p
          style={{ color: dualColors[themeId][1] }}
          className="text-[14px] leading-[17px] font-normal mt-5 text-center"
        >
          {endPage?.thankYouMessage || "Асуулгын тухай тайлбар"}
        </p>
      </div>
    </div>
  );
};

export default EndDisplay;
