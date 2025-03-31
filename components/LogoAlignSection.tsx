import { Dispatch, SetStateAction } from "react";
import AlignRightIcon from "@/public/icons/align_right";
import AlignVertical from "@/public/icons/align_vertical";

const LogoAlignSection = ({
}: {
}) => {
  return (
    <div className="bg-[#E6E6E6] rounded-[10px] w-full h-[40px] flex justify-center items-center text-[#303030] mt-[10px] gap-x-[30px]">
      <AlignVertical
        className={`cursor-pointer "text-[#2C2C2C]" : "text-[#B2B2B2]"
        `}
      />
    </div>
  );
};

export default LogoAlignSection;
