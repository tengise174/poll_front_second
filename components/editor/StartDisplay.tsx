import React from "react";
import { StartDisplayProps } from "@/utils/componentTypes";
import BoxIcon from "@/public/icons/box_icon";

const StartDisplay = ({
  startPage,
  dualColors,
  activeColor,
  uploadedImage,
}: StartDisplayProps) => {
  return (
    <div
      id="start_prev"
      style={{
        color: dualColors[activeColor][1],
        backgroundColor: dualColors[activeColor][0],
      }}
      className={`border border-[#303030] rounded-[10px] w-full h-full flex flex-col justify-between pt-10 px-5 pb-5`}
    >
      <div className="w-full flex flex-col items-center">
        <div
          className={`w-full flex flex-col items-center
          `}
        >
          {!uploadedImage ? (
            <BoxIcon className="w-11 h-11 rounded-md text-red-200" />
          ) : (
            <img
              src={uploadedImage}
              className="rounded-md"
              style={{ width: 44, height: 44 }}
              alt="Uploaded Preview"
            />
          )}
        </div>
        <p
          style={{ color: dualColors[activeColor][1] }}
          className="text-[14px] leading-[17px] font-semibold mt-[100px]"
        >
          {startPage?.title}
        </p>
        <p
          style={{ color: dualColors[activeColor][1] }}
          className="text-[14px] leading-[17px] font-semibold mt-5 text-center"
        >
          {startPage?.greetingMessage}
        </p>
        <p
          style={{
            color: dualColors[activeColor][0],
            backgroundColor: dualColors[activeColor][1],
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
