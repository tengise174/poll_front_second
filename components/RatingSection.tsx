import RateStarIcon from "@/public/icons/rate_star";


export const RateSection = ({ rateType, rateNumber }: { rateType: 'STAR' | 'NUMBER', rateNumber: number }) => {
  const validatedCount = Math.max(1, Math.min(rateNumber, 10)); 
  
  if (rateType === 'STAR') {
    return (
      <div
        style={{ boxShadow: "0px 0px 10px 2px #0000001A" }}
        className="w-[200px] h-9 rounded-full bg-[#FDFDFD] flex items-center px-5 justify-between"
      >
        {[...Array(validatedCount)].map((_, index) => (
          <RateStarIcon
            key={index}
            className="text-[#FFC500]"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{ boxShadow: "0px 0px 10px 2px #0000001A" }}
      className="w-[200px] h-9 rounded-full bg-[#FDFDFD] flex items-center px-5 justify-between"
    >
      {[...Array(validatedCount)].map((_, index) => (
        <p
          key={index}
          className="text-black text-[16px] font-semibold"
        >
          {index + 1}
        </p>
      ))}
    </div>
  );
};
export default RateSection;

