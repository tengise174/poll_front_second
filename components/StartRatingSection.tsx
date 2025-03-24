import RateStarIcon from "@/public/icons/rate_star";

const StarRatingSection = () => {
  return (
    <div
      style={{ boxShadow: "0px 0px 10px 2px #0000001A" }}
      className="w-[200px] h-9 rounded-full bg-[#FDFDFD] flex items-center px-5 justify-between"
    >
      <RateStarIcon className="text-[#FFC500]" />
      <RateStarIcon className="text-[#FFC500]" />
      <RateStarIcon className="text-[#E0E8F1]" />
      <RateStarIcon className="text-[#E0E8F1]" />
      <RateStarIcon className="text-[#E0E8F1]" />
    </div>
  );
};

export default StarRatingSection;
