import AlignRightIcon from "@/public/icons/align_right";
import AlignVertical from "@/public/icons/align_vertical";
import { Dispatch, SetStateAction } from "react";

const LogoAlignSection = ({
  activeIcon,
  setActiveIcon,
}: {
  activeIcon: string;
  setActiveIcon: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="bg-[#E6E6E6] rounded-[10px] w-full h-[40px] flex justify-center items-center text-[#303030] mt-[10px] gap-x-[30px]">
      <AlignRightIcon
        className={`cursor-pointer ${
          activeIcon === "TOP_LEFT" ? "text-[#2C2C2C]" : "text-[#B2B2B2]"
        }`}
        onClick={() => setActiveIcon("TOP_LEFT")}
      />
      <AlignVertical
        className={`cursor-pointer ${
          activeIcon === "TOP_MIDDLE" ? "text-[#2C2C2C]" : "text-[#B2B2B2]"
        }`}
        onClick={() => setActiveIcon("TOP_MIDDLE")}
      />
      <AlignRightIcon
        className={`cursor-pointer scale-x-[-1] ${
          activeIcon === "TOP_RIGHT" ? "text-[#2C2C2C]" : "text-[#B2B2B2]"
        }`}
        onClick={() => setActiveIcon("TOP_RIGHT")}
      />
    </div>
  );
};

export default LogoAlignSection;
