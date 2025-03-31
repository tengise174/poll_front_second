import React from "react";
import BoxIcon from "@/public/icons/box_icon";
import { EndDisplayProps } from "@/utils/componentTypes";

const EndDisplay = ({
  endPage,
  dualColors,
  activeColor,
  uploadedImage,
}: EndDisplayProps) => {
  return (
    <div
      style={{
        color: dualColors[activeColor][1],
        backgroundColor: dualColors[activeColor][0],
      }}
      className={`border border-[#303030] rounded-[10px] w-full h-full flex flex-col justify-between pt-10 px-5 pb-5`}
    >
      <div className="w-full flex flex-col items-center">
        <div
          className={`w-full flex flex-col items-center`}
        >
          {!uploadedImage ? (
            <BoxIcon className="w-11 h-11 rounded-md" />
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
          {endPage?.endTitle}
        </p>
        <p
          style={{ color: dualColors[activeColor][1] }}
          className="text-[14px] leading-[17px] font-semibold mt-5 text-center"
        >
          {endPage?.thankYouMessage}
        </p>
      </div>
    </div>
  );
};

export default EndDisplay;
