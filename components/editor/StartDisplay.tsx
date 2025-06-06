import React from "react";
import { Image } from "antd";
import { StartDisplayProps } from "@/utils/componentTypes";
import BoxIcon from "@/public/icons/box_icon";

const StartDisplay = ({
  startPage,
  dualColors,
  themeId,
}: StartDisplayProps) => {
  return (
    <div
      id="start_prev"
      style={{
        color: dualColors[themeId][1],
        backgroundColor: dualColors[themeId][0],
      }}
      className={`border border-[#303030] rounded-[10px] w-full h-full flex flex-col justify-between pt-10 px-5 pb-5`}
    >
      <div className="w-full flex flex-col items-center">
        {startPage?.poster ? (
          <Image
            src={startPage?.poster}
            height={200}
            style={{
              width: "auto",
            }}
            alt="poster"
          /> 
        ): (
          <BoxIcon />
        )}
        <p
          style={{ color: dualColors[themeId][1] }}
          className="text-[18px] leading-[17px] font-semibold mt-[100px]"
        >
          {startPage?.title || "Гарчиг"}
        </p>
        <p
          style={{ color: dualColors[themeId][1] }}
          className="text-[14px] leading-[17px] font-normal mt-5 text-center"
        >
          {startPage?.greetingMessage || "Тайлбар"}
        </p>
        <p
          style={{
            color: dualColors[themeId][0],
            backgroundColor: dualColors[themeId][1],
          }}
          className={`w-[200px] h-9 rounded-full mt-[100px] flex items-center justify-center text-[14px] font-semibold cursor-pointer`}
        >
          {startPage?.btnLabel || "Эхлэх"}
        </p>
      </div>
    </div>
  );
};

export default StartDisplay;
