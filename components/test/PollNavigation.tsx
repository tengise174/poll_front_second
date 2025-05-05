import React from "react";
import CustomButton from "@/components/CustomButton";
import { Button } from "antd";

interface PollNavigationProps {
  questionNo: number;
  totalQuestions: number;
  isButtonDisabled: boolean;
  custStyle: { backgroundColor: string; primaryColor: string };
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
}

export default function PollNavigation({
  questionNo,
  totalQuestions,
  isButtonDisabled,
  custStyle,
  onBack,
  onNext,
  isSubmitting,
  showSubmit,
}: PollNavigationProps) {
  return (
    <div className="w-full flex flex-row gap-24 justify-between items-center">
      <CustomButton
        title="Буцах"
        className="text-[#B3B3B3] text-[13px] font-semibold h-9 w-[79px] hover:cursor-pointer"
        onClick={onBack}
      />
      {showSubmit ? (
        <Button
          type="primary"
          size="large"
          className="hover:cursor-pointer"
          loading={isSubmitting}
          disabled={isButtonDisabled}
          onClick={onNext}
          style={{
            backgroundColor: !isButtonDisabled
              ? custStyle.primaryColor
              : "#D9D9D9",
            color: custStyle.backgroundColor,
            borderRadius: 99,
            height: 40,
            width: 280,
          }}
        >
          Дуусгах
        </Button>
      ) : (
        <CustomButton
          title={questionNo === totalQuestions - 1 ? "Дуусгах" : "Цааш"}
          className="h-9 w-[220px] rounded-[99px] text-[13px] font-semibold cursor-pointer"
          style={{
            color: custStyle.backgroundColor,
            backgroundColor: isButtonDisabled
              ? "#D9D9D9"
              : custStyle.primaryColor,
          }}
          disabled={isButtonDisabled}
          onClick={onNext}
        />
      )}
    </div>
  );
}